const { app, BrowserWindow, screen, Menu } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 900, minHeight: 600,
    backgroundColor: '#0f1115', title: 'Stage Soundboard', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, backgroundThrottling: false },
  });
  // The projector window opens on the second screen if there is one.
  win.webContents.setWindowOpenHandler(() => {
    const primary = screen.getPrimaryDisplay();
    const other = screen.getAllDisplays().find(d => d.id !== primary.id);
    const area = (other || primary).workArea;
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        x: area.x + 40, y: area.y + 40, width: Math.min(1280, area.width - 80), height: Math.min(720, area.height - 80),
        backgroundColor: '#000000', autoHideMenuBar: true, title: 'Stage Output',
        webPreferences: { backgroundThrottling: false },
      },
    };
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
}

if (process.platform === 'darwin') {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }]));
} else {
  Menu.setApplicationMenu(null);
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => app.quit());
