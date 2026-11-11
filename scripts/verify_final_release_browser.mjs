import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EVIDENCE_DIR = path.resolve(process.cwd(), 'docs/evidence/browser');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runBrowserAudit(targetUrl, viewport, screenshotName = null) {
  const port = 9450 + Math.floor(Math.random() * 50);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    'about:blank'
  ]);

  const consoleLogs = [];
  const networkFailures = [];

  try {
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const curId = id++;
      const onMsg = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === curId) {
          ws.removeEventListener('message', onMsg);
          if (d.error) reject(d.error);
          else resolve(d.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    // Listen to Console and Network events
    ws.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.method === 'Console.messageAdded') {
          consoleLogs.push(msg.params.message);
        }
        if (msg.method === 'Network.loadingFailed') {
          networkFailures.push(msg.params);
        }
      } catch (_) {}
    });

    await send('Page.enable');
    await send('Console.enable');
    await send('Network.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 2,
      mobile: viewport.isMobile
    });

    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 3500));

    // Capture initial evaluation
    const initialEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const c = document.getElementById('iinsha-diagram-scene') || document.getElementById('iinsha-hero-canvas');
        const gl = c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
          h1Count: document.querySelectorAll('h1').length,
          h1Text: document.querySelector('h1')?.textContent?.trim() || null,
          vPaused: v ? v.paused : null,
          vTime1: v ? v.currentTime : null,
          vReadyState: v ? v.readyState : null,
          canvasFound: Boolean(c),
          canvasId: c ? c.id : null,
          glType: gl ? gl.constructor.name : null,
          glDrawingBufferWidth: gl ? gl.drawingBufferWidth : null,
          glDrawingBufferHeight: gl ? gl.drawingBufferHeight : null
        };
      })()`,
      returnByValue: true
    });

    // Wait 2 seconds to check video progression and interaction
    await new Promise(r => setTimeout(r, 2000));

    const finalEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const panels = Array.from(document.querySelectorAll('.service-panel'));
        const cards = Array.from(document.querySelectorAll('.service-item-card'));
        const bentoCards = Array.from(document.querySelectorAll('.diagram-bento-card, .idg-bento-card'));
        const docScrollWidth = document.documentElement.scrollWidth;
        const winInnerWidth = window.innerWidth;
        const stickyCta = document.getElementById('sticky-mobile-cta');
        const copilot = document.getElementById('iinsha-copilot-trigger');
        const ctaRect = stickyCta ? stickyCta.getBoundingClientRect() : null;
        const copilotRect = copilot ? copilot.getBoundingClientRect() : null;
        const hasCollision = Boolean(ctaRect && copilotRect &&
          !(ctaRect.right < copilotRect.left ||
            ctaRect.left > copilotRect.right ||
            ctaRect.bottom < copilotRect.top ||
            ctaRect.top > copilotRect.bottom));

        // Check duplicate IDs across DOM
        const allElements = Array.from(document.querySelectorAll('[id]'));
        const idMap = {};
        const duplicateIds = [];
        allElements.forEach(el => {
          if (idMap[el.id]) duplicateIds.push(el.id);
          else idMap[el.id] = true;
        });

        // Tabs test: check total category buttons
        const tabButtons = Array.from(document.querySelectorAll('.service-tab-btn, [role="tab"]'));

        return {
          vTime2: v ? v.currentTime : null,
          vProgressed: v ? (v.currentTime > 0) : null,
          panelsCount: panels.length,
          cardsCount: cards.length,
          bentoCount: bentoCards.length,
          tabCount: tabButtons.length,
          docScrollWidth: docScrollWidth,
          winInnerWidth: winInnerWidth,
          zeroOverflow: docScrollWidth <= winInnerWidth,
          hasCollision: hasCollision,
          duplicateIdCount: duplicateIds.length,
          duplicateIds: duplicateIds.slice(0, 5)
        };
      })()`,
      returnByValue: true
    });

    // Capture screenshot if requested
    let screenshotPath = null;
    if (screenshotName) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      screenshotPath = path.join(EVIDENCE_DIR, screenshotName);
      fs.writeFileSync(screenshotPath, Buffer.from(shot.data, 'base64'));
    }

    ws.close();

    return {
      viewport: `${viewport.width}x${viewport.height}${viewport.isMobile ? ' (Mobile)' : ' (Desktop)'}`,
      initial: initialEval.result.value,
      final: finalEval.result.value,
      screenshot: screenshotPath ? path.basename(screenshotPath) : null,
      consoleErrors: consoleLogs.filter(l => l.level === 'error'),
      networkFailures: networkFailures
    };
  } finally {
    try { chrome.kill('SIGKILL'); } catch (_) {}
  }
}

async function main() {
  console.log('================================================================================');
  console.log('IINSHA AI-BOS — CDP REAL BROWSER RUNTIME VERIFICATION');
  console.log('================================================================================');

  const TARGET_URL = 'https://inshatech-b6b.pages.dev/';
  console.log(`Target URL: ${TARGET_URL}\n`);

  const viewports = [
    { width: 1440, height: 900, isMobile: false, shot: null },
    { width: 1280, height: 900, isMobile: false, shot: 'desktop_1280x900.png' },
    { width: 1024, height: 768, isMobile: false, shot: null },
    { width: 390, height: 844, isMobile: true, shot: 'mobile_390x844.png' },
    { width: 360, height: 800, isMobile: true, shot: null }
  ];

  const results = [];
  for (const vp of viewports) {
    console.log(`Auditing viewport: ${vp.width}x${vp.height} (${vp.isMobile ? 'Mobile' : 'Desktop'})...`);
    const r = await runBrowserAudit(TARGET_URL, vp, vp.shot);
    results.push(r);
    console.log(`  -> Title: "${r.initial.title}"`);
    console.log(`  -> H1 Count: ${r.initial.h1Count}, Canonical: ${r.initial.canonical ? 'YES' : 'NO'}`);
    console.log(`  -> Panels: ${r.final.panelsCount}, Cards: ${r.final.cardsCount}, Bento: ${r.final.bentoCount}`);
    console.log(`  -> Overflow: ${r.final.zeroOverflow ? '0px (PASS)' : 'OVERFLOW FAIL'}`);
    console.log(`  -> Canvas: ${r.initial.canvasId} (${r.initial.glType})`);
    console.log(`  -> Video Progressed: ${r.final.vProgressed ? 'YES' : 'NO'} (${r.initial.vTime1}s -> ${r.final.vTime2}s)`);
    if (r.screenshot) console.log(`  -> Screenshot saved: docs/evidence/browser/${r.screenshot}`);
    console.log('');
  }

  const reportPath = path.join(EVIDENCE_DIR, 'cdp_browser_audit.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    url: TARGET_URL,
    totalViewportsTested: results.length,
    viewports: results
  }, null, 2), 'utf8');

  console.log(`[PASS] Complete CDP telemetry JSON saved to: docs/evidence/browser/cdp_browser_audit.json`);
}

main().catch(err => {
  console.error('Fatal CDP audit error:', err);
  process.exit(1);
});
