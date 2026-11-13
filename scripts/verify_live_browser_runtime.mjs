import { spawn } from 'child_process';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function verifyUrl(targetUrl, viewport = { width: 1280, height: 900, isMobile: false }) {
  const port = 9446;
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    'about:blank'
  ]);

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

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 2,
      mobile: viewport.isMobile
    });
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 4000));

    // Capture initial metrics
    const eval1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const c = document.getElementById('iinsha-diagram-scene');
        const gl = c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
        return {
          vPaused: v ? v.paused : null,
          vTime1: v ? v.currentTime : null,
          vDuration: v ? v.duration : null,
          vReadyState: v ? v.readyState : null,
          canvasId: c ? c.id : null,
          canvasTagName: c ? c.tagName : null,
          hasGlContext: Boolean(gl),
          glType: gl ? gl.constructor.name : null,
          drawingBufferWidth: gl ? gl.drawingBufferWidth : null,
          drawingBufferHeight: gl ? gl.drawingBufferHeight : null
        };
      })()`,
      returnByValue: true
    });

    // Wait 1.5 seconds to measure progression
    await new Promise(r => setTimeout(r, 1500));

    const eval2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.getElementById('hero-celestial-video');
        const servicesAnchor = document.getElementById('services');
        const s3Section = document.getElementById('s3');
        const panels = Array.from(document.querySelectorAll('.service-panel'));
        const cards = Array.from(document.querySelectorAll('.service-item-card'));
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

        return {
          vPaused: v ? v.paused : null,
          vTime2: v ? v.currentTime : null,
          hasServicesAnchor: Boolean(servicesAnchor),
          s3Role: s3Section ? s3Section.getAttribute('role') : null,
          s3AriaLabel: s3Section ? s3Section.getAttribute('aria-label') : null,
          totalPanels: panels.length,
          totalCards: cards.length,
          visibleCards: cards.filter(c => c.offsetParent !== null).length,
          docScrollWidth: docScrollWidth,
          winInnerWidth: winInnerWidth,
          zeroHorizontalOverflow: docScrollWidth <= winInnerWidth,
          hasWidgetCollision: hasCollision
        };
      })()`,
      returnByValue: true
    });

    ws.close();
    return {
      url: targetUrl,
      viewport: `${viewport.width}x${viewport.height}`,
      initial: eval1.result.value,
      afterWait: eval2.result.value,
      playbackProgressed: eval2.result.value.vTime2 > eval1.result.value.vTime1 || (eval2.result.value.vPaused === false)
    };
  } finally {
    chrome.kill('SIGKILL');
  }
}

async function main() {
  console.log('=== 1. CANONICAL DESKTOP (1280x900) VERIFICATION ===');
  const prodDesktop = await verifyUrl('https://inshatech-b6b.pages.dev/', { width: 1280, height: 900, isMobile: false });
  console.log(JSON.stringify(prodDesktop, null, 2));

  console.log('\n=== 2. CANONICAL MOBILE (390x844) VERIFICATION ===');
  const prodMobile = await verifyUrl('https://inshatech-b6b.pages.dev/', { width: 390, height: 844, isMobile: true });
  console.log(JSON.stringify(prodMobile, null, 2));
}

main().catch(console.error);
