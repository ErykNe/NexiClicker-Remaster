const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron/main');

const ioHook = require('iohook'); //global key listener
const robot = require('@jitsi/robotjs') //robot for the autoclicker
const AutoClickers = []


ioHook.on('keydown', (event) => {
    console.log(event)
    if(AutoClickers[0]){
        if(AutoClickers[0].KEY == event.rawcode){
            console.log("Bind Clicked")
        }
    }
    if(AutoClickers[1]){
        if(AutoClickers[1].KEY == event.rawcode){
            console.log("Bind Clicked")
        }
    }
})

ioHook.on('mousedown', (event) => {
    console.log(event)
    if(AutoClickers[0]){
        if(AutoClickers[0].KEY == event.button){
            console.log("Bind Clicked")
        }
    }
    if(AutoClickers[1]){
        if(AutoClickers[1].KEY == event.button){
            console.log("Bind Clicked")
        }
    }
})

ipcMain.on('submit::autoclicker', (event, args) => {
    AutoClickers[args.TAG_NUMBER] = args
    console.log(AutoClickers)
    ioHook.start()
});


ipcMain.on('autoclicker::shutdown', (event, args) => {
    try{
        const index = AutoClickers.findIndex(elem => elem.TAG_NUMBER == args.TAG_NUMBER);
        if(AutoClickers[index]){
            AutoClickers[index] = undefined
        }
        if(!AutoClickers[0] && !AutoClickers[1]){
            ioHook.stop()
        }
    } catch {
        ioHook.stop()
    }
});

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:'
    });
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Nexi Clicker Remaster',
        icon: ".//src/resources/icons/favicon.ico",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    win.loadURL('http://localhost:3000');
    win.setResizable(false)
    win.setMenuBarVisibility(false)
   
    win.setMenuBarVisibility(true) //hide if unecceseary
    win.webContents.openDevTools()
    win.setResizable(true)
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

console.log(path.join(__dirname, 'preload.js'))