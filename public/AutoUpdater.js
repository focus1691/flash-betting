const { AppImageUpdater, MacUpdater, NsisUpdater } = require('electron-updater');
const log = require('electron-log');
// Or MacUpdater, AppImageUpdater

export default class AppUpdater {
  constructor() {
    let autoUpdater;
    const options = {
      requestHeaders: {
        // Any request headers to include here
        Authorization: 'Basic AUTH_CREDS_VALUE'
      },
      provider: 'generic',
      url: 'https://example.com/auto-updates'
    }

    if (process.platform === "win32") {
      autoUpdater = new NsisUpdater(options);
    }
    else if (process.platform === "darwin") {
      autoUpdater = new MacUpdater(options);
    }
    else {
      autoUpdater = new AppImageUpdater(options);
    }

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';

    autoUpdater.checkForUpdatesAndNotify();
  }
}