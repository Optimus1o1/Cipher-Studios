import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testClicks() {
  console.log('=== TESTING REAL BROWSER CLICKS ON LIVE SITE ===\n');

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9250',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9250/json/new', { method: 'PUT' })).json();
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

    console.log('1. Loading https://moonsanctumlabs.design/ ...');
    await send('Page.navigate', { url: 'https://moonsanctumlabs.design/' });
    await new Promise(r => setTimeout(r, 4000));

    async function testClickOnElement(selector, name) {
      const pos = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2, href: el.getAttribute('href') };
        })()`,
        returnByValue: true
      });

      if (!pos.result.value) {
        console.log(`❌ Element not found: ${name} (${selector})`);
        return false;
      }

      const { x, y, href } = pos.result.value;
      console.log(`Testing click on ${name} at (${Math.round(x)}, ${Math.round(y)}) target href: ${href}`);

      // Reset url check
      const urlBefore = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });

      // Dispatch real mouse events
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });

      await new Promise(r => setTimeout(r, 1200));

      const urlAfter = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
      const navigated = urlAfter.result.value !== urlBefore.result.value;
      console.log(`  Result for ${name}: ${navigated ? '✅ NAVIGATED to ' + urlAfter.result.value : '❌ FAILED TO NAVIGATE (Stayed at ' + urlAfter.result.value + ')'}\n`);

      // If navigated, navigate back to home
      if (navigated) {
        await send('Page.navigate', { url: 'https://moonsanctumlabs.design/' });
        await new Promise(r => setTimeout(r, 3000));
      }

      return navigated;
    }

    // Test Hero CTA
    await testClickOnElement('section a[href="/contact"]', 'Hero "Start a project" CTA');
    await testClickOnElement('section a[href^="/website-review"]', 'Hero "Free website review" CTA');

    // Test Header
    await testClickOnElement('header a[href="/services"]', 'Header Services Link');
    await testClickOnElement('header a[href="/contact"]', 'Header "Start a project" Button');

    // Test Services Band
    await testClickOnElement('#services a[href="/services/web-design"]', 'Services Band "Website design" Link');

    // Test Footer
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
    await new Promise(r => setTimeout(r, 1000));
    await testClickOnElement('footer a[href="/contact"]', 'Footer Inquiry Link');

    ws.close();
  } finally {
    if (chrome) chrome.kill();
  }
}

testClicks().catch(console.error);
