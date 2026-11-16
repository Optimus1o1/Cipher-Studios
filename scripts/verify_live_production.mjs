import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyLiveProduction() {
  console.log('=== VERIFYING LIVE PRODUCTION DOM VIA CDP ===\n');

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9240',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9240/json/new', { method: 'PUT' })).json();
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

    console.log('1. Loading https://moonsanctumlabs.design/website-review ...');
    await send('Page.navigate', { url: 'https://moonsanctumlabs.design/website-review' });
    await new Promise(r => setTimeout(r, 4000));

    const diagnostics = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.querySelector('main > div');
        const header = document.querySelector('header');
        const backBtn = document.querySelector('header a[href="/"]');
        const form = document.querySelector('form');
        const nameInput = document.querySelector('input[name="name"]');
        return {
          title: document.title,
          rootPointerEvents: root ? window.getComputedStyle(root).pointerEvents : null,
          headerPosition: header ? window.getComputedStyle(header).position : null,
          backBtnVisible: !!backBtn,
          backBtnClickable: backBtn ? window.getComputedStyle(backBtn).pointerEvents : null,
          formPointerEvents: form ? window.getComputedStyle(form).pointerEvents : null,
          nameInputDisabled: nameInput ? nameInput.disabled : true
        };
      })()`,
      returnByValue: true
    });

    console.log('Live Production DOM Diagnostics:', diagnostics.result.value);

    console.log('\n2. Testing Live Responsive Viewports (Zero Overflow Check)...');
    const viewports = [320, 360, 390, 768, 1440];
    for (const width of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 800,
        deviceScaleFactor: 1,
        mobile: width < 768
      });
      await new Promise(r => setTimeout(r, 300));
      const overflowRes = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        })`,
        returnByValue: true
      });
      console.log(`  Viewport ${width}px: scrollWidth=${overflowRes.result.value.scrollWidth} clientWidth=${overflowRes.result.value.clientWidth} overflow=${overflowRes.result.value.hasOverflow ? 'FAIL' : 'PASS (0px)'}`);
    }

    console.log('\n3. Testing "Back to home" navigation on Live site...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('header a[href="/"]').click()`
    });
    await new Promise(r => setTimeout(r, 3000));

    const homeRes = await send('Runtime.evaluate', {
      expression: `({
        url: window.location.href,
        hasCanvas: !!document.querySelector('canvas')
      })`,
      returnByValue: true
    });
    console.log('Home Navigation Verification:', homeRes.result.value);

    ws.close();
    console.log('\n=== LIVE VERIFICATION COMPLETED SUCCESSFULLY ===');
  } finally {
    if (chrome) chrome.kill();
  }
}

verifyLiveProduction().catch(err => {
  console.error(err);
  process.exit(1);
});
