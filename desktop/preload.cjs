'use strict';
const { contextBridge, ipcRenderer } = require('electron');
async function call(action, value) {
  const result = await ipcRenderer.invoke('nyqvra:journal', { action, value });
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
contextBridge.exposeInMainWorld('nyqvraDesktop', Object.freeze({
  list: () => call('list'),
  save: entry => call('save', entry),
  reveal: id => call('reveal', id),
  copy: id => call('copy', id),
  writeText: text => call('copyText', text),
  remove: id => call('remove', id),
}));
