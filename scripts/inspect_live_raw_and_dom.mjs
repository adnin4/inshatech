import fs from 'fs';
import { spawn } from 'child_process';

async function main() {
  const res = await fetch('https://inshatech-b6b.pages.dev/');
  const html = await res.text();
  console.log('=== RAW HTTP RESPONSE ===');
  console.log('HTTP Status:', res.status);
  console.log('X-Robots-Tag header:', res.headers.get('x-robots-tag'));
  console.log('Content-Type header:', res.headers.get('content-type'));
  console.log('HTML byte length:', Buffer.byteLength(html));
  console.log('Raw canonical:', html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || 'NOT FOUND');
  console.log('Raw robots meta:', html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || 'NOT FOUND');
  console.log('Raw canvas tag:', html.match(/<canvas[^>]*>/i)?.[0] || 'NOT FOUND');
  console.log('Raw data-service-id count:', (html.match(/data-service-id/g) || []).length);

  // Now inspect via headless Chrome CDP
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9933',
    '--disable-gpu',
    '--no-first-run',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const targetsRes = await fetch('http://127.0.0.1:9933/json');
  const targets = await targetsRes.json();
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

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
  await send('Page.navigate', { url: 'https://inshatech-b6b.pages.dev/' });
  await new Promise(r => setTimeout(r, 3500));

  const domCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const canonical = document.querySelector('link[rel="canonical"]')?.outerHTML || null;
      const robots = document.querySelector('meta[name="robots"]')?.outerHTML || null;
      const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
        id: c.id,
        className: c.className,
        styleDisplay: window.getComputedStyle(c).display,
        width: c.width,
        height: c.height,
        gl2: Boolean(c.getContext('webgl2')),
        gl: Boolean(c.getContext('webgl'))
      }));
      const serviceCardsWithId = Array.from(document.querySelectorAll('.service-item-card[data-service-id]')).length;
      const allServiceCards = Array.from(document.querySelectorAll('.service-item-card')).length;
      return {
        canonical,
        robots,
        canvasCount: canvases.length,
        canvases,
        allServiceCards,
        serviceCardsWithId,
        heroContainerHtml: document.getElementById('hero3d-container')?.innerHTML?.slice(0, 300) || null
      };
    })()`,
    returnByValue: true
  });

  console.log('\n=== REAL CHROME DOM EVALUATION ===');
  console.log(JSON.stringify(domCheck.result?.value || domCheck.value || domCheck, null, 2));
  chrome.kill();
}

main().catch(e => console.error(e));
