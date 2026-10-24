'use strict';
const { app, BrowserWindow, Menu, protocol, session, shell, ipcMain, safeStorage, clipboard } = require('electron');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { ORIGIN, isLocal, externalAllowed, resourcePath } = require('./policy.cjs');
const { Vault } = require('./vault.cjs');
const inventory = new Set(require('./runtime.json'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.txt': 'text/plain' };

protocol.registerSchemesAsPrivileged([{ scheme: 'nyqvra', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
app.setAppUserModelId('io.github.dianadorozhai.nyqvra');
app.commandLine.appendSwitch('disable-background-networking');
app.commandLine.appendSwitch('disable-component-update');
let window;
let journalReady = false;
let journalQueue = Promise.resolve();

async function createWindow({ show = true } = {}) {
  if (!journalReady) {
    const vault = new Vault(path.join(app.getPath('userData'), 'journal.enc'), safeStorage);
    ipcMain.handle('nyqvra:journal', (event, input) => {
      if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame || !isLocal(event.senderFrame.url)) return { ok: false, error: 'FORBIDDEN' };
      const operation = journalQueue.then(async () => { try {
        let value;
        switch (input?.action) {
          case 'list': value = await vault.list(); break;
          case 'save': value = await vault.save(input.value); break;
          case 'reveal': value = await vault.reveal(input.value); break;
          case 'copy': await clipboard.writeText(await vault.reveal(input.value)); break;
          case 'copyText':
            if (typeof input.value !== 'string' || !input.value.length || input.value.length > 4096) throw new Error('INVALID_ENTRY');
            await clipboard.writeText(input.value); break;
          case 'remove': await vault.remove(input.value); break;
          default: throw new Error('INVALID_ACTION');
        }
        return { ok: true, value };
      } catch (error) {
        const known = ['INVALID_ENTRY', 'INVALID_URL', 'NAME_REQUIRED', 'ENCRYPTION_UNAVAILABLE', 'VAULT_UNREADABLE', 'VAULT_FULL', 'ENTRY_NOT_FOUND'];
        return { ok: false, error: known.includes(error.message) ? error.message : 'STORAGE_ERROR' };
      } });
      journalQueue = operation.catch(() => {});
      return operation;
    });
    journalReady = true;
  }
  const localSession = session.fromPartition('nyqvra-memory');
  if (!localSession.protocol.isProtocolHandled || !(await localSession.protocol.isProtocolHandled('nyqvra'))) {
    localSession.protocol.handle('nyqvra', async request => {
      const resource = resourcePath(request.url, inventory);
      if (!resource || request.method !== 'GET') return new Response('', { status: 404 });
      try {
        return new Response(await readFile(path.join(__dirname, 'app', resource)), {
          headers: { 'Content-Type': types[path.extname(resource)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' },
        });
      } catch { return new Response('', { status: 404 }); }
    });
    localSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*', 'file://*/*'] }, (_details, callback) => callback({ cancel: true }));
    localSession.setPermissionRequestHandler((contents, permission, callback) => {
      callback(false);
    });
    localSession.setPermissionCheckHandler(() => false);
    localSession.on('will-download', event => event.preventDefault());
  }
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 800, minHeight: 620,
    title: 'NYQVRA', backgroundColor: '#121015', show: false,
    icon: path.join(__dirname, 'icon.ico'), autoHideMenuBar: true,
    webPreferences: { session: localSession, preload: path.join(__dirname, 'preload.cjs'), sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, devTools: !app.isPackaged, spellcheck: false },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (externalAllowed(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (isLocal(url)) return;
    event.preventDefault();
    if (externalAllowed(url)) void shell.openExternal(url);
  });
  win.webContents.on('will-attach-webview', event => event.preventDefault());
  await win.loadURL(`${ORIGIN}/index.html`);
  if (show) win.show();
  return win;
}

module.exports = { createWindow };
if (require.main === module) {
  if (!app.requestSingleInstanceLock()) app.quit();
  else {
    app.on('second-instance', () => { if (window) { if (window.isMinimized()) window.restore(); window.focus(); } });
    app.whenReady().then(async () => { Menu.setApplicationMenu(null); window = await createWindow(); });
    app.on('window-all-closed', () => app.quit());
  }
}
