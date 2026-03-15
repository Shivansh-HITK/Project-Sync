const { app, BrowserWindow, ipcMain, desktopCapturer, clipboard } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const clipboardWatcher = require('electron-clipboard-watcher');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
  });

  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();

  // Clipboard Watcher
  clipboardWatcher({
    watchDelay: 1000,
    onTextChange: (text) => {
      if (mainWindow) {
        mainWindow.webContents.send('clipboard-changed', text);
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for screenshot capture
ipcMain.handle('capture-screen', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });
  return sources[0].thumbnail.toDataURL();
});

// IPC for clipboard write
ipcMain.on('write-clipboard', (event, text) => {
  clipboard.writeText(text);
});
