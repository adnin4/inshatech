import { spawn } from 'child_process';
import path from 'path';

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const proc = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9333', '--no-first-run', 'about:blank']);
  await new Promise(r => setTimeout(r, 1000));
  
  try {
    const res = await fetch('http://127.0.0.1:9333/json');
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    
    let id = 1;
    const send = (method, params={}) => new Promise(resolve => {
      const cur = id++;
      const h = evt => {
        const d = JSON.parse(evt.data);
        if(d.id === cur) { ws.removeEventListener('message', h); resolve(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({id: cur, method, params}));
    });
    
    await send('Page.enable');
    await send('Runtime.enable');
    const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
    await send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 2000));
    
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.querySelector('#iinsha-diagram-scene');
        if (!c) return { exists: false };
        return {
          exists: true,
          width: c.width,
          height: c.height,
          clientWidth: c.clientWidth,
          clientHeight: c.clientHeight,
          autoInit: document.documentElement.hasAttribute('data-iinsha-auto-init'),
          hasDiagramMotion: typeof window.IINSHA !== 'undefined' && typeof window.IINSHA.DiagramMotion !== 'undefined'
        };
      })()`,
      returnByValue: true
    });
    
    console.log('Canvas check result on index.html:');
    console.log(JSON.stringify(check.result.value, null, 2));
    ws.close();
  } finally {
    proc.kill();
  }
}

run().catch(console.error);
