import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function inspectUrl(url) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-live-'));
  const port = 9222 + Math.floor(Math.random() * 500);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--mute-audio',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  let ws = null;
  try {
    let pageTarget = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 100));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const targets = await res.json();
        pageTarget = targets.find(t => t.type === 'page');
        if (pageTarget) break;
      } catch (e) {}
    }

    if (!pageTarget) throw new Error('Failed to connect to Chrome');
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) rej(data.error);
          else res(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. DESKTOP VIEWPORT (1664 x 924)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1664,
      height: 924,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating Desktop (1664x924) to', url);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 3500));

    const desktopEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const video = document.querySelector('#hero-celestial-video') || document.querySelector('video');
        const canvas = document.querySelector('#iinsha-diagram-scene') || document.querySelector('canvas');
        
        return {
          title: document.title,
          url: window.location.href,
          hasVideoElement: Boolean(video),
          videoDetails: video ? {
            id: video.id,
            tagName: video.tagName,
            currentSrc: video.currentSrc,
            paused: video.paused,
            readyState: video.readyState,
            currentTime: video.currentTime,
            clientWidth: video.clientWidth,
            clientHeight: video.clientHeight,
            opacity: window.getComputedStyle(video).opacity,
            mixBlendMode: window.getComputedStyle(video).mixBlendMode
          } : null,
          hasCanvasElement: Boolean(canvas),
          canvasDetails: canvas ? {
            id: canvas.id,
            width: canvas.width,
            height: canvas.height,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
            renderer: canvas.dataset.renderer || 'unknown',
            display: window.getComputedStyle(canvas).display
          } : null,
          anchors: ['#s1','#s2','#s3','#s4','#s5','#s6'].map(id => ({ id, exists: Boolean(document.querySelector(id)) })),
          servicesSection: {
            categoriesCount: document.querySelectorAll('.cat-overview-card').length,
            panelsCount: document.querySelectorAll('.service-panel').length,
            totalServiceItemCards: document.querySelectorAll('.service-item-card').length
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('Desktop DOM Evaluation Result:');
    console.log(JSON.stringify(desktopEval.result.value, null, 2));

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/live_edge_inspect_1664.png', Buffer.from(shotDesktop.data, 'base64'));
    console.log('Saved desktop screenshot to docs/live_edge_inspect_1664.png');

    // 2. MOBILE VIEWPORT (390 x 844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log('Navigating Mobile (390x844) to', url);
    await new Promise(r => setTimeout(r, 1500));

    const mobileEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const stickyCta = document.querySelector('#sticky-mobile-cta') || document.querySelector('.sticky-mobile-cta');
        const copilotTrigger = document.querySelector('#iinsha-copilot-trigger') || document.querySelector('.iinsha-cockpit-launcher');
        const teaser = document.querySelector('#iinsha-copilot-teaser');

        const stickyRect = stickyCta ? stickyCta.getBoundingClientRect() : null;
        const copilotRect = copilotTrigger ? copilotTrigger.getBoundingClientRect() : null;

        let hasOverlap = false;
        if (stickyRect && copilotRect) {
          hasOverlap = !(
            copilotRect.right < stickyRect.left ||
            copilotRect.left > stickyRect.right ||
            copilotRect.bottom < stickyRect.top ||
            copilotRect.top > stickyRect.bottom
          );
        }

        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          zeroHorizontalOverflow: document.documentElement.scrollWidth <= 390,
          stickyCta: stickyRect ? {
            top: stickyRect.top,
            bottom: stickyRect.bottom,
            height: stickyRect.height,
            display: window.getComputedStyle(stickyCta).display
          } : null,
          copilotTrigger: copilotRect ? {
            top: copilotRect.top,
            bottom: copilotRect.bottom,
            height: copilotRect.height,
            display: window.getComputedStyle(copilotTrigger).display
          } : null,
          teaserHidden: teaser ? (window.getComputedStyle(teaser).display === 'none' || window.getComputedStyle(teaser).visibility === 'hidden') : true,
          hasOverlap
        };
      })()`,
      returnByValue: true
    });

    console.log('Mobile DOM Evaluation Result:');
    console.log(JSON.stringify(mobileEval.result.value, null, 2));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/live_edge_inspect_390.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved mobile screenshot to docs/live_edge_inspect_390.png');

    // 3. API VERSION ENDPOINT CHECK
    const apiVersionUrl = new URL('/api/version', url).href;
    console.log('Checking API Version endpoint:', apiVersionUrl);
    try {
      const verRes = await fetch(apiVersionUrl);
      const verData = await verRes.json();
      console.log('Live /api/version Status:', verRes.status);
      console.log('Live /api/version Payload:');
      console.log(JSON.stringify(verData, null, 2));
    } catch (err) {
      console.warn('Could not fetch /api/version:', err.message);
    }

  } finally {
    if (ws) ws.close();
    chromeProc.kill('SIGKILL');
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

inspectUrl('https://inshatech-b6b.pages.dev/').catch(console.error);
