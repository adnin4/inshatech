import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const heroPath = path.join(ROOT, 'hero3d.js');
let js = fs.readFileSync(heroPath, 'utf8');

js = js.replace("coronaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');", "coronaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.55)');");
js = js.replace("coronaGrad.addColorStop(0.35, 'rgba(139, 92, 246, 0.14)');", "coronaGrad.addColorStop(0.35, 'rgba(139, 92, 246, 0.35)');");
js = js.replace("coronaGrad.addColorStop(0.7, 'rgba(0, 242, 254, 0.04)');", "coronaGrad.addColorStop(0.7, 'rgba(0, 242, 254, 0.15)');");

js = js.replace("ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';", "ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';");
js = js.replace("ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';", "ctx.strokeStyle = 'rgba(139, 92, 246, 0.38)';");
js = js.replace("ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';", "ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';");

js = js.replace("const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.45;", "const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.85;");

fs.writeFileSync(heroPath, js, 'utf8');
console.log('✓ hero3d.js visibility and luminescence boosted');
