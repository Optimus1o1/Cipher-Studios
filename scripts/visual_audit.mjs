import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\ANIKET\\.gemini\\antigravity\\brain\\c8f152b4-79db-4ad2-a54a-496972e7f1ae\\screenshots';
const BASE_URL = 'https://moon-sanctum-labs-slsj.onrender.com';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runAudit() {
  console.log('--- Starting Chrome DevTools Protocol Visual & Live Audit ---');
  
  // 1. Launch Chrome Headless
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  let versionInfo;
  try {
    const res = await fetch('http://localhost:9222/json/version');
    versionInfo = await res.json();
    console.log('Connected to Chrome:', versionInfo.Browser);
  } catch (err) {
    console.error('Failed to connect to Chrome:', err);
    chromeProcess.kill();
    process.exit(1);
  }

  // Create new target
  const newTargetRes = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
  const target = await newTargetRes.json();
  const wsUrl = target.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let messageId = 1;
  const pendingRequests = new Map();
  const consoleMessages = [];
  const networkErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method === 'Console.messageAdded' || msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params?.message?.text || msg.params?.args?.[0]?.value || JSON.stringify(msg.params);
      const type = msg.params?.message?.level || msg.params?.type || 'log';
      consoleMessages.push({ type, text, timestamp: Date.now() });
    } else if (msg.method === 'Network.responseReceived') {
      const status = msg.params?.response?.status;
      const url = msg.params?.response?.url;
      if (status >= 400) {
        networkErrors.push({ status, url });
      }
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Enable domains
  await sendCommand('Page.enable');
  await sendCommand('Network.enable');
  await sendCommand('Runtime.enable');

  const pagesToTest = [
    { path: '/', name: 'homepage_desktop', width: 1440, height: 900 },
    { path: '/', name: 'homepage_mobile', width: 390, height: 844, isMobile: true },
    { path: '/services', name: 'services_overview', width: 1440, height: 900 },
    { path: '/services/web-design', name: 'service_web_design', width: 1440, height: 900 },
    { path: '/services/web-development', name: 'service_web_dev', width: 1440, height: 900 },
    { path: '/services/seo', name: 'service_seo', width: 1440, height: 900 },
    { path: '/services/digital-marketing', name: 'service_digital_marketing', width: 1440, height: 900 },
    { path: '/services/branding-content', name: 'service_branding_content', width: 1440, height: 900 },
    { path: '/services/care-growth', name: 'service_care_growth', width: 1440, height: 900 },
    { path: '/contact', name: 'contact_page', width: 1440, height: 900 },
    { path: '/website-review', name: 'website_review', width: 1440, height: 900 },
    { path: '/website-review/thank-you', name: 'thank_you', width: 1440, height: 900 },
    { path: '/styleguide', name: 'styleguide', width: 1440, height: 900 },
  ];

  const results = [];

  for (const pageItem of pagesToTest) {
    const fullUrl = `${BASE_URL}${pageItem.path}`;
    console.log(`\nNavigating to ${pageItem.name} (${fullUrl})...`);

    // Set viewport
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: pageItem.width,
      height: pageItem.height,
      deviceScaleFactor: pageItem.isMobile ? 2 : 1,
      mobile: Boolean(pageItem.isMobile),
    });

    const pageConsole = [];
    const pageNetworkErrors = [];
    const consoleListener = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params?.args?.map(a => a.value || a.description || '').join(' ');
        pageConsole.push(`[${msg.params.type}] ${text}`);
      }
    };
    ws.addEventListener('message', consoleListener);

    // Navigate
    await sendCommand('Page.navigate', { url: fullUrl });

    // Wait for load and settle (Three.js/Framer motion)
    await new Promise(r => setTimeout(r, 3500));

    // Evaluate DOM
    const evalRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const hasCanvas = Boolean(document.querySelector('canvas'));
        const h1 = document.querySelector('h1')?.innerText || '';
        const title = document.title;
        const linksCount = document.querySelectorAll('a').length;
        const buttonsCount = document.querySelectorAll('button').length;
        const formsCount = document.querySelectorAll('form').length;
        const turnstileWidget = Boolean(document.querySelector('[id*="cf-turnstile"], [id*="turnstile"], [class*="turnstile"]'));
        return {
          title,
          h1,
          hasCanvas,
          linksCount,
          buttonsCount,
          formsCount,
          turnstileWidget
        };
      })()`,
      returnByValue: true
    });

    const domInfo = evalRes.result?.value || {};

    // Screenshot
    const screenshotRes = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = path.join(SCREENSHOT_DIR, `${pageItem.name}.png`);
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotRes.data, 'base64'));

    ws.removeEventListener('message', consoleListener);

    results.push({
      page: pageItem.path,
      name: pageItem.name,
      viewport: `${pageItem.width}x${pageItem.height}`,
      domInfo,
      screenshot: screenshotPath,
      consoleEntries: pageConsole.slice(-5)
    });

    console.log(`✓ ${pageItem.name} rendered: Title: "${domInfo.title}", H1: "${domInfo.h1?.slice(0, 40)}", Canvas: ${domInfo.hasCanvas}, Screenshot saved.`);
  }

  // Cleanup
  ws.close();
  chromeProcess.kill();

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit_summary.json'),
    JSON.stringify({ results, totalPages: results.length, timestamp: new Date().toISOString() }, null, 2)
  );

  console.log('\n=============================================');
  console.log(`All ${results.length} pages audited and captured!`);
  console.log('Screenshots stored at:', SCREENSHOT_DIR);
  console.log('=============================================');
}

runAudit().catch(err => {
  console.error('Audit run failed:', err);
  process.exit(1);
});
