import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { externalAllowed, resourcePath } = require('../desktop/policy.cjs');
const { Vault, validateEntry } = require('../desktop/vault.cjs');
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

// Test adapter only. The application uses Windows safeStorage, not this key.
function testEncryption() {
  const key = randomBytes(32);
  return {
    async isAsyncEncryptionAvailable() { return true; },
    async encryptStringAsync(value) {
      const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
      const body = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
      return Buffer.concat([iv, cipher.getAuthTag(), body]);
    },
    async decryptStringAsync(value) {
      const cipher = createDecipheriv('aes-256-gcm', key, value.subarray(0, 12), { authTagLength: 16 });
      cipher.setAuthTag(value.subarray(12, 28));
      return { result: Buffer.concat([cipher.update(value.subarray(28)), cipher.final()]).toString('utf8'), shouldReEncrypt: false };
    },
  };
}

test('journal validates account metadata and rejects unsafe URLs', () => {
  assert.equal(validateEntry({ secret: 'test', url: 'https://example.com' }).label, 'example.com');
  for (const url of ['javascript:alert(1)', 'file:///test', 'https://user:password@example.com']) {
    assert.throws(() => validateEntry({ secret: 'test', url }), /INVALID_URL/);
  }
  assert.throws(() => validateEntry({ secret: 'test' }), /NAME_REQUIRED/);
  assert.throws(() => validateEntry({ secret: '', label: 'Test' }), /INVALID_ENTRY/);
});

test('journal persists encrypted entries, omits secrets from lists and deletes by ID', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nyqvra-vault-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'journal.enc'), encryption = testEncryption();
  const vault = new Vault(file, encryption);
  const entry = await vault.save({ label: 'Test account', secret: 'TEST-ONLY-secret-123' });
  assert.equal('secret' in entry, false);
  const reopened = new Vault(file, encryption);
  assert.equal(await reopened.reveal(entry.id), 'TEST-ONLY-secret-123');
  assert.equal('secret' in (await reopened.list())[0], false);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.includes(Buffer.from('TEST-ONLY-secret-123')), false);
  assert.equal(bytes.includes(Buffer.from('Test account')), false);
  assert.equal(fs.existsSync(`${file}.tmp`), false);
  await reopened.remove(entry.id);
  assert.deepEqual(await reopened.list(), []);
  await assert.rejects(reopened.reveal(entry.id), /ENTRY_NOT_FOUND/);
});

test('journal fails closed and never overwrites corrupt data', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nyqvra-vault-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'journal.enc');
  const blocked = new Vault(file, { async isAsyncEncryptionAvailable() { return false; } });
  await assert.rejects(blocked.save({ label: 'Test', secret: 'test' }), /ENCRYPTION_UNAVAILABLE/);
  assert.equal(fs.existsSync(file), false);
  const corrupt = Buffer.from('invalid encrypted test data');
  fs.writeFileSync(file, corrupt);
  const vault = new Vault(file, testEncryption());
  await assert.rejects(vault.save({ label: 'Test', secret: 'test' }), /VAULT_UNREADABLE/);
  assert.deepEqual(fs.readFileSync(file), corrupt);
});
test('desktop serves only bundled resources on its own origin', () => {
  const files = new Set(['index.html', 'src/app.js']);
  assert.equal(resourcePath('nyqvra://app/index.html?v=1#generator', files), 'index.html');
  assert.equal(resourcePath('nyqvra://app/src/app.js', files), 'src/app.js');
  for (const url of ['file:///etc/passwd', 'https://app/index.html', 'nyqvra://evil/index.html', 'nyqvra://app/../package.json', 'nyqvra://app/%2e%2e/package.json', 'nyqvra://app/%2e%2e%2fpackage.json', 'nyqvra://app/src%5capp.js', 'nyqvra://app/%ZZ', 'nyqvra://user@app/index.html']) assert.equal(resourcePath(url, files), null, url);
});
test('desktop external links use an exact HTTPS allowlist', () => {
  assert.equal(externalAllowed('https://github.com/DianaDorozhAI/nyqvra'), true);
  assert.equal(externalAllowed('https://github.com/DianaDorozhAI/nyqvra/releases/latest'), true);
  assert.equal(externalAllowed('https://github.com/DianaDorozhAI/nyqvra/releases/tag/v0.3.0'), true);
  for (const url of ['file:///C:/Windows/system32/cmd.exe', 'javascript:alert(1)', 'https://github.com@evil.com/DianaDorozhAI/nyqvra', 'https://github.com/DianaDorozhAI/nyqvra?redirect=evil', 'http://github.com/DianaDorozhAI/nyqvra']) assert.equal(externalAllowed(url), false);
});
