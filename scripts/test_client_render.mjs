import { spawn } from 'node:child_process';

async function test() {
  const server = spawn('npm.cmd', ['run', 'start', '--', '-p', '3001'], { stdio: 'pipe', shell: true });
  await new Promise(r => setTimeout(r, 3000));

  try {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      '--remote-debugging-port=9226',
      '--disable-gpu',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9226/json/new', { method: 'PUT' })).json();
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

    ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:3001/' } }));
    await new Promise(r => setTimeout(r, 4000));

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
        expression: `JSON.stringify({
          h1: document.querySelector('h1')?.innerText,
          title: document.title,
          canvas: Boolean(document.querySelector('canvas')),
          canvasWidth: document.querySelector('canvas')?.width,
          canvasHeight: document.querySelector('canvas')?.height,
          webglRenderer: (() => {
            const c = document.querySelector('canvas');
            if (!c) return 'no_canvas';
            const gl = c.getContext('webgl2') || c.getContext('webgl');
            if (!gl) return 'no_webgl';
            const dbg = gl.getExtension('WEBGL_debug_renderer_info');
            return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'webgl_active';
          })(),
          serviceLinks: Array.from(document.querySelectorAll('a[href^="/services/"]')).map(a => a.innerText.trim()).filter(Boolean),
          navLinks: Array.from(document.querySelectorAll('nav a')).map(a => a.innerText.trim()).filter(Boolean)
        })`,
        returnByValue: true
      }
    }));

    const evalRes = await p;
    console.log('DOM Evaluation Result:', evalRes?.result?.value);
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
      const fs = await import('fs');
      const shotPath = 'C:\\Users\\ANIKET\\.gemini\\antigravity\\brain\\c8f152b4-79db-4ad2-a54a-496972e7f1ae\\screenshots\\3d_moon_canvas_verified.png';
      fs.writeFileSync(shotPath, Buffer.from(screenData.data, 'base64'));
      console.log('Captured 3D Moon Canvas screenshot at:', shotPath);
    }

    ws.close();
    chrome.kill();
  } finally {
    server.kill();
  }
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
