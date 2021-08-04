//* Dependencies
require('dotenv').config();

//* Electron
const electron = require('electron');

const electronApp = electron.app;
electronApp.commandLine.appendSwitch('high-dpi-support', 1)
electronApp.commandLine.appendSwitch('force-device-scale-factor', 1)

const { BrowserWindow } = electron;
// const { BrowserWindow } = remote;
let mainWindow;

require('../server');

function createWindow() {
  const screenSize = electron.screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL(`file:///${__dirname}/navigation-index.html`);
  // mainWindow.removeMenu();
  // mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

electronApp.on('ready', createWindow);

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit();
  }
});

electronApp.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
