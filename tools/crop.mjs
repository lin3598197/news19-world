// tools/crop.mjs — magnify a region of page.png for inspection.
// usage: node tools/crop.mjs x y w h scale out.png
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [x, y, w, h, scale, out] = process.argv.slice(2);
const S = Number(scale), W = Number(w), H = Number(h);
const HTML = new URL('../crop.html', import.meta.url).pathname.replace(/^\//, '');
const W2 = Math.round(W * S), H2 = Math.round(H * S);

writeFileSync(HTML, `<!doctype html><meta charset="utf-8"><style>
 html,body{margin:0;width:${W2}px;height:${H2}px;overflow:hidden;background:#fff}
 .v{width:${W2}px;height:${H2}px;background:url(page.png) -${Number(x) * S}px -${Number(y) * S}px /
     ${1024 * S}px ${1024 * S}px no-repeat;image-rendering:auto}
</style><div class="v"></div>`);

const r = spawnSync('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  `--window-size=${W2},${H2}`, `--screenshot=C:/Users/lin35/makefun/newsrepo19/${out}`,
  'file:///C:/Users/lin35/makefun/newsrepo19/crop.html'
], { encoding: 'utf8' });
if (r.status !== 0) console.log(r.stderr?.slice(0, 400));
console.log('wrote', out, W2 + 'x' + H2);
