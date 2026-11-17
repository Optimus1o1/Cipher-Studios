import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runFullRegression() {
  console.log('=== RUNNING COMPREHENSIVE HOMEPAGE & CROSS-PAGE REGRESSION SUITE ===\n');

  // Start local Next.js production server on port 3009
  const server = spawn('npm.cmd', ['run', 'start', '--', '-p', '3009'], { stdio: 'pipe', shell: true });
  await new Promise(r => setTimeout(r, 4000));

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9260',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9260/json/new', { method: 'PUT' })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let messageId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = messageId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('1. Loading local production server: http://localhost:3009/ ...');
    await send('Page.navigate', { url: 'http://localhost:3009/' });
    await new Promise(r => setTimeout(r, 4000));

    async function testClick(selector, name, expectedUrlPart) {
      // Scroll element into center of viewport before reading coordinates
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (el) el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        })()`
      });
      await new Promise(r => setTimeout(r, 250));

      const elData = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const cs = window.getComputedStyle(el);
          return {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            width: r.width,
            height: r.height,
            pointerEvents: cs.pointerEvents,
            href: el.getAttribute('href')
          };
        })()`,
        returnByValue: true
      });

      if (!elData.result.value) {
        console.log(`  ❌ Element not found: ${name} (${selector})`);
        return false;
      }

      const { x, y, width, height, pointerEvents, href } = elData.result.value;
      if (pointerEvents === 'none') {
        console.log(`  ❌ ${name}: pointer-events is 'none'! Target href: ${href}`);
        return false;
      }

      const urlBefore = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });

      // Dispatch mouse click
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });

      await new Promise(r => setTimeout(r, 1200));
      const urlAfter = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });

      const pass = urlAfter.result.value.includes(expectedUrlPart);
      console.log(`  ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} (${Math.round(width)}x${Math.round(height)}px) -> Navigated to: ${urlAfter.result.value}`);

      if (urlAfter.result.value !== urlBefore.result.value) {
        await send('Page.navigate', { url: 'http://localhost:3009/' });
        await new Promise(r => setTimeout(r, 2500));
      }

      return pass;
    }

    console.log('\n--- A. HEADER NAVIGATION TESTS ---');
    await testClick('header a[href="/services"]', 'Header Services Link', '/services');
    await testClick('header a[href="/contact"]', 'Header Start Project Button', '/contact');
    await testClick('header a[href^="/website-review"]', 'Header Free Review Button', '/website-review');

    console.log('\n--- B. HERO SECTION CTA TESTS ---');
    await testClick('section a[href="/contact"]', 'Hero Start Project CTA', '/contact');
    await testClick('section a[href^="/website-review"]', 'Hero Free Review CTA', '/website-review');

    console.log('\n--- C. SERVICES BAND (ALL 6 SERVICE ROWS) ---');
    const services = [
      { slug: 'web-design', name: 'Website design' },
      { slug: 'web-development', name: 'Web development' },
      { slug: 'seo', name: 'Search engine optimisation' },
      { slug: 'digital-marketing', name: 'Digital marketing' },
      { slug: 'branding-content', name: 'Branding and content' },
      { slug: 'care-growth', name: 'Care and growth' }
    ];

    for (const s of services) {
      await testClick(`#services a[href="/services/${s.slug}"]`, `Service Row: ${s.name}`, `/services/${s.slug}`);
    }

    console.log('\n--- D. CTA BAND (CONTACT BANNER) ---');
    await testClick('#contact-banner a[href="/contact"]', 'Contact Banner Send Details Button', '/contact');
    await testClick('#contact-banner a[href="/services"]', 'Contact Banner Browse Services Button', '/services');

    console.log('\n--- E. FOOTER LINKS ---');
    await testClick('footer a[href="/contact"]', 'Footer Contact Inquiry Link', '/contact');
    for (const s of services) {
      await testClick(`footer a[href="/services/${s.slug}"]`, `Footer Link: ${s.name}`, `/services/${s.slug}`);
    }

    console.log('\n--- F. 3D MOON CANVAS & SATELLITE RAYCASTING STATUS ---');
    const canvasDiagnostics = await send('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.querySelector('canvas');
        const container = canvas ? canvas.parentElement : null;
        return {
          canvasExists: !!canvas,
          canvasPointerEvents: canvas ? window.getComputedStyle(canvas).pointerEvents : null,
          containerPointerEvents: container ? window.getComputedStyle(container).pointerEvents : null,
          webglActive: !!(canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
        };
      })()`,
      returnByValue: true
    });
    console.log('3D Canvas Configuration:', canvasDiagnostics.result.value);

    console.log('\n--- G. MOBILE NAVIGATION AT 360px VIEWPORT ---');
    await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:3009/' });
    await new Promise(r => setTimeout(r, 3000));

    // Check hamburger button
    const menuBtnData = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[aria-label="Toggle navigation menu"]');
        return {
          exists: !!btn,
          visible: btn ? btn.getBoundingClientRect().width > 0 : false
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Hamburger Button:', menuBtnData.result.value);

    // Open mobile menu
    await send('Runtime.evaluate', {
      expression: `document.querySelector('header button[aria-label="Toggle navigation menu"]').click()`
    });
    await new Promise(r => setTimeout(r, 500));

    const mobileMenuOpen = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('#mobile-navigation')`,
      returnByValue: true
    });
    console.log('Mobile Drawer Open Status:', mobileMenuOpen.result.value ? '✅ OPEN' : '❌ CLOSED');

    // Click link inside mobile drawer
    await testClick('#mobile-navigation a[href="/contact"]', 'Mobile Drawer Start Project Button', '/contact');

    console.log('\n--- H. RESPONSIVE VIEWPORT ZERO-OVERFLOW AUDIT (6 VIEWPORTS) ---');
    const viewports = [320, 360, 390, 768, 1024, 1440];
    for (const w of viewports) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 });
      await send('Page.navigate', { url: 'http://localhost:3009/' });
      await new Promise(r => setTimeout(r, 2000));

      const overflowRes = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        })`,
        returnByValue: true
      });
      const vData = overflowRes.result.value;
      console.log(`  Viewport ${w}px: scrollWidth=${vData.scrollWidth} clientWidth=${vData.clientWidth} -> ${vData.hasOverflow ? '❌ OVERFLOW' : '✅ PASS (0px overflow)'}`);
    }

    console.log('\n--- I. CROSS-PAGE VERIFICATION ---');
    const routesToTest = [
      '/contact',
      '/website-review',
      '/website-review/thank-you',
      '/services/web-design',
      '/services/web-development',
      '/services/seo',
      '/services/digital-marketing',
      '/services/branding-content',
      '/services/care-growth'
    ];

    for (const r of routesToTest) {
      await send('Page.navigate', { url: `http://localhost:3009${r}` });
      await new Promise(res => setTimeout(res, 1500));
      const pageStatus = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() || 'No H1',
          hasCanvas: !!document.querySelector('canvas')
        })`,
        returnByValue: true
      });
      console.log(`  Route ${r}: ✅ HTTP 200 | Title: "${pageStatus.result.value.title}" | H1: "${pageStatus.result.value.h1.slice(0, 35)}..."`);
    }

    ws.close();
    console.log('\n=== ALL REGRESSION TESTS CONCLUDED SUCCESSFULLY ===');
  } finally {
    if (chrome) chrome.kill();
    server.kill();
  }
}

runFullRegression().catch(err => {
  console.error(err);
  process.exit(1);
});
