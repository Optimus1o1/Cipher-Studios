import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function diagnoseHomepage() {
  console.log('=== HOMEPAGE INTERACTION ROOT-CAUSE INVESTIGATION ===\n');

  let chrome;
  try {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9245',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const target = await (await fetch('http://localhost:9245/json/new', { method: 'PUT' })).json();
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
    // Wait for initial load and 3D scene initialization
    await new Promise(r => setTimeout(r, 5000));

    const report = await send('Runtime.evaluate', {
      expression: `(() => {
        const results = {};

        // Helper to inspect element
        function inspectElement(selector, name) {
          const el = document.querySelector(selector);
          if (!el) return { name, exists: false };
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const topEl = document.elementFromPoint(cx, cy);

          // Find ancestors with pointer-events
          let curr = el;
          const chain = [];
          while (curr && curr !== document.documentElement) {
            const cs = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName.toLowerCase(),
              id: curr.id || undefined,
              className: curr.className.toString().slice(0, 40) || undefined,
              pointerEvents: cs.pointerEvents,
              zIndex: cs.zIndex,
              position: cs.position
            });
            curr = curr.parentElement;
          }

          return {
            name,
            exists: true,
            tagName: el.tagName.toLowerCase(),
            href: el.getAttribute('href') || undefined,
            rect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
            computedPointerEvents: computed.pointerEvents,
            centerPoint: { x: Math.round(cx), y: Math.round(cy) },
            elementFromPoint: topEl ? {
              tag: topEl.tagName.toLowerCase(),
              id: topEl.id || undefined,
              className: topEl.className.toString().slice(0, 40) || undefined,
              isSame: topEl === el || el.contains(topEl)
            } : null,
            ancestorChain: chain
          };
        }

        // Global Layout
        const main = document.querySelector('main');
        const mainCS = main ? window.getComputedStyle(main) : null;
        results.layout = {
          mainExists: !!main,
          mainPointerEvents: mainCS?.pointerEvents,
          mainZIndex: mainCS?.zIndex,
          bodyPointerEvents: window.getComputedStyle(document.body).pointerEvents
        };

        // Header Elements
        results.header = {
          logo: inspectElement('header a[href="/"]', 'Header Logo'),
          navServices: inspectElement('header a[href="/services"]', 'Header Services Link'),
          navProcess: inspectElement('header a[href="/#process"]', 'Header Process Link'),
          navPrinciples: inspectElement('header a[href="/#principles"]', 'Header Principles Link'),
          navStartProject: inspectElement('header a[href="/contact"]', 'Header Start Project Button'),
          navReview: inspectElement('header a[href^="/website-review"]', 'Header Free Review Button')
        };

        // Hero Section Elements
        results.hero = {
          badge: inspectElement('[class*="LunarTelemetryBadge"], a[href="/services"]', 'Lunar Telemetry Badge'),
          startProjectCTA: inspectElement('section a[href="/contact"]', 'Hero Start Project CTA'),
          freeReviewCTA: inspectElement('section a[href^="/website-review"]', 'Hero Free Review CTA')
        };

        // Canvas & 3D Layer
        const canvas = document.querySelector('canvas');
        const canvasContainer = canvas ? canvas.parentElement : null;
        results.canvas = {
          canvasExists: !!canvas,
          canvasPointerEvents: canvas ? window.getComputedStyle(canvas).pointerEvents : null,
          containerPointerEvents: canvasContainer ? window.getComputedStyle(canvasContainer).pointerEvents : null,
          containerZIndex: canvasContainer ? window.getComputedStyle(canvasContainer).zIndex : null
        };

        // Service List (Services Band)
        const serviceLinks = Array.from(document.querySelectorAll('#services a[href^="/services/"]'));
        results.servicesBand = {
          count: serviceLinks.length,
          firstService: inspectElement('#services a[href^="/services/"]', 'First Service Link')
        };

        // CTA Band at Bottom
        results.ctaBand = {
          sendDetails: inspectElement('#contact-banner a[href="/contact"]', 'CTA Band Send Details'),
          browseServices: inspectElement('#contact-banner a[href="/services"]', 'CTA Band Browse Services')
        };

        // Footer Elements
        results.footer = {
          footerExists: !!document.querySelector('footer'),
          footerInquiryLink: inspectElement('footer a[href="/contact"]', 'Footer Contact Inquiry Link'),
          footerServiceLinksCount: document.querySelectorAll('footer a[href^="/services/"]').length
        };

        return results;
      })()`,
      returnByValue: true
    });

    console.log('DIAGNOSTIC REPORT SUMMARY:');
    console.log(JSON.stringify(report.result.value, null, 2));

    ws.close();
  } finally {
    if (chrome) chrome.kill();
  }
}

diagnoseHomepage().catch(err => {
  console.error(err);
  process.exit(1);
});
