const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  writeClipboard: (text) => ipcRenderer.send('write-clipboard', text),
  onClipboardChanged: (callback) => ipcRenderer.on('clipboard-changed', (event, text) => callback(text)),
});
