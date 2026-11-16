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
          navLinks: Array.from(document.querySelectorAll('nav a')).map(a => a.innerText.trim()).filter(Boolean),
          bodyTextSnippet: document.body.innerText.slice(0, 300)
        })`,
        returnByValue: true
      }
    }));

    const evalRes = await p;
    console.log('DOM Evaluation Result:', evalRes?.result?.value);
    console.log('Exceptions caught:', exceptions);
    console.log('Console logs count:', consoleLogs.length);

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
