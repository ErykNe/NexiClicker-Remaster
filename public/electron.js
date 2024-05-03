const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
//to run, use npm run start-electron
//if localhost glitches, type npm start and then npm run start-electron
function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Nexi Clicker Remaster',
        icon: ".//src/resources/icons/favicon.ico",
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL(startUrl);
    win.setResizable(false)
    win.setMenuBarVisibility(false)
   
    win.setMenuBarVisibility(true) //hide if unecceseary
    win.webContents.openDevTools()
    win.setResizable(true)
    
  
    win.webContents.on('context-menu', (event, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: 'Reload',
        click: () => win.reload(),
      }
    ]);
    menu.popup();
    });
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});