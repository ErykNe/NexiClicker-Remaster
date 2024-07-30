const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron/main');
const { ipcRenderer } = require("electron/main");

const ioHook = require('iohook') 
const robot = require('@jitsi/robotjs') 
const { isWindowFullscreen } = require('./utils/fs');
const fs = require('fs')
var win = null;
var overlaywin = null;

var AutoClickers = []
var AutoClickersData = []
var AutoClickerStarted = [];
var robotInterval = [null, null];
var FullScreenEnabled = false;
var FSInterval = null;
function setupRobot(clicker, intervalIndex) {
    var interval = 1000/clicker.CPS;
    if(clicker.CPS > 80){
        interval = 0;
    } else if (clicker.CPS == 0){
        return;
    } else if (clicker.HOTKEY == undefined){
        return;
    } else if (clicker.KEY == undefined) {
        return;
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
        }
    }
    if(overlaywin != null){
        overlaywin.webContents.send('overlay::autoclicker_enabled_change', AutoClickerStarted);
    }
})


ioHook.on('mouseup', (event) => {
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
    if(overlaywin != null){
        overlaywin.webContents.send('overlay::autoclicker_enabled_change', AutoClickerStarted);
    }
})

ipcMain.on('submit::autoclicker', (event, args) => {
    AutoClickers[args.TAG_NUMBER] = args
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
   
        if(AutoClickers[args.TAG_NUMBER]){
            AutoClickers[args.TAG_NUMBER] = undefined
        }
        if(!AutoClickers[0] && !AutoClickers[1]){
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
                return;
              }
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

ipcMain.on('autoclicker::save_settings', () => {


        const AutoClickerData = JSON.stringify(AutoClickersData);
        fs.writeFileSync(path.join(__dirname, '/settings/settings.json'), AutoClickerData, (error) => {
            if(error){
                throw error;
            }
        })

})

ipcMain.on('autoclicker::load_settings', (event) => {
    fs.readFile(path.join(__dirname, '/settings/settings.json'), (error, data) => {
        if (error) {
          throw err;
        }
        try {
        const userSettings = JSON.parse(data);

        win.webContents.send('autoclicker::send_settings', userSettings);
        } catch { return }
      });
})

ipcMain.on('autoclicker::reset_settings', (event) => {
    fs.writeFileSync(path.join(__dirname, '/settings/settings.json'), JSON.stringify([{HOTKEY:"undefined",KEY:"undefined",CPS:0,TAG_NUMBER:0,HOTKEY_ID:"undefined",KEY_ID:0},{HOTKEY:"undefined",KEY:"undefined",CPS:0,TAG_NUMBER:1,HOTKEY_ID:undefined,KEY_ID:0}]), (error) => {
        if(error){
            throw error;
        }
    })
    AutoClickers = []
    AutoClickersData = []
    AutoClickerStarted = [];
    robotInterval = [null, null];
    FullScreenEnabled = false;
    FSInterval = null;
    win.webContents.send('autoclicker::require_load_settings', AutoClickersData)
    win.webContents.reload()
})

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
            focusable: false,
            
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            }
        })
        overlaywin.setBounds({
            x: bounds.x, 
            y: bounds.y, 
            width: 150,
            height: 280
          });
        overlaywin.loadFile(path.join(__dirname, '/overlay/index.html'))

    
        overlaywin.once('ready-to-show', () => {
            overlaywin.show();
            sendData()
        });

  
        overlaywin.setAlwaysOnTop(true, 'screen-saver');


        overlaywin.setSkipTaskbar(true);
        overlaywin.setIgnoreMouseEvents(true);


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

    win.webContents.on('did-finish-load', ()=> {
        if(fs.existsSync(path.join(__dirname, '/settings/settings.json'))){
            win.webContents.send('autoclicker::require_load_settings', AutoClickersData)
        } 
    })
    
    win.webContents.on('will-navigate', (event) => {
        event.preventDefault();
      });
    
      win.webContents.on('before-unload', (event) => {
        event.preventDefault();
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
})
ipcMain.on('autoclicker::exit', (event) => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

