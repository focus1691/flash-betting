const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config({ path: `${__dirname}/.env`});

dotenvExpand(config);

//* Electron
const electron = require('electron');

const { app } = electron;
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);

const { BrowserWindow } = electron;
let mainWindow;

require('../server');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('ready', createWindow);

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
}

function createWindow() {
  const screenSize = electron.screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    minWidth: screenSize.width * 0.80,
    minHeight: screenSize.height * 0.80,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL(`file:///${__dirname}/navigation-index.html`);
  mainWindow.removeMenu();
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}