import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { runtimeFiles } from '../scripts/runtime-files.mjs';

const run = file => {
  const r = spawnSync(process.execPath, [file], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.stdout);
};
test('build and offline ZIP contain exactly the declared runtime, with valid hashes', () => {
  run('build.mjs'); run('scripts/package.mjs');
  const { version } = JSON.parse(readFileSync('package.json'));
  const name = `NYQVRA-${version}-offline`;
  const archive = readFileSync(`outputs/${name}.zip`);
  const entries = new Map();
  let offset = 0;
  while (archive.readUInt32LE(offset) === 0x04034b50) {
    const size = archive.readUInt32LE(offset + 18);
    const fullSize = archive.readUInt32LE(offset + 22);
    const n = archive.readUInt16LE(offset + 26), extra = archive.readUInt16LE(offset + 28);
    const path = archive.subarray(offset + 30, offset + 30 + n).toString();
    assert.ok(path.startsWith(`${name}/`) && !path.includes('..') && !path.includes('\\'));
    assert.equal(archive.readUInt16LE(offset + 8), 8);
    const start = offset + 30 + n + extra;
    const bytes = inflateRawSync(archive.subarray(start, start + size));
    assert.equal(bytes.length, fullSize);
    const short = path.slice(name.length + 1);
    assert.ok(!entries.has(short)); entries.set(short, bytes);
    offset = start + size;
  }
  assert.equal(archive.readUInt32LE(offset), 0x02014b50);
  assert.deepEqual([...entries.keys()].sort(), [...runtimeFiles,
    'START-HERE.txt', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'SHA256SUMS.txt'].sort());
  assert.deepEqual(entries.get('LICENSE'), readFileSync('LICENSE'));
  assert.match(entries.get('LICENSE').toString(), /^MIT License\n/);
  for (const line of entries.get('SHA256SUMS.txt').toString().trim().split('\n')) {
    const [hash, path] = line.split('  ');
    assert.equal(createHash('sha256').update(entries.get(path)).digest('hex'), hash);
  }
  for (const path of runtimeFiles) {
    assert.deepEqual(entries.get(path), readFileSync(path));
    assert.deepEqual(readFileSync(`dist/${path}`), readFileSync(path));
  }
  const checksum = createHash('sha256').update(archive).digest('hex');
  assert.equal(readFileSync('outputs/SHA256SUMS.txt', 'utf8'), `${checksum}  ${name}.zip\n`);
  run('scripts/package.mjs');
  assert.deepEqual(readFileSync(`outputs/${name}.zip`), archive);
});
test('runtime keeps privacy restrictions and uses only bundled cursor assets', () => {
  const html = readFileSync('index.html', 'utf8'), app = readFileSync('src/app.js', 'utf8');
  assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(app, /Math\.random\s*\(|localStorage|indexedDB|navigator\.sendBeacon|fetch\s*\(/);
  assert.match(readFileSync('src/engineering.css', 'utf8'), /pointer-lilac\.png/);
  assert.match(readFileSync('src/assets/icons/pointer-lilac.svg', 'utf8'), /flood-color="#c69af5"/);
});
