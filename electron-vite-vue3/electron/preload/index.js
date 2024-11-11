// 预加载脚本
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	send: (channel, data) => {
		ipcRenderer.send(channel, data)
	},
	receive: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args))
	}
})

