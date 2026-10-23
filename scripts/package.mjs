import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { resolve } from 'node:path';
import { runtimeFiles } from './runtime-files.mjs';

// A deterministic ZIP (fixed DOS timestamp, no dependency or shell executable).
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const name = `NYQVRA-${version}-offline`;
const table = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
const crc32 = b => {
  let c = 0xffffffff;
  for (const byte of b) c = table[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const entries = runtimeFiles.map(path => [path, readFileSync(path)]);
entries.push(['START-HERE.txt', readFileSync('docs/OFFLINE.txt')]);
entries.push(['THIRD_PARTY_NOTICES.md', readFileSync('THIRD_PARTY_NOTICES.md')]);
const manifest = entries.map(([p, b]) => `${createHash('sha256').update(b).digest('hex')}  ${p}`).join('\n') + '\n';
entries.push(['SHA256SUMS.txt', Buffer.from(manifest)]);
const local = [], central = [];
let offset = 0;
for (const [path, bytes] of entries) {
  const filename = Buffer.from(`${name}/${path}`);
  const compressed = deflateRawSync(bytes, { level: 9 });
  const crc = crc32(bytes);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50); h.writeUInt16LE(20, 4);
  h.writeUInt16LE(0x800, 6); h.writeUInt16LE(8, 8);
  h.writeUInt16LE(0x5c21, 12); // 2026-01-01
  h.writeUInt32LE(crc, 14); h.writeUInt32LE(compressed.length, 18);
  h.writeUInt32LE(bytes.length, 22); h.writeUInt16LE(filename.length, 26);
  local.push(h, filename, compressed);
  const c = Buffer.alloc(46);
  c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6);
  c.writeUInt16LE(0x800, 8); c.writeUInt16LE(8, 10); c.writeUInt16LE(0x5c21, 14);
  c.writeUInt32LE(crc, 16); c.writeUInt32LE(compressed.length, 20);
  c.writeUInt32LE(bytes.length, 24); c.writeUInt16LE(filename.length, 28);
  c.writeUInt32LE(offset, 42); central.push(c, filename);
  offset += h.length + filename.length + compressed.length;
}
const directory = Buffer.concat(central), end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
mkdirSync('outputs', { recursive: true });
const archive = Buffer.concat([...local, directory, end]);
writeFileSync(`outputs/${name}.zip`, archive);
writeFileSync('outputs/SHA256SUMS.txt', `${createHash('sha256').update(archive).digest('hex')}  ${name}.zip\n`);
console.log(`${resolve(`outputs/${name}.zip`)} (${entries.length} files)`);
