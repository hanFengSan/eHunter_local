import {
    app,
    BrowserWindow,
    ipcMain,
    shell
} from 'electron'

import {
    AlbumDirSorter
} from './service/AlbumDirSorter.ts'

import {
    AlbumServiceImpl
} from './service/AlbumServiceImpl.ts'

import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000,
        minWidth: 400,
        minHeight: 300,
        webPreferences: {
            webSecurity: false
        }
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Hook new window, and open url in Browser
    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('SELECT_ALBUM_DIR', async (event, path) => {
    try {
        let fileItems = await (new AlbumDirSorter(path)).sort();
        let albumServiceImpl = new AlbumServiceImpl();
        await albumServiceImpl.parseFileItems(path, fileItems);
        event.sender.send('ALBUM_DATA', albumServiceImpl);
    } catch (err) {
        event.sender.send('ERROR', err.message);
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
