// tools/ink.mjs — measure how much of the sheet is near-black.
//
// Downsamples the render to 160x160 (the brief's grid), then counts pixels whose
// brightest channel is under 70. Prints the overall share and the share in each
// 64px band, so the offending band is obvious rather than guessed at.
//
//   node tools/ink.mjs [page.png]
import { execFileSync } from 'node:child_process';
import { readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SRC = process.argv[2] || 'page.png';
const N = 160;        // downsample grid
const TOL = 70;       // brightest channel under this counts as near-black
const BAND = 64;      // report on 64px strips of the 1024 sheet
const SHEET = 1024;

const RAW = join(tmpdir(), 'ink-' + process.pid + '.raw');
execFileSync('magick', [SRC, '-resize', `${N}x${N}!`, '-depth', '8', `rgb:${RAW}`]);
const buf = readFileSync(RAW);
unlinkSync(RAW);

const at = (x, y) => { const i = (y * N + x) * 3; return [buf[i], buf[i + 1], buf[i + 2]]; };
const dark = (r, g, b) => Math.max(r, g, b) < TOL;

let total = 0;
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const [r, g, b] = at(x, y);
  if (dark(r, g, b)) total++;
}
const share = 100 * total / (N * N);
console.log(`${SRC}: near-black (max channel < ${TOL}) = ${share.toFixed(2)}%   [${total}/${N * N} px at ${N}x${N}]`);

const rowsPerBand = Math.round(BAND / SHEET * N);
console.log('');
console.log('band y (1024)    near-black   share');
let worst = { p: -1, y: 0 };
for (let y0 = 0; y0 < N; y0 += rowsPerBand) {
  let d = 0, n = 0;
  const yEnd = Math.min(y0 + rowsPerBand, N);
  for (let y = y0; y < yEnd; y++) for (let x = 0; x < N; x++) {
    const [r, g, b] = at(x, y); n++;
    if (dark(r, g, b)) d++;
  }
  const p = 100 * d / n;
  if (p > worst.p) worst = { p, y: Math.round(y0 / N * SHEET) };
  const yA = Math.round(y0 / N * SHEET);
  const yB = Math.round(yEnd / N * SHEET) - 1;
  console.log(`${String(yA).padStart(4)}-${String(yB).padStart(4)}  ${p.toFixed(1).padStart(8)}%   ${'#'.repeat(Math.round(p / 2))}`);
}
console.log('');
console.log(`overall ${share.toFixed(2)}%  (target < 6%)`);
console.log(`worst band ${worst.y}-${worst.y + BAND - 1}: ${worst.p.toFixed(1)}%  (target < 30%)`);
