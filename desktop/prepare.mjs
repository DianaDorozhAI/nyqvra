import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runtimeFiles } from '../scripts/runtime-files.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const desktop = resolve(root, 'desktop');
const target = resolve(desktop, 'app');
if (target !== resolve(root, 'desktop/app')) throw new Error('Invalid staging directory');
rmSync(target, { recursive: true, force: true });
for (const file of runtimeFiles) {
  const destination = resolve(target, file);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(resolve(root, file), destination);
}
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) cpSync(resolve(root, file), resolve(desktop, file));
const additions = ['desktop/renderer.js', 'desktop/renderer.css'];
for (const file of additions) {
  mkdirSync(dirname(resolve(target, file)), { recursive: true });
  cpSync(resolve(root, file), resolve(target, file));
}
const html = readFileSync(resolve(target, 'index.html'), 'utf8')
  .replace('</head>', '<link rel="stylesheet" href="desktop/renderer.css"></head>')
  .replace('</body>', '<script src="desktop/renderer.js" defer></script></body>');
writeFileSync(resolve(target, 'index.html'), html);
writeFileSync(resolve(desktop, 'runtime.json'), JSON.stringify([...runtimeFiles, ...additions]));
// Rasterize the existing mark into Windows ICO bitmap resolutions.
const require = createRequire(resolve(desktop, 'package.json'));
const sharp = require('sharp');
const source = readFileSync(resolve(root, 'src/assets/nyqvra-mark.svg'));
const sizes = [16, 24, 32, 48, 64, 128, 256];
const images = await Promise.all(sizes.map(async size => {
  const pixels = await sharp(source, { density: 384 }).resize(size, size).ensureAlpha().raw().toBuffer();
  const maskStride = Math.ceil(size / 32) * 4;
  const bytes = Buffer.alloc(40 + size * size * 4 + maskStride * size);
  bytes.writeUInt32LE(40, 0); bytes.writeInt32LE(size, 4); bytes.writeInt32LE(size * 2, 8);
  bytes.writeUInt16LE(1, 12); bytes.writeUInt16LE(32, 14); bytes.writeUInt32LE(size * size * 4, 20);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const from = (y * size + x) * 4, row = size - 1 - y, to = 40 + (row * size + x) * 4;
    bytes[to] = pixels[from + 2]; bytes[to + 1] = pixels[from + 1]; bytes[to + 2] = pixels[from]; bytes[to + 3] = pixels[from + 3];
    if (!pixels[from + 3]) bytes[40 + size * size * 4 + row * maskStride + (x >> 3)] |= 0x80 >> (x & 7);
  }
  return bytes;
}));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((bytes, i) => {
  const at = 6 + 16 * i, size = sizes[i];
  header[at] = size === 256 ? 0 : size; header[at + 1] = header[at];
  header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(bytes.length, at + 8); header.writeUInt32LE(offset, at + 12);
  offset += bytes.length;
});
writeFileSync(resolve(desktop, 'icon.ico'), Buffer.concat([header, ...images]));
console.log(`Staged ${runtimeFiles.length} runtime files; icon derived from nyqvra-mark.svg.`);
