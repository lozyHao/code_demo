const { app, BrowserWindow } = require('electron')
const path = require('path')

// 禁用安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建窗口
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		title: "LozyHao",
		icon: path.join(__dirname, '../public/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, './preload/index.js'),
		},
	})

	const url = process.env.VITE_DEV_SERVER_URL
	if (url) {
		win.loadURL(url)
		// 打开开发者工具
		win.webContents.openDevTools()
	} else {
		win.loadFile(path.join(__dirname, '../dist/index.html'))
	}
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})