import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path'
import * as url from 'url'
import { registerHandler, registerListener } from 'pzsc/dist/main'
import { registerFingerListener } from 'pzfinger/dist/finger'
import registerHSMHandler from './hsm'
import { registerDiskListener } from 'pzburn/dist/disk'
import { exec } from 'child_process'

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
// const isQa = process.env.NODE_ENV === 'qa';

let win: BrowserWindow | null;  // Chromium 윈도우

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
    return Promise.all(
      extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log)
};

const createWindow = async () => {
  
  if (isDevelopment) {
    await installExtensions()
  }

  win = new BrowserWindow({
      width: 1024,
      height: 800,
      alwaysOnTop: !isDevelopment,
      fullscreen: !isDevelopment,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true
      }
  });

  win.setMenu(null);

  if (isDevelopment) {
      process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
      win.loadURL(`http://localhost:2003/#/login`)
  } else {
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true
        }) + '#/login'
      )
  }

  if (!isProduction) {
    /* Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
       webContents is an EventEmitter.  It is responsible for rendering and controlling a web page. */
    win.webContents.once('dom-ready', () => {
      win!.webContents.openDevTools()
    })
  }

  // Disable new window
  win.webContents.on('new-window', (e, url) => {
    console.log(`Try to open ${url}`)
    e.preventDefault()
  });

  win.on('closed', () => (win = null));
  
  // Register other devices only if HSM is ready.
  registerHSMHandler(win!.webContents, isDevelopment)       // HSM Handler
  registerListener(ipcMain, win!.webContents)               // Smart Card Listener
  registerFingerListener(ipcMain, win!.webContents)         // Fingerprint Listener
  registerDiskListener(ipcMain, win!.webContents)           // CD writer Listener로 보이는데 현재 사용하지 않는다고 함.

  ipcMain.on('shutdown-palletz',  async (_, channel) => {
    exec('shutdown /s /t 0', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        win!.webContents.send(channel, err)
        return
      }
    })
  })

  ipcMain.on('restart-palletz',  async (_, channel) => {
    exec('shutdown /r /t 0', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        win!.webContents.send(channel, err)
        return
      }
    })
  })

}

const singleInstanceLock = app.requestSingleInstanceLock();

if (!singleInstanceLock && isProduction) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })

  registerHandler();    // Smart Card Handler

  app.on('ready', createWindow)
    .on('window-all-closed', () => process.platform !== 'darwin' && app.quit()) // 'darwin'은 MacOS를 말한다. MacOS일 경우는 종료(app.quit())시키지 않는다.
    .on('activate', () => win === null && createWindow());                      // 창이 활성화되었을 때 NULL이면 다시 createWindow()를 실행시킨다.
}
