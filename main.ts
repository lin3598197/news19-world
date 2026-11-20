#!/usr/bin/env node
// main.ts — bounty entrypoint for news-image-20261119.
// Copies entry.png to $MAKEFUN_OUTPUT_DIR/entry.png after checking the file is a
// real PNG, exactly 1024x1024, and no larger than 1 MiB.
//
//   node --experimental-strip-types main.ts     (Node 22)
//   MAKEFUN_OUTPUT_DIR=/path/to/out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'entry.png');
const MAX = 1024 * 1024;
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(msg: string): never {
  console.error('main.ts: ' + msg);
  process.exit(1);
}

if (!statSync) fail('unreachable');
let size = 0;
try {
  size = statSync(SRC).size;
} catch {
  fail(`missing ${SRC}`);
}

const buf = readFileSync(SRC);
if (buf.length < 33) fail('entry.png is too short to be a PNG');
if (!buf.subarray(0, 8).equals(PNG_SIG)) fail('entry.png does not start with the PNG signature');
if (buf.subarray(12, 16).toString('latin1') !== 'IHDR') fail('entry.png has no IHDR chunk first');

const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  fail(`entry.png is ${width}x${height}, expected 1024x1024`);
}
if (buf.length > MAX) fail(`entry.png is ${buf.length} bytes, over the ${MAX} byte cap`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) fail('MAKEFUN_OUTPUT_DIR is not set');
const dest = join(resolve(outDir), 'entry.png');
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(SRC, dest);

const check = readFileSync(dest);
if (!check.subarray(0, 8).equals(PNG_SIG)) fail('copy at destination is not a PNG');
if (check.readUInt32BE(16) !== 1024 || check.readUInt32BE(20) !== 1024) {
  fail('copy at destination is not 1024x1024');
}

console.log(`wrote ${dest}`);
console.log(`  png   1024x1024, ${check.length} bytes (source ${size})`);
console.log(`  sha   ${(await import('node:crypto')).createHash('sha256').update(check).digest('hex')}`);
