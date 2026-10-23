import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('serves only public application files with restrictive headers', async () => {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '--port', '0'], { stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    const output = await Promise.race([
      once(child.stdout, 'data').then(([chunk]) => chunk.toString()),
      once(child, 'error').then(([error]) => { throw error; }),
      new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('server start timeout')), 5000); timer.unref(); })
    ]);
    const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    assert.ok(address);
    const home = await fetch(address);
    assert.equal(home.status, 200);
    assert.match(home.headers.get('content-security-policy'), /connect-src 'none'/);
    assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
    assert.match(await home.text(), /id="generate"/);
    const asset = await fetch(address + '/src/engineering.css');
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('content-type'), /text\/css/);
    const head = await fetch(address, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    assert.equal((await fetch(address, { method: 'POST' })).status, 405);
    const legacy = await fetch(address + '/xray', { redirect: 'manual' });
    assert.equal(legacy.status, 302);
    assert.equal(legacy.headers.get('location'), '/');
    for (const path of ['/package.json', '/work/', '/src/%2e%2e%2fpackage.json']) {
      assert.equal((await fetch(address + path)).status, 404);
    }
  } finally { child.kill(); }
});
