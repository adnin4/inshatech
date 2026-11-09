import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webm': 'video/webm',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

async function startLocalServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT_DIR, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || req.url === '/') {
      filePath = path.join(ROOT_DIR, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(8789, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function measureMobile() {
  const server = await startLocalServer();
  const port = 9558;
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
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });

    console.log('Navigating to local server: http://127.0.0.1:8789/');
    await send('Page.navigate', { url: 'http://127.0.0.1:8789/' });
    await new Promise(r => setTimeout(r, 3500));

    const checkOverflow = await send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const bodyEl = document.body;

        const culprits = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 390.5 || r.right > 390.5) {
            const s = window.getComputedStyle(el);
            if (s.display !== 'none' && s.visibility !== 'hidden') {
              culprits.push({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                rectWidth: Math.round(r.width),
                rectRight: Math.round(r.right),
                scrollWidth: el.scrollWidth
              });
            }
          }
        });

        const stickyCta = document.querySelector('#sticky-mobile-cta') || document.querySelector('.sticky-mobile-cta');
        const copilot = document.querySelector('#iinsha-copilot-trigger') || document.querySelector('.iinsha-cockpit-launcher');
        const teaser = document.querySelector('#iinsha-copilot-teaser');

        const getRect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return {
            top: r.top, bottom: r.bottom,
            left: r.left, right: r.right,
            width: r.width, height: r.height,
            display: s.display,
            visibility: s.visibility
          };
        };

        const stickyRect = getRect(stickyCta);
        const copilotRect = getRect(copilot);
        const teaserRect = getRect(teaser);

        const checkOverlap = (r1, r2) => {
          if (!r1 || !r2) return false;
          if (r1.display === 'none' || r2.display === 'none') return false;
          if (r1.visibility === 'hidden' || r2.visibility === 'hidden') return false;
          return !(
            r1.right <= r2.left ||
            r1.left >= r2.right ||
            r1.bottom <= r2.top ||
            r1.top >= r2.bottom
          );
        };

        return {
          viewportWidth: window.innerWidth,
          docScrollWidth: docEl.scrollWidth,
          bodyScrollWidth: bodyEl.scrollWidth,
          zeroHorizontalOverflow: docEl.scrollWidth <= 390 && bodyEl.scrollWidth <= 390,
          totalCulprits: culprits.length,
          topCulprits: culprits.slice(0, 10),
          stickyRect,
          copilotRect,
          teaserRect,
          hasOverlap: checkOverlap(stickyRect, copilotRect)
        };
      })()`,
      returnByValue: true
    });

    console.log('LOCAL SERVER MOBILE MEASUREMENT:');
    console.log(JSON.stringify(checkOverflow.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    server.close();
  }
}

measureMobile().catch(console.error);
