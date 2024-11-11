import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron'
import { join, basename } from 'path'
import { promises as fs } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 注册自定义协议方案
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-yuanshan',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      standard: true,
      bypassCSP: true,
      stream: true
    }
  }
])

// 获取应用的安装目录路径
const appPath = app.getPath('appData') // 或者使用 'userData'，取决于您的需求
const tempDir = join(appPath, 'yuanshan/temp')

// 确保临时目录存在
;(async () => {
  await fs.mkdir(tempDir, { recursive: true })
})()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false // 允许跨域
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //   启用自定义协议
  protocol.handle('local-yuanshan', async (request) => {
    // 解码 URL
    console.log('request.url', request.url)
    const decodedUrl = decodeURIComponent(
      request.url
        .replace(new RegExp('^local-yuanshan://', 'i'), '')
        .replace(/^([a-z]):?\/?/i, (match) => {
          const letter = match.charAt(0).toUpperCase() + ':'
          return `${letter}/`
        })
    )
    console.log('decodedUrl:', decodedUrl)

    // 拼接完整的文件路径
    const fullPath = process.platform === 'win32' ? join(decodedUrl) : decodedUrl
    console.log('fullPath:', fullPath)

    // 读取文件
    const data = await fs.readFile(fullPath)
    console.log('data:', data)

    // 返回文件
    return new Response(data)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// 监听渲染进程发送的上传文件请求
ipcMain.on('upload-files', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  })

  if (canceled) {
    event.reply('upload-files', { success: false, message: 'No files were selected' })
    return
  }

  try {
    const uploadedFiles = await Promise.all(
      filePaths.map(async (srcPath) => {
        const fileName = basename(srcPath)
        const destPath = join(tempDir, fileName)
        await fs.copyFile(srcPath, destPath)
        return destPath
      })
    )

    event.reply('upload-files', { success: true, files: uploadedFiles })
  } catch (error: any) {
    event.reply('upload-files', { success: false, message: error.message })
  }
})
