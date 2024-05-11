const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron/main');

const ioHook = require('iohook') 
const robot = require('@jitsi/robotjs') 
const AutoClickers = []
var AutoClickerStarted = [false, false];

function setupRobot(clicker) {
    interval = 1000/clicker.CPS;
    if(clicker.CPS == 100){
        interval = 0;
    }
    robotInterval = setInterval(() => {
        if (!AutoClickerStarted) {
            clearInterval(robotInterval); 
            return;
        }
        if(clicker.HOTKEY == "left" || clicker.HOTKEY == "right" || clicker.HOTKEY == "middle"){
            robot.mouseClick(clicker.HOTKEY);
        } else {
            robot.keyTap(clicker.HOTKEY);
        }
    }, interval); 
}

ioHook.on('keyup', (event) => {
    if(AutoClickers[0]){
        if(AutoClickers[0].KEY == event.rawcode){ 
            AutoClickerStarted[0] = AutoClickerStarted[0] ? false : true;
            if(AutoClickerStarted[0]){
                setupRobot(AutoClickers[0])
            }
        }
    }
    if(AutoClickers[1]){
        if(AutoClickers[1].KEY == event.rawcode){
            AutoClickerStarted[1] = AutoClickerStarted[1] ? false : true;
            if(AutoClickerStarted[1]){
                setupRobot(AutoClickers[1])
            }
        }
    }
})


ioHook.on('mouseup', (event) => {
    console.log(event)
    if(AutoClickers[0]){
        if(AutoClickers[0].KEY == event.button){
            AutoClickerStarted[0] = AutoClickerStarted[0] ? false : true;
            if(AutoClickerStarted[0]){
                setupRobot(AutoClickers[0])
            }
        }
    }
    if(AutoClickers[1]){
        if(AutoClickers[1].KEY == event.button){
            AutoClickerStarted[1] = AutoClickerStarted[1] ? false : true;
            if(AutoClickerStarted[1]){
                setupRobot(AutoClickers[1])
            }
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log(path.join(__dirname, 'preload.js'))