const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  toggleConversion: () => ipcRenderer.send('toggleConversion'),
  // Add more methods as needed
});


