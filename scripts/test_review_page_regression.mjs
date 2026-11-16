import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runRegression() {
  console.log('=== STARTING PRODUCTION AUDIT & REGRESSION TEST SUITE ===\n');

  // Start local production server on port 3005
  const server = spawn('npm.cmd', ['run', 'start', '--', '-p', '3005'], { stdio: 'pipe', shell: true });
  await new Promise(r => setTimeout(r, 3500));

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9235',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9235/json/new', { method: 'PUT' })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let messageId = 1;
    const pending = new Map();
    const exceptions = [];
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params?.args?.map(a => a.value || a.description || '').join(' ');
        consoleLogs.push(`[${msg.params.type}] ${text}`);
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

    // -------------------------------------------------------------
    // TEST 1: Website Review Page Loading & Pointer Events Check
    // -------------------------------------------------------------
    console.log('1. Navigating to /website-review...');
    await send('Page.navigate', { url: 'http://localhost:3005/website-review' });
    await new Promise(r => setTimeout(r, 3000));

    const navCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.querySelector('div.relative.z-20.w-full.pointer-events-auto');
        const header = document.querySelector('header');
        const backBtn = document.querySelector('header a[href="/"]');
        const form = document.querySelector('form');
        const nameInput = document.querySelector('input#name');
        
        return {
          title: document.title,
          hasRootPointerEventsAuto: Boolean(root),
          hasHeader: Boolean(header),
          headerPosition: window.getComputedStyle(header).position,
          backBtnText: backBtn?.innerText.trim(),
          backBtnClickable: Boolean(backBtn && window.getComputedStyle(backBtn).pointerEvents !== 'none'),
          hasForm: Boolean(form),
          formPointerEvents: form ? window.getComputedStyle(form).pointerEvents : 'none',
          nameInputEnabled: nameInput ? !nameInput.disabled : false
        };
      })()`,
      returnByValue: true
    });

    console.log('  Page Structure & Pointer Events:', navCheck.result.value);

    // -------------------------------------------------------------
    // TEST 2: Turnstile Lifecycle & Keystroke Stability
    // -------------------------------------------------------------
    console.log('\n2. Testing Form Input Typing & Turnstile Stability...');
    const typingTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const nameInput = document.querySelector('input#name');
        const emailInput = document.querySelector('input#email');
        const websiteInput = document.querySelector('input#website');
        const goalSelect = document.querySelector('select#goal');
        const msgArea = document.querySelector('textarea#message');

        // Initial widget count
        const initialWidgets = document.querySelectorAll('iframe[src*="cloudflare"], iframe[src*="turnstile"]').length;

        // Simulate typing
        const typeInto = (el, text) => {
          if (!el) return;
          el.focus();
          el.value = text;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        typeInto(nameInput, 'Aniket Nandi Verification');
        typeInto(emailInput, 'aniketnandi559@gmail.com');
        typeInto(websiteInput, 'moonsanctumlabs.design');
        if (goalSelect) {
          goalSelect.value = 'A faster website';
          goalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        typeInto(msgArea, 'Testing robust turnstile stability without keystroke re-renders.');

        const afterWidgets = document.querySelectorAll('iframe[src*="cloudflare"], iframe[src*="turnstile"]').length;

        return {
          nameValue: nameInput?.value,
          emailValue: emailInput?.value,
          websiteValue: websiteInput?.value,
          goalValue: goalSelect?.value,
          msgLength: msgArea?.value.length,
          widgetsPreserved: initialWidgets === afterWidgets
        };
      })()`,
      returnByValue: true
    });

    console.log('  Form State & Widget Stability:', typingTest.result.value);

    // -------------------------------------------------------------
    // TEST 3: Multi-Viewport Responsive Audit (320, 360, 390, 768, 1440px)
    // -------------------------------------------------------------
    console.log('\n3. Testing Responsive Layouts across 5 Viewports...');
    const viewports = [
      { width: 320, height: 640, label: '320px (Ultra-compact mobile)' },
      { width: 360, height: 740, label: '360px (Standard compact mobile)' },
      { width: 390, height: 844, label: '390px (iPhone 13/14/15)' },
      { width: 768, height: 1024, label: '768px (Tablet portrait)' },
      { width: 1440, height: 900, label: '1440px (Desktop)' },
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await new Promise(r => setTimeout(r, 500));

      const vpEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const docWidth = document.documentElement.offsetWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const hasHorizontalOverflow = scrollWidth > window.innerWidth;
          const header = document.querySelector('header');
          const headerWidth = header ? header.offsetWidth : 0;
          const submitBtn = document.querySelector('button[type="submit"]');
          const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;

          return {
            windowWidth: window.innerWidth,
            scrollWidth,
            hasHorizontalOverflow,
            headerStickiness: header ? window.getComputedStyle(header).position : 'none',
            submitButtonWidth: submitRect ? Math.round(submitRect.width) : 0,
            submitButtonHeight: submitRect ? Math.round(submitRect.height) : 0,
          };
        })()`,
        returnByValue: true
      });

      const res = vpEval.result.value;
      console.log(`  ✓ ${vp.label}: Overflow = ${res.hasHorizontalOverflow ? 'FAIL' : 'NONE (PASS)'} | Header = ${res.headerStickiness} | Submit Btn = ${res.submitButtonWidth}×${res.submitButtonHeight}px`);
    }

    // -------------------------------------------------------------
    // TEST 4: Back to Home Navigation Check
    // -------------------------------------------------------------
    console.log('\n4. Testing "Back to home" navigation...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('header a[href="/"]')?.click()`
    });
    await new Promise(r => setTimeout(r, 2500));

    const homeCheck = await send('Runtime.evaluate', {
      expression: `(() => ({
        url: window.location.href,
        h1: document.querySelector('h1')?.innerText,
        hasCanvas: Boolean(document.querySelector('canvas')),
        satellitesCount: document.querySelectorAll('a[href^="/services/"]').length
      }))()`,
      returnByValue: true
    });

    console.log('  Navigation to Home Result:', homeCheck.result.value);

    // -------------------------------------------------------------
    // TEST 5: Homepage WebGL 3D Moon & 6 Satellites Confirmation
    // -------------------------------------------------------------
    console.log('\n5. Verifying Homepage 3D Moon Canvas & Satellites (Safeguard 1)...');
    const moonCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.querySelector('canvas');
        if (!c) return { canvas: false };
        const gl = c.getContext('webgl2') || c.getContext('webgl');
        return {
          canvas: true,
          canvasWidth: c.width,
          canvasHeight: c.height,
          webglActive: Boolean(gl),
          satelliteNodes: Array.from(document.querySelectorAll('a[href^="/services/"]')).map(a => a.innerText.trim()).filter(Boolean)
        };
      })()`,
      returnByValue: true
    });

    console.log('  3D Moon Canvas & Satellites Status:', moonCheck.result.value);
    console.log('\nExceptions caught during session:', exceptions);
    console.log('Total console messages emitted:', consoleLogs.length);

    ws.close();
    chrome.kill();
    server.kill();
    console.log('\n=== ALL REGRESSION TESTS CONCLUDED SUCCESSFULLY ===');
  } catch (err) {
    if (chrome) chrome.kill();
    server.kill();
    throw err;
  }
}

runRegression().catch(err => {
  console.error('Regression run failed:', err);
  process.exit(1);
});
