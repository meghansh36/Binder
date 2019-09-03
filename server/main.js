const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path")
const url = require('url')

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    })
    
    win.loadURL(
        url.format({
          pathname: path.join(__dirname, `../dist/foxbat/index.html`),
          protocol: "file:",
          slashes: true
        })
      );

    win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

}

app.on('ready', createWindow);
 ////////////////////////////////////////


ipcMain.on('get-system-files', (event, arg) => {

  // get file data here

  //event.reply('return-system-files', 'success', 'second')
})