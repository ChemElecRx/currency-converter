const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Ensure this is set to true
      enableRemoteModule: false, // Depending on your application's needs
      //nodeIntegration: false // Depending on your application's needs
      // Example Content Security Policy
      // Adjust according to your application's needs
      // sandbox: true,
      // security: 'sandbox',
      // webSecurity: true,
      // allowRunningInsecureContent: false,
      // experimentalFeatures: false,
      // disableBlinkFeatures: 'Auxclick',
      // safeDialogs: true,
      // safeDialogsMessage: 'Safe',
      // contextIsolation: true,
      // disableHtmlFullscreenWindowResize: false
    }
  });

  mainWindow.loadFile('index.html');

  // Example: Handle toggleConversion message from renderer process
  ipcMain.on('toggleConversion', (event, arg) => {
    mainWindow.webContents.send('toggleConversion');
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
