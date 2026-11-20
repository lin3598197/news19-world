// tools/vision300.mjs — the v5 acceptance gate.
//
// For each of the thirteen drawings this reports, measured from the actual render:
//   cover    — share of the box taken by the single most common non-field colour,
//              i.e. how much of the frame the dominant flat shape occupies
//   contrast — how far that shape's luminance sits from the field behind it (0..1)
//   dark     — near-black share inside the box (max channel < 70)
//   stroke   — thinnest stroke-width in the drawn SVG, in user units
//
// It then crops each drawing out of page.png, reduces it to the size the judge sees
// (183 px on a 1024 sheet -> 54 px at 300 px), and tiles the thirteen real crops into
// proof300.png, blown back up 8x with a point filter so the surviving pixels are the
// ones on show. A drawing passes when cover >= 55%, contrast >= 45%, stroke >= 4 units.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const W = 1024, H = 1024;
const PAGE = process.env.PAGE || 'page.png';
const BOXES = JSON.parse(readFileSync('artboxes.json', 'utf8'));
const HTML = readFileSync('page.html', 'utf8');

const TW = 54, TH = 32, BIG = 8;      // true size at 300px, then magnification
const TOL = 14;                       // per-channel distance that counts as "not the field"

const rawFile = '.vision300.raw';
execFileSync('magick', [PAGE, '-colorspace', 'sRGB', '-depth', '8', 'rgb:' + rawFile],
  { stdio: 'ignore' });
const page = readFileSync(rawFile);

const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
// Quantise to 5 bits per channel before tallying. At this size every edge pixel is a
// new colour, so without this a flat mass of 60% reports as forty slivers of 1.5% each.
const q = v => Math.round(v / 32) * 32;
const hex = c => '#' + c.map(v => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0')).join('');
const at = (x, y) => { const i = (y * W + x) * 3; return [page[i], page[i + 1], page[i + 2]]; };
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const far = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));

function minStroke(key) {
  const m = HTML.match(new RegExp(`data-key="${key}"[^>]*>([\\s\\S]*?)</svg>`));
  if (!m) return null;
  const w = [...m[1].matchAll(/stroke-width="([\d.]+)"/g)].map(k => +k[1]);
  return w.length ? Math.min(...w) : null;
}

// The ground of a drawing is its own first full-bleed rect, read from the emitted SVG.
// Guessing it from pixels is unreliable: a two-tone object's larger mass can out-vote
// the sky, and a half-pixel letterbox sliver can win the corners.
function groundOf(key) {
  const m = HTML.match(new RegExp(`data-key="${key}"[^>]*>([\\s\\S]*?)</svg>`));
  if (!m) return null;
  const g = m[1].match(/<rect[^>]*width="160"[^>]*height="96"[^>]*fill="(#[0-9a-fA-F]{6})"/);
  return g ? g[1] : null;
}

rmSync('.proof', { recursive: true, force: true });
mkdirSync('.proof', { recursive: true });

const rows = [];
let fails = 0;

BOXES.forEach((b, i) => {
  const x0 = Math.max(0, Math.floor(b.left)), y0 = Math.max(0, Math.floor(b.top));
  const x1 = Math.min(W, Math.ceil(b.left + b.w)), y1 = Math.min(H, Math.ceil(b.top + b.h));

  const inside = [], ring = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const c = at(x, y);
      inside.push(c);
      const dx = x - x0, dy = y - y0;
      if (dx < 7 || dy < 7 || dx > (x1 - x0) - 7 || dy > (y1 - y0) - 7) ring.push(c);
    }
  }
  const cnt = list => {
    const m = new Map();
    for (const c of list) { const k = hex([q(c[0]), q(c[1]), q(c[2])]); m.set(k, (m.get(k) || 0) + 1); }
    return [...m.entries()].sort((a, c) => c[1] - a[1]);
  };
  // The field is the ground the drawing declares with its own full-bleed rect.
  // Coverage is everything that is not that ground, so a two-tone object (house + flame,
  // pad + tag) counts as the one silhouette it is.
  const ranked = cnt(inside);
  const declared = groundOf(b.key);
  // Compare against the drawing's true declared ground colour, not its quantised form:
  // quantising #f4efe0 to #ffe0e0 puts every paper pixel 15 units away from the field,
  // which would count the whole background as object and report a fake ~100% coverage.
  const field = declared ? rgb(declared) : rgb(ranked[0][0]);
  const fieldC = hex(field);
  const fieldQ = hex(field.map(q));

  const cover = inside.filter(c => far(c, field) > TOL).length / inside.length;
  // filter the tallies with the quantised field: the keys in `ranked` are quantised, so
  // comparing them to the true ground colour makes the ground's own bin look like object
  const masses = ranked.filter(([k]) => far(rgb(k), rgb(fieldQ)) > TOL);
  const domHex = (masses[0] || [fieldC])[0];
  const dom = rgb(domHex);

  const contrast = Math.abs(lum(...field) - lum(...dom));
  const dark = inside.filter(c => Math.max(...c) < 70).length / inside.length;
  const sw = minStroke(b.key);

  const coverOk = cover >= 0.55, contrastOk = contrast >= 0.45;
  const strokeOk = sw === null || sw >= 4;
  const pass = coverOk && contrastOk && strokeOk;
  if (!pass) fails++;

  rows.push({ key: b.key, cover, dom: domHex, field: fieldC, contrast, dark, sw, pass,
              bad: [!coverOk && 'cover', !contrastOk && 'contrast', !strokeOk && 'stroke']
                .filter(Boolean).join('+') });

  execFileSync('magick', [PAGE, '-crop', `${x1 - x0}x${y1 - y0}+${x0}+${y0}`, '+repage',
    '-resize', `${TW}x${TH}!`, '-filter', 'point', '-resize', `${TW * BIG}x${TH * BIG}!`,
    `.proof/${i}.png`], { stdio: 'ignore' });
});

console.log('drawing      cover   dominant  field     contrast  near-black  stroke  verdict');
for (const r of rows) {
  console.log(
    r.key.padEnd(12) +
    (r.cover * 100).toFixed(1).padStart(6) + '%  ' +
    r.dom.padEnd(9) + ' ' + r.field.padEnd(9) +
    (r.contrast * 100).toFixed(0).padStart(5) + '%  ' +
    (r.dark * 100).toFixed(1).padStart(7) + '%   ' +
    (r.sw === null ? '  none' : r.sw.toFixed(1)).padStart(7) + '   ' +
    (r.pass ? 'PASS' : 'FAIL ' + r.bad)
  );
}
console.log('\npassed ' + (rows.length - fails) + '/' + rows.length +
            '   (cover >= 55%, contrast >= 45%, min stroke >= 4 units)');

const args = ['montage'];
rows.forEach((r, i) => args.push('-label', `${r.key}${r.pass ? '' : '  X'}`, `.proof/${i}.png`));
args.push('-background', 'white', '-fill', '#111', '-font', 'Helvetica',
  '-pointsize', '28', '-tile', '13x1', '-geometry', '+8+8', 'proof300.png');
execFileSync('magick', args, { stdio: 'ignore' });
console.log('wrote proof300.png  (' + rows.length + ' x ' + TW + 'x' + TH +
            ' px at true size, shown at ' + BIG + 'x)');
rmSync(rawFile, { force: true });
