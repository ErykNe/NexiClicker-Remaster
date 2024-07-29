const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron/main');
const { ipcRenderer } = require("electron/main");

const ioHook = require('iohook') 
const robot = require('@jitsi/robotjs') 
const { isWindowFullscreen } = require('./utils/fs');
var win = null;
var overlaywin = null;

const AutoClickers = []
const AutoClickersData = []
var AutoClickerStarted = [false, false];
var robotInterval = [null, null];
var FullScreenEnabled = false;
var FSInterval = null;
var NotificationsEnabled = false;

function setupRobot(clicker, intervalIndex) {
    var interval = 1000/clicker.CPS;
    if(clicker.CPS == 100){
        interval = 0;
    }
    robotInterval[intervalIndex] = setInterval(() => {
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
                setupRobot(AutoClickers[0], 0)
            } else {
                clearInterval(robotInterval[0]); 
            }
            if(overlaywin != null){
                overlaywin.webContents.send('overlay::autoclicker_enabled_change', AutoClickerStarted);
            }
        }
    }
    if(AutoClickers[1]){
        if(AutoClickers[1].KEY == event.rawcode){
            AutoClickerStarted[1] = AutoClickerStarted[1] ? false : true;
            if(AutoClickerStarted[1]){
                setupRobot(AutoClickers[1], 1)
            } else {
                clearInterval(robotInterval[1]); 
            }
            if(overlaywin != null){
                overlaywin.webContents.send('overlay::autoclicker_enabled_change', AutoClickerStarted);
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
    if(overlaywin != null){
        overlaywin.webContents.send('overlay::data_enabled_change', [args.TAG_NUMBER, true]);
    }
});

ipcMain.on('update::autoclicker_data', (event, args) => {
    AutoClickersData[args.TAG_NUMBER]= args
    if(overlaywin != null){
        overlaywin.webContents.send('overlay::data', AutoClickersData);
    }
})

ipcMain.on('submit::autoclicker_data', (event, args) => {
    AutoClickersData[args.TAG_NUMBER] = args
})

ipcMain.on('autoclicker::shutdown', (event, args) => {
    try{
        const index = AutoClickers.findIndex(elem => elem.TAG_NUMBER == args.TAG_NUMBER);
        if(AutoClickers[index]){
            AutoClickers[index] = undefined
        }
        if(!AutoClickers[0] && !AutoClickers[1]){
            ioHook.stop()
            if(overlaywin != null){
                overlaywin.webContents.send('overlay::data_enabled_change', [args.TAG_NUMBER, false]);
            }
        }
    } catch {
        ioHook.stop()
        if(overlaywin != null){
            overlaywin.webContents.send('overlay::data_enabled_change', [args.TAG_NUMBER, false]);
        }
    }
});

ipcMain.on('settings::fullscreen', (event, args) => {
    FullScreenEnabled = args;
    if(FullScreenEnabled){
        FSInterval = setInterval(() => {
            isWindowFullscreen((error, result) => {
              if (error) {
                console.error(error);
                return;
              }
              //console.log(`Is there any fullscreen window: ${result.isFullscreen}`);
              //console.log(`Fullscreen Window is on: ${result.monitorInfo}`);
              if(result.isFullscreen){
                createOverlay(result.monitorInfo)
              } else if (overlaywin != null) {
                removeOverlay();
              }
            });
          }, 380);
    } else {
        clearInterval(FSInterval);
        var count = 0;
        l = setInterval(() => {
            try{
            removeOverlay();
            count++;
            if(count > 2){
                clearInterval(l);
            }
            } catch {
                clearInterval(l);
            }
        }, 420);
    }
});

function createOverlay(monitorInfo) {
    if(overlaywin == null){
        const displays = screen.getAllDisplays();
        const targetDisplay = displays[parseInt(monitorInfo[8]) - 1];
        const { bounds } = targetDisplay;
        if (!targetDisplay) {
            return;
          }
        
        overlaywin = new BrowserWindow({
            resizable: false,
            x: 0,
            y: 0,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            show: false,
            
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            }
        })
        overlaywin.setBounds({
            x: bounds.x, // x position relative to the monitor's top-left corner
            y: bounds.y, // y position relative to the monitor's top-left corner
            width: 150,
            height: 280
          });
        overlaywin.loadFile(path.join(__dirname, '/overlay/index.html'))

        // Show the window after loading the content
        overlaywin.once('ready-to-show', () => {
            overlaywin.show();
            sendData()
        });

        // Ensure the window stays on top of all other windows
        overlaywin.setAlwaysOnTop(true, 'screen-saver');

        // Optional: Hide the window from taskbar
        overlaywin.setSkipTaskbar(true);
        overlaywin.setIgnoreMouseEvents(true);

        // Optional: Set this if you need to maintain click-through mode even when the window is focused
        overlaywin.setIgnoreMouseEvents(true, { forward: true });
    }
}
function sendData(){
    overlaywin.webContents.send('overlay::data', AutoClickersData);
    overlaywin.webContents.send('overlay::autoclicker_enabled_change', AutoClickerStarted);
    if(AutoClickers[0]){
        overlaywin.webContents.send('overlay::data_enabled_change', [0, true]);
    } else {
        overlaywin.webContents.send('overlay::data_enabled_change', [0, false]);
    }
    if(AutoClickers[1]){
        overlaywin.webContents.send('overlay::data_enabled_change', [1, true]);
    } else {
        overlaywin.webContents.send('overlay::data_enabled_change', [1, false]);
    }
}
function removeOverlay(){
    overlaywin.destroy();
    overlaywin = null;
}


function createWindow() {
    win = new BrowserWindow({
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
    win.once("closed", () =>{
        if(overlaywin != null){
            overlaywin.destroy();
        }
        overlaywin == null;
    })
    
    //win.setMenuBarVisibility(true) //hide if unecceseary
    //win.webContents.openDevTools()
    //win.setResizable(true)
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