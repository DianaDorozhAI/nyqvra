'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
function fail(code) { throw new Error(code); }
function validateEntry(input) {
  if (!input || typeof input.secret !== 'string' || !input.secret.length || input.secret.length > 4096) fail('INVALID_ENTRY');
  let label = typeof input.label === 'string' ? input.label.trim() : '';
  const url = typeof input.url === 'string' ? input.url.trim() : '';
  if (label.length > 120 || url.length > 2048) fail('INVALID_ENTRY');
  if (url) {
    let parsed;
    try { parsed = new URL(url); } catch { fail('INVALID_URL'); }
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) fail('INVALID_URL');
    if (!label) label = parsed.hostname;
  }
  if (!label) fail('NAME_REQUIRED');
  return { label, url, secret: input.secret };
}
class Vault {
  constructor(file, encryption) { this.file = file; this.encryption = encryption; }
  async check() { if (!(await this.encryption.isAsyncEncryptionAvailable())) fail('ENCRYPTION_UNAVAILABLE'); }
  async read() {
    await this.check();
    if (!fs.existsSync(this.file)) return [];
    if (fs.statSync(this.file).size > 12 * 1024 * 1024) fail('VAULT_UNREADABLE');
    try {
      const decrypted = await this.encryption.decryptStringAsync(fs.readFileSync(this.file));
      const data = JSON.parse(decrypted.result);
      if (data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > 1000) fail('VAULT_UNREADABLE');
      for (const entry of data.entries) {
        validateEntry(entry);
        if (typeof entry.id !== 'string' || typeof entry.createdAt !== 'string') fail('VAULT_UNREADABLE');
      }
      if (decrypted.shouldReEncrypt) await this.write(data.entries);
      return data.entries;
    } catch { fail('VAULT_UNREADABLE'); }
  }
  async write(entries) {
    await this.check();
    const encrypted = await this.encryption.encryptStringAsync(JSON.stringify({ version: 1, entries }));
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const temporary = `${this.file}.tmp`;
    try {
      fs.writeFileSync(temporary, encrypted, { mode: 0o600 });
      fs.renameSync(temporary, this.file);
    } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  }
  async list() { return (await this.read()).map(({ secret, ...metadata }) => metadata); }
  async save(input) {
    const entry = { ...validateEntry(input), id: randomUUID(), createdAt: new Date().toISOString() };
    const entries = await this.read();
    if (entries.length >= 1000) fail('VAULT_FULL');
    await this.write([entry, ...entries]);
    const { secret, ...metadata } = entry;
    return metadata;
  }
  async reveal(id) {
    if (typeof id !== 'string') fail('ENTRY_NOT_FOUND');
    const entry = (await this.read()).find(item => item.id === id);
    if (!entry) fail('ENTRY_NOT_FOUND');
    return entry.secret;
  }
  async remove(id) {
    const entries = await this.read();
    if (!entries.some(item => item.id === id)) fail('ENTRY_NOT_FOUND');
    await this.write(entries.filter(item => item.id !== id));
  }
}
module.exports = { Vault, validateEntry };
