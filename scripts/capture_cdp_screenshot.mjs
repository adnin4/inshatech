import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

export async function captureAndMeasure(viewport = { width: 1664, height: 924 }, outputPath = null) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
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
    // Wait for chrome debug endpoint
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

    if (!pageTarget) throw new Error('Failed to connect to Chrome CDP endpoint.');

    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        } catch (err) {
          reject(err);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768
    });

    const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
    await send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 1500)); // wait for layout & fonts

    // Measure hero bounding boxes
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('.hero-title');
        const subtitle = document.querySelector('.hero-subtitle');
        const actions = document.querySelector('.hero-actions');
        const stage = document.querySelector('.hero-centered-stage') || document.querySelector('#s1');
        const scene = document.querySelector('#iinsha-diagram-scene');
        const trust = document.querySelector('.hero-trust-strip');

        const getBox = el => el ? {
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height),
          top: Math.round(el.getBoundingClientRect().top),
          left: Math.round(el.getBoundingClientRect().left),
          right: Math.round(el.getBoundingClientRect().right),
          bottom: Math.round(el.getBoundingClientRect().bottom)
        } : null;

        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          stage: getBox(stage),
          title: getBox(title),
          subtitle: getBox(subtitle),
          actions: getBox(actions),
          scene: getBox(scene),
          trust: getBox(trust)
        };
      })()`,
      returnByValue: true
    });

    const metrics = evalRes.result.value;

    if (outputPath) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(outputPath, Buffer.from(shot.data, 'base64'));
    }

    return metrics;
  } finally {
    if (ws) ws.close();
    chromeProc.kill('SIGKILL');
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

// Standalone execution
if (process.argv[1] && process.argv[1].endsWith('capture_cdp_screenshot.mjs')) {
  (async () => {
    console.log('--- Measuring Desktop (1664x924) ---');
    const desktop = await captureAndMeasure({ width: 1664, height: 924 }, 'current_desktop_hero_1664.png');
    console.log(JSON.stringify(desktop, null, 2));

    console.log('--- Measuring Mobile (390x844) ---');
    const mobile = await captureAndMeasure({ width: 390, height: 844 }, 'current_mobile_hero_390.png');
    console.log(JSON.stringify(mobile, null, 2));
  })().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
