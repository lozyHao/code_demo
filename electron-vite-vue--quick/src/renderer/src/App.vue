<script setup lang="ts">
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const onChangeFile = () => {
	window.electron.ipcRenderer.send('upload-files')
}
const image = ref<string>('')

window.electron.ipcRenderer.on('upload-files', ($event, response) => {
	console.log($event)
	if (response.success) {
		console.log('Files uploaded successfully:', response.files[0])
		image.value = response.files[0]
	} else {
		console.error('Upload failed:', response.message)
	}
})
</script>

<template>
	<img alt="logo" class="logo" src="./assets/electron.svg" />
	<div class="creator">Powered by electron-vite</div>
	<div class="text">
		Build an Electron app with
		<span class="vue">Vue</span>
		and
		<span class="ts">TypeScript</span>
	</div>
	<p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
	<div class="actions">
		<div class="action">
			<a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
		</div>
		<div class="action">
			<a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
		</div>
		<button @click="onChangeFile">选择文件</button>
		<img :src="'local-yuanshan://' + image" style="width: 100px; height: 100px" />
	</div>
	<Versions />
</template>
