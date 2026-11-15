const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', { open: () => ipcRenderer.invoke('open') });
