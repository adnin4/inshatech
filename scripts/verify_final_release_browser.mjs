import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EVIDENCE_DIR = path.resolve(process.cwd(), 'docs/evidence/browser');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runBrowserAudit(targetUrl, viewport, screenshotName = null, runInteractiveSearchAndTabs = false) {
  const port = 9450 + Math.floor(Math.random() * 50);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--allow-file-access-from-files',
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
    await new Promise(r => setTimeout(r, 2500));

    // Initial evaluation
    const initialEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const c = document.getElementById('iinsha-diagram-scene') || document.getElementById('iinsha-hero-canvas');
        const gl = c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
          ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || null,
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

    await new Promise(r => setTimeout(r, 1500));

    const finalEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const panels = Array.from(document.querySelectorAll('.service-panel'));
        const cards = Array.from(document.querySelectorAll('.service-item-card'));
        const bentoCards = Array.from(document.querySelectorAll('.diagram-bento-card, .idg-bento-card'));
        const bentoVisibleCount = bentoCards.filter(el => {
          const st = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return parseFloat(st.opacity) > 0 && st.display !== 'none' && rect.width > 0 && rect.height > 0;
        }).length;
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

        const allElements = Array.from(document.querySelectorAll('[id]'));
        const idMap = {};
        const duplicateIds = [];
        allElements.forEach(el => {
          if (idMap[el.id]) duplicateIds.push(el.id);
          else idMap[el.id] = true;
        });

        const tabButtons = Array.from(document.querySelectorAll('.service-tab-btn, [role="tab"]'));
        const uniqueServiceIds = new Set(cards.map(c => c.getAttribute('data-service-id')).filter(Boolean)).size;

        return {
          vTime2: v ? v.currentTime : null,
          vProgressed: v ? (v.currentTime > 0) : null,
          panelsCount: panels.length,
          cardsCount: cards.length,
          uniqueServiceIds: uniqueServiceIds,
          bentoCount: bentoCards.length,
          bentoVisibleCount: bentoVisibleCount,
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

    // Optional interactive tab & search verification
    let interactiveAudit = null;
    if (runInteractiveSearchAndTabs) {
      const tabEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const tabs = Array.from(document.querySelectorAll('.service-tab-btn'));
          const searchInput = document.getElementById('service-live-search');
          const counter = document.getElementById('service-active-counter');
          const emptyEl = document.getElementById('service-search-empty');
          const cards = Array.from(document.querySelectorAll('.service-item-card'));

          const countVisible = () => cards.filter(c => c.style.display !== 'none' && c.closest('.service-panel')?.style.display !== 'none').length;

          // 1. Click each tab and record visible cards
          const tabCounts = {};
          tabs.forEach(t => {
            t.click();
            const target = t.getAttribute('data-target');
            tabCounts[target] = countVisible();
          });

          // Restore 'all' tab
          const allTab = tabs.find(t => t.getAttribute('data-target') === 'all') || tabs[0];
          if (allTab) allTab.click();
          const allVisible = countVisible();

          // 2. Search for "Playwright"
          let searchMatchCount = null;
          let searchZeroCount = null;
          let searchZeroEmptyVisible = false;
          let searchRestoredCount = null;
          if (searchInput) {
            searchInput.value = 'Playwright';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchMatchCount = countVisible();

            searchInput.value = 'zzzz_nonexistent_service_999';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchZeroCount = countVisible();
            searchZeroEmptyVisible = Boolean(emptyEl && emptyEl.style.display !== 'none');

            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchRestoredCount = countVisible();
          }

          return {
            tabCounts,
            allVisible,
            searchMatchCount,
            searchZeroCount,
            searchZeroEmptyVisible,
            searchRestoredCount,
            counterText: counter ? counter.textContent : null
          };
        })()`,
        returnByValue: true
      });
      interactiveAudit = tabEval.result.value;
    }

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
      interactive: interactiveAudit,
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
  console.log('IINSHA AI-BOS — CDP REAL BROWSER RUNTIME VERIFICATION (6 VIEWPORTS)');
  console.log('================================================================================');

  const localIndexUrl = pathToFileURL(path.resolve(process.cwd(), 'index.html')).href;
  const liveStagingUrl = 'https://inshatech-b6b.pages.dev/';

  const viewports = [
    { width: 1440, height: 900, isMobile: false, shot: null, interactive: true },
    { width: 1280, height: 900, isMobile: false, shot: 'desktop_1280x900.png', interactive: false },
    { width: 1024, height: 768, isMobile: false, shot: null, interactive: false },
    { width: 768, height: 1024, isMobile: true, shot: null, interactive: false },
    { width: 390, height: 844, isMobile: true, shot: 'mobile_390x844.png', interactive: false },
    { width: 360, height: 800, isMobile: true, shot: null, interactive: false }
  ];

  console.log(`\n--- PHASE A: Auditing Local Candidate (${localIndexUrl}) across 6 viewports ---`);
  const localResults = [];
  for (const vp of viewports) {
    console.log(`Auditing local viewport: ${vp.width}x${vp.height} (${vp.isMobile ? 'Mobile' : 'Desktop'})...`);
    const r = await runBrowserAudit(localIndexUrl, vp, vp.shot, vp.interactive);
    localResults.push(r);
    console.log(`  -> H1 Count: ${r.initial.h1Count} | Canonical: ${r.initial.canonical} | og:url: ${r.initial.ogUrl}`);
    console.log(`  -> Panels: ${r.final.panelsCount} | Cards: ${r.final.cardsCount} (Unique IDs: ${r.final.uniqueServiceIds}) | Bento: ${r.final.bentoCount} (Visible: ${r.final.bentoVisibleCount})`);
    console.log(`  -> Overflow: ${r.final.zeroOverflow ? '0px (PASS)' : 'OVERFLOW FAIL'} | Duplicate IDs: ${r.final.duplicateIdCount}`);
    console.log(`  -> Canvas: ${r.initial.canvasId} (${r.initial.glType})`);
    if (r.interactive) {
      console.log(`  -> Interactive Tabs: all=${r.interactive.allVisible}, agents=${r.interactive.tabCounts['cat-agents']}, workflow=${r.interactive.tabCounts['cat-workflow']}`);
      console.log(`  -> Interactive Search: match("Playwright")=${r.interactive.searchMatchCount}, zero=${r.interactive.searchZeroCount} (emptyMsg=${r.interactive.searchZeroEmptyVisible}), restored=${r.interactive.searchRestoredCount}`);
    }
    if (r.screenshot) console.log(`  -> Screenshot saved: docs/evidence/browser/${r.screenshot}`);
  }

  console.log(`\n--- PHASE B: Auditing Live Staging Host (${liveStagingUrl}) at 1440x900 ---`);
  const liveResult = await runBrowserAudit(liveStagingUrl, { width: 1440, height: 900, isMobile: false }, null, false);
  console.log(`  -> Live H1 Count: ${liveResult.initial.h1Count} | Live Cards: ${liveResult.final.cardsCount} | Live Bento: ${liveResult.final.bentoCount} | Video Progressed: ${liveResult.final.vProgressed}`);

  const reportPath = path.join(EVIDENCE_DIR, 'cdp_browser_audit.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    localCandidateUrl: localIndexUrl,
    liveStagingUrl: liveStagingUrl,
    totalViewportsTested: localResults.length,
    localViewports: localResults,
    liveStagingBaseline: liveResult
  }, null, 2), 'utf8');

  console.log(`\n[PASS] Complete 6-viewport CDP telemetry JSON saved to: docs/evidence/browser/cdp_browser_audit.json`);
}

main().catch(err => {
  console.error('Fatal CDP audit error:', err);
  process.exit(1);
});
