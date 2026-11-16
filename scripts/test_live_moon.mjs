import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.env.LIVE_URL || 'https://moonsanctumlabs.design/';

async function checkLiveMoon() {
  console.log('Testing live staging Moon Sanctum Labs at:', URL);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const target = await (await fetch('http://localhost:9229/json/new', { method: 'PUT' })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

    const exceptions = [];
    const consoleLogs = [];
    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push(msg.params.args.map(a => a.value || a.description || '').join(' '));
      }
    };

    ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: URL } }));
    await new Promise(r => setTimeout(r, 5000));

    let evalResolve;
    const p = new Promise(r => evalResolve = r);
    const originalOnMessage = ws.onmessage;
    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === 4) {
        evalResolve(msg.result);
      } else {
        originalOnMessage(e);
      }
    };

    ws.send(JSON.stringify({
      id: 4,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          try {
            const c = document.querySelector('canvas');
            const hasCanvas = Boolean(c);
            let webgl = 'none';
            if (c) {
              const gl = c.getContext('webgl2') || c.getContext('webgl');
              if (gl) {
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                webgl = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'active';
              }
            }
            return JSON.stringify({
              title: document.title,
              h1: document.querySelector('h1')?.innerText || '',
              canvas: hasCanvas,
              canvasWidth: c?.width || 0,
              canvasHeight: c?.height || 0,
              webglRenderer: webgl,
              satellites: Array.from(document.querySelectorAll('a[href^="/services/"]')).map(a => a.innerText.trim()).filter(Boolean),
              bodyTextSnippet: document.body.innerText.slice(0, 200)
            });
          } catch (e) {
            return JSON.stringify({ error: e.message, stack: e.stack });
          }
        })()`,
        returnByValue: true
      }
    }));

    const evalRes = await p;
    console.log('Live DOM Evaluation:', evalRes?.result?.value);
    console.log('Exceptions caught:', exceptions);
    console.log('Console logs count:', consoleLogs.length);

    // Capture screenshot
    let screenshotResolve;
    const pScreen = new Promise(r => screenshotResolve = r);
    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === 5) screenshotResolve(msg.result);
    };
    ws.send(JSON.stringify({ id: 5, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    const screenData = await pScreen;
    if (screenData?.data) {
      const shotPath = 'C:\\Users\\ANIKET\\.gemini\\antigravity\\brain\\c8f152b4-79db-4ad2-a54a-496972e7f1ae\\screenshots\\live_staging_moon_verified.png';
      fs.writeFileSync(shotPath, Buffer.from(screenData.data, 'base64'));
      console.log('Captured Live Staging 3D Moon Canvas screenshot at:', shotPath);
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    chrome.kill();
    throw err;
  }
}

checkLiveMoon().catch(console.error);
