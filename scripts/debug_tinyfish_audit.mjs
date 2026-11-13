import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const targetUrl = process.argv[2] || 'https://inshatech-b6b.pages.dev/';
  const port = 9445;
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
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 4000));

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const vId = document.getElementById('hero-celestial-video');
        const cId = document.getElementById('iinsha-diagram-scene');
        const backdrop = document.querySelector('.hero-visual-backdrop');

        const allVideos = Array.from(document.querySelectorAll('video')).map(v => ({
          id: v.id,
          ariaLabel: v.getAttribute('aria-label'),
          ariaHidden: v.getAttribute('aria-hidden'),
          paused: v.paused,
          readyState: v.readyState,
          display: window.getComputedStyle(v).display,
          opacity: window.getComputedStyle(v).opacity
        }));

        const allCanvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
          id: c.id,
          role: c.getAttribute('role'),
          ariaLabel: c.getAttribute('aria-label'),
          ariaHidden: c.getAttribute('aria-hidden'),
          width: c.width,
          height: c.height,
          display: window.getComputedStyle(c).display
        }));

        const servicePanels = Array.from(document.querySelectorAll('.service-panel')).map(p => ({
          id: p.id,
          display: window.getComputedStyle(p).display,
          cardsCount: p.querySelectorAll('.service-item-card').length,
          visibleCards: Array.from(p.querySelectorAll('.service-item-card')).filter(c => c.offsetParent !== null).length
        }));

        const allCards = Array.from(document.querySelectorAll('.service-item-card'));
        const visibleCards = allCards.filter(c => c.offsetParent !== null);

        return {
          targetUrl: window.location.href,
          backdropAriaHidden: backdrop ? backdrop.getAttribute('aria-hidden') : null,
          vIdPresent: Boolean(vId),
          cIdPresent: Boolean(cId),
          allVideos,
          allCanvases,
          totalServicePanels: servicePanels.length,
          servicePanels,
          totalServiceItemCards: allCards.length,
          visibleServiceItemCards: visibleCards.length
        };
      })()`,
      returnByValue: true
    });

    console.log(`AUDIT RESULT FOR ${targetUrl}:`);
    console.log(JSON.stringify(result.result.value, null, 2));
    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

run().catch(console.error);
