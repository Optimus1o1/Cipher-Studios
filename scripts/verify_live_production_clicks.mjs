import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LIVE_BASE = 'https://moonsanctumlabs.design';

async function verifyLiveProduction() {
  console.log(`=== RUNNING PRODUCTION VERIFICATION AGAINST ${LIVE_BASE} ===\n`);

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9265',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9265/json/new', { method: 'PUT' })).json();
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

    console.log(`1. Navigating to ${LIVE_BASE} ...`);
    await send('Page.navigate', { url: LIVE_BASE });
    await new Promise(r => setTimeout(r, 5000));

    async function testClick(selector, name, expectedUrlPart) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (el) el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        })()`
      });
      await new Promise(r => setTimeout(r, 300));

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

      // Dispatch real mouse events
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });

      await new Promise(r => setTimeout(r, 1400));
      const urlAfter = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });

      const pass = urlAfter.result.value.includes(expectedUrlPart);
      console.log(`  ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} (${Math.round(width)}x${Math.round(height)}px) -> Navigated to: ${urlAfter.result.value}`);

      if (urlAfter.result.value !== urlBefore.result.value) {
        await send('Page.navigate', { url: LIVE_BASE });
        await new Promise(r => setTimeout(r, 3000));
      }

      return pass;
    }

    console.log('\n--- A. HEADER NAVIGATION TESTS (LIVE) ---');
    await testClick('header a[href="/services"]', 'Header Services Link', '/services');
    await testClick('header a[href="/contact"]', 'Header Start Project Button', '/contact');
    await testClick('header a[href^="/website-review"]', 'Header Free Review Button', '/website-review');

    console.log('\n--- B. HERO SECTION CTA TESTS (LIVE) ---');
    await testClick('section a[href="/contact"]', 'Hero Start Project CTA', '/contact');
    await testClick('section a[href^="/website-review"]', 'Hero Free Review CTA', '/website-review');

    console.log('\n--- C. SERVICES BAND (ALL 6 SERVICE ROWS LIVE) ---');
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

    console.log('\n--- D. CTA BAND (CONTACT BANNER LIVE) ---');
    await testClick('#contact-banner a[href="/contact"]', 'Contact Banner Send Details Button', '/contact');
    await testClick('#contact-banner a[href="/services"]', 'Contact Banner Browse Services Button', '/services');

    console.log('\n--- E. FOOTER LINKS (LIVE) ---');
    await testClick('footer a[href="/contact"]', 'Footer Contact Inquiry Link', '/contact');
    for (const s of services) {
      await testClick(`footer a[href="/services/${s.slug}"]`, `Footer Link: ${s.name}`, `/services/${s.slug}`);
    }

    console.log('\n--- F. 3D MOON CANVAS & SATELLITE RAYCASTING CONFIG (LIVE) ---');
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
    console.log('Live 3D Canvas Diagnostics:', canvasDiagnostics.result.value);

    console.log('\n--- G. MOBILE NAVIGATION AT 360px VIEWPORT (LIVE) ---');
    await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: LIVE_BASE });
    await new Promise(r => setTimeout(r, 3500));

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

    await send('Runtime.evaluate', {
      expression: `document.querySelector('header button[aria-label="Toggle navigation menu"]').click()`
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileMenuOpen = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('#mobile-navigation')`,
      returnByValue: true
    });
    console.log('Mobile Drawer Open Status:', mobileMenuOpen.result.value ? '✅ OPEN' : '❌ CLOSED');

    await testClick('#mobile-navigation a[href="/contact"]', 'Mobile Drawer Start Project Button', '/contact');

    console.log('\n--- H. RESPONSIVE VIEWPORT ZERO-OVERFLOW AUDIT (6 VIEWPORTS LIVE) ---');
    const viewports = [320, 360, 390, 768, 1024, 1440];
    for (const w of viewports) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 });
      await send('Page.navigate', { url: LIVE_BASE });
      await new Promise(r => setTimeout(r, 2500));

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

    ws.close();
    console.log('\n=== LIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY ===');
  } finally {
    if (chrome) chrome.kill();
  }
}

verifyLiveProduction().catch(err => {
  console.error(err);
  process.exit(1);
});
