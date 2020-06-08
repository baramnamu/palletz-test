import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path'
import * as url from 'url'

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isQa = process.env.NODE_ENV === 'qa';

let win: BrowserWindow | null;

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
        console.log("is Development");
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
        win.loadURL(`http://localhost:2003/#/login`)
    } else {
        console.log("is not Development");
        win.loadURL(
          url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
          }) + '#/login'
        )
    }
}