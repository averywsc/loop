const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs/promises');
const path = require('path');

function createWindow() {
  const w = new BrowserWindow({
    width: 1100, height: 680, minWidth: 840, minHeight: 520,
    backgroundColor: '#1c1c1e', autoHideMenuBar: true, title: 'Loop',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  w.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length || createWindow());
});
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

ipcMain.handle('open', async () => {
  const r = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'opus'] }]
  });
  if (r.canceled) return null;
  const p = r.filePaths[0];
  return { name: path.basename(p), data: await fs.readFile(p) };
});
