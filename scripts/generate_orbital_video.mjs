import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function generateVideo() {
  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const webmPath = path.join(assetsDir, 'hero-celestial-loop.webm');
  const posterPath = path.join(assetsDir, 'hero-celestial-poster.jpg');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-video-'));
  const port = 9333 + Math.floor(Math.random() * 200);

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #070811; overflow: hidden; }
    canvas { display: block; width: 1280px; height: 720px; }
  </style>
</head>
<body>
  <canvas id="c" width="1280" height="720"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 1280, H = 720;
    const TOTAL_SECONDS = 8;
    const FPS = 30;
    const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

    // Stars
    const stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: (Math.PI * 2 * (1 + Math.floor(Math.random() * 3))) / TOTAL_FRAMES
      });
    }

    // Celestial Orbits
    const orbits = [
      { rx: 420, ry: 160, tilt: -0.22, speed: 1, color: 'rgba(168, 85, 247, 0.35)', dotColor: '#c084fc', dotSize: 7 },
      { rx: 320, ry: 120, tilt: 0.15, speed: -1, color: 'rgba(56, 189, 248, 0.32)', dotColor: '#38bdf8', dotSize: 5.5 },
      { rx: 220, ry: 80, tilt: -0.08, speed: 2, color: 'rgba(238, 169, 214, 0.3)', dotColor: '#f472b6', dotSize: 4 }
    ];

    function drawFrame(frame) {
      const progress = frame / TOTAL_FRAMES;
      const angle = progress * Math.PI * 2;

      // Dark obsidian background with subtle radial gradient
      ctx.fillStyle = '#070811';
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 600);
      grad.addColorStop(0, 'rgba(30, 27, 75, 0.45)');
      grad.addColorStop(0.5, 'rgba(15, 12, 41, 0.3)');
      grad.addColorStop(1, 'rgba(7, 8, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        const pulse = Math.sin(frame * s.pulseSpeed) * 0.3 + 0.7;
        ctx.fillStyle = \`rgba(255, 255, 255, \${s.alpha * pulse})\`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central core celestial glow
      const coreGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 140);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.2, 'rgba(216, 217, 255, 0.75)');
      coreGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
      coreGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 140, 0, Math.PI * 2);
      ctx.fill();

      // Core planet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2);
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Orbit Ellipses & Planets
      for (const orb of orbits) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(orb.tilt);

        // Path
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Planet on orbit
        const theta = angle * orb.speed;
        const px = Math.cos(theta) * orb.rx;
        const py = Math.sin(theta) * orb.ry;

        // Planet glow
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, orb.dotSize * 3);
        pGrad.addColorStop(0, orb.dotColor);
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, orb.dotSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, orb.dotSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    window.recordVideo = async function() {
      const stream = canvas.captureStream(FPS);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const donePromise = new Promise(resolve => {
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(blob);
        };
      });

      recorder.start();

      let f = 0;
      return new Promise(resolve => {
        const interval = setInterval(() => {
          drawFrame(f);
          f++;
          if (f >= TOTAL_FRAMES) {
            clearInterval(interval);
            recorder.stop();
            donePromise.then(resolve);
          }
        }, 1000 / FPS);
      });
    };

    window.capturePoster = function() {
      drawFrame(0);
      return canvas.toDataURL('image/jpeg', 0.88).split(',')[1];
    };
  </script>
</body>
</html>`;

  const htmlPath = path.join(tempDir, 'generator.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

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
    if (!pageTarget) throw new Error('Chrome CDP port did not respond.');

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
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    await send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 800));

    console.log('Generating celestial poster image...');
    const posterRes = await send('Runtime.evaluate', {
      expression: 'window.capturePoster()',
      returnByValue: true
    });
    const posterB64 = posterRes.result.value;
    fs.writeFileSync(posterPath, Buffer.from(posterB64, 'base64'));
    console.log(`✅ Saved poster: ${posterPath} (${fs.statSync(posterPath).size} bytes)`);

    console.log('Rendering 8-second seamless 30fps celestial WebM loop...');
    const videoRes = await send('Runtime.evaluate', {
      expression: 'window.recordVideo()',
      awaitPromise: true,
      returnByValue: true
    });
    const videoB64 = videoRes.result.value;
    fs.writeFileSync(webmPath, Buffer.from(videoB64, 'base64'));
    console.log(`✅ Saved WebM video: ${webmPath} (${fs.statSync(webmPath).size} bytes)`);

    return { posterPath, webmPath };
  } finally {
    if (ws) ws.close();
    chromeProc.kill('SIGKILL');
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

generateVideo().then(() => {
  console.log('Orbital assets generated successfully.');
  process.exit(0);
}).catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
