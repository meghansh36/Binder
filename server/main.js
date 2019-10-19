const { app, BrowserWindow, ipcMain, shell, dialog, Notification } = require('electron')
const path = require("path")
const url = require('url')
const systemHandler = require('./systemHandler');
const googleLoginHandler = require('./googleLoginHandler');
const driveHandler = require('./driveHandler');
const puppeteer = require('puppeteer')
const fs = require('fs')
const os = require('os');
let browser;


async function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        devTools: true
    }
  })
  
  win.maximize()
  let L0 = './node_modules/puppeteer/.local-chromium';
  let L1 = path.join(L0, fs.readdirSync(L0)[0]);
  let L2 = path.join(L1, fs.readdirSync(L1)[0]);

  switch(process.platform){
    case 'win32': browser = await puppeteer.launch({executablePath: `${L2}/chrome.exe`}); break;
    case 'linux': browser = await puppeteer.launch({executablePath: `${L2}/chrome`}); break;
    case 'darwin': browser = await puppeteer.launch({executablePath: `${L2}/Chromium.app`}); break;
    default: throw new Error('platform not supported');
  }
    
  win.loadURL(
      url.format({
        pathname: path.join(__dirname, `../dist/foxbat/index.html`),
        protocol: "file:",
        slashes: true
      })
    );

  win.webContents.openDevTools()
  win.on('closed', async () => {
    win = null
    await browser.close();
  })

}

app.on('ready', createWindow);
 ////////////////////////////////////////


 
ipcMain.on('get-system-files', (event, arg) => {
  console.log("finding files", __dirname);
  let data = systemHandler.findFiles();
  event.reply('return-system-files', data)
})

ipcMain.on('get-preview', async (event, filePath, uniqueChannel) => {

  try {
    let buffer = await systemHandler.getPreview(filePath, browser);
    event.reply(uniqueChannel, buffer);
  } catch (error) {
    console.log(error)
  }  
})

ipcMain.on('openSysFile', (event, filePath) => {
  shell.openItem(filePath);
})

ipcMain.on('showSysFile', (event, filePath) => {
  shell.showItemInFolder(filePath);
})

ipcMain.on('deleteSysFile', async (event, filePath, uniqueChannel) => {
  try {
    await systemHandler.deleteFile(filePath);
    event.reply(`${uniqueChannel}-success`)
  } catch (error) {
    console.log("sending failure")
    event.reply(`${uniqueChannel}-failure`)
  }
})

ipcMain.on('renameSysFile', (event, filePath, newName) => {
  try {
    let newPath = filePath.slice(0, filePath.lastIndexOf(path.sep)+1) + newName
    fs.renameSync(filePath, newPath);
    event.returnValue = {path: newPath, success: true}
  } catch (error) {
    event.returnValue = {path: filePath, success: false}
  }
})

ipcMain.on('check-google-login', async (event) => {
  let isLoggedIn = await googleLoginHandler.checkLogin().catch(e => {
    console.log(e);
    event.returnValue = false;
  });

  await googleLoginHandler.checkAndGenerateToken().catch(e => {
    console.log(e);
    event.returnValue = false;
  })

  event.returnValue = true;
})

ipcMain.on('google-drive-login', async (event) => {
  try {
    await googleLoginHandler.login();
    event.reply('google-login-response', true)
  } catch (error) {
    console.log('login failed');
    event.reply('google-login-response', false)

  }
})

ipcMain.on('fetch-drive-files', async (event) => {
  try {
    let files = await driveHandler.getDriveFiles();
    event.reply('fetch-drive-files-response-success', files);
  } catch (error) {
    console.log(error);
    event.reply('fetch-drive-files-response-failure');
  }
})

ipcMain.on('fetch-drive-preview', async (event, url, uniqueChannel) => {
  try {
    let preview = await driveHandler.fetchPreview(url);
    event.reply(uniqueChannel, preview.data);
  } catch (error) {
    console.log(error);
  }
})

ipcMain.on('open-drive-file', async (event, url) => {
  try {
    shell.openExternal(url);
  } catch (error) {
    console.log(error);
  }
})

ipcMain.on('rename-drive-file', async (event, id, newName) => {
  try {
    await driveHandler.rename(id, newName);
    event.reply('rename-drive-file-success', true)
  } catch (error) {
    console.log(error);
    event.reply('rename-drive-file-failure', false)
  }
})

ipcMain.on('delete-drive-file', async (event, id) => {
  try {
    await driveHandler.deleteFile(id);
    event.reply('delete-drive-file-success', true)
  } catch (error) {
    console.log(error);
    event.reply('delete-drive-file-failure', false)
  }
})

ipcMain.on('download-drive-file', async (event, exportLink, fileName, mimeType, downloadAs) => {
  try {
    let defaultPath = `${os.homedir()}${path.sep}Downloads`;
    if(mimeType === 'application/vnd.google-apps.document') {

      if(downloadAs === 'word') {
        fileName += '.docx'
        defaultPath = defaultPath + `${path.sep}${fileName}`
      }
      else if(downloadAs === 'pdf') {
        fileName += '.pdf'
        defaultPath = defaultPath + `${path.sep}${fileName}`
      }
        
    } else {
      defaultPath = defaultPath + `${path.sep}${fileName}`
    }


    let filePath = dialog.showSaveDialogSync({
      defaultPath: defaultPath
    })

    if( filePath) {
      let notification = new Notification({
        title: 'Starting File Download',
      })

      notification.show();
      let fileData = await driveHandler.downloadFile(exportLink,filePath, browser);
      fs.writeFileSync(filePath, fileData, {encoding: null});

      console.log('file written successfully')

      notification = new Notification({
        title: 'File Downloaded Successfully',
        body: `The file ${fileName} has been downloaded successfully`
      })

      notification.show();
      notification.on('click', (e) => {
        shell.showItemInFolder(filePath);
      });
    } else {
      throw 'User cancelled'
    }
  } catch(e) {
    let notification = new Notification({
      title: 'Error',
      body: `An unexpected error occured in downloading ${fileName}`
    })

    notification.show();
    console.log(e);
  }
})
