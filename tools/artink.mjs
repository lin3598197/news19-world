// tools/artink.mjs — how dark is each drawing, measured on the rendered sheet.
//
// compose.mjs writes artboxes.json (each drawing's box on page.png). This reads
// that, crops each box, and reports the share of near-black pixels inside it, so
// "lighten the dark ones" is driven by measurement rather than by eye.
//
//   node tools/artink.mjs [page.png]
import { execFileSync } from 'node:child_process';
import { readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SRC = process.argv[2] || 'page.png';
const BOXES = JSON.parse(readFileSync('artboxes.json', 'utf8'));
const TOL = 70;
const N = 40;   // per-box sample grid

const rows = [];
for (const b of BOXES) {
  const RAW = join(tmpdir(), `art-${b.key}-${process.pid}.raw`);
  execFileSync('magick', [SRC, '-crop', `${Math.round(b.w)}x${Math.round(b.h)}+${Math.round(b.left)}+${Math.round(b.top)}`,
    '+repage', '-resize', `${N}x${N}!`, '-depth', '8', `rgb:${RAW}`]);
  const buf = readFileSync(RAW);
  unlinkSync(RAW);
  let d = 0;
  for (let i = 0; i < N * N * 3; i += 3) {
    if (Math.max(buf[i], buf[i + 1], buf[i + 2]) < TOL) d++;
  }
  rows.push({ key: b.key, p: 100 * d / (N * N), w: Math.round(b.w), h: Math.round(b.h) });
}

rows.sort((a, b) => b.p - a.p);
console.log(`${SRC}: near-black share inside each drawing box (max channel < ${TOL})\n`);
for (const r of rows) {
  const flag = r.p >= 25 ? '  <-- DARK' : '';
  console.log(`  ${r.key.padEnd(11)} ${String(r.w).padStart(4)}x${String(r.h).padStart(4)}  ` +
              `${r.p.toFixed(1).padStart(6)}%  ${'#'.repeat(Math.round(r.p / 2))}${flag}`);
}
