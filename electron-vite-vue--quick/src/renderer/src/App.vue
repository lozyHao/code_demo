<script setup lang="ts">
import { ref } from "vue";
import WorkerManager from "@renderer/hook/WorkerManager";

import myWorker from "@renderer/hook/worker.ts?worker";

const onChangeFile = () => {
	window.electron.ipcRenderer.send("upload-files");
};
const image = ref<string>("");

window.electron?.ipcRenderer.on("upload-files", ($event, response) => {
	console.log($event);
	if (response.success) {
		console.log("Files uploaded successfully:", response.files[0]);
		image.value = response.files[0];
	} else {
		console.error("Upload failed:", response.message);
	}
});

const _imageData = ref<File[]>([]);

const chooseFileWorker = (e: Event) => {
	const fss: FileList | null = (e.target as HTMLInputElement).files;
	const files: File[] = fss ? Array.from(fss) : [];
	const currentFiles: File[] = [];
	console.log("files", files);

	const worker = new WorkerManager();
	console.log(import.meta.url);
	worker.createWorker("addFiles", myWorker);
	worker.postMessage(
		"addFiles",
		{ allList: [...currentFiles], chooseList: [...files] },
		(message: {
			str: string;
			list: { name: string; size: number; type: string }[];
		}) => {
			const { list, str } = message;
			console.log("上传的文件", message, str);

			if (list && list.length > 0) {
				list.forEach((file: { name: string; size: number; type: string }) => {
					const c: File = files?.find((f) => f.name === file.name) as File;
					_imageData.value.push(c);
				});
			}
			console.log("上传的文件合计", _imageData.value);
		},
	);
};
</script>

<template>
	<div class="actions">
		<button @click="onChangeFile">选择文件</button>
		<img :src="'local-yuanshan://' + image" style="width: 100px; height: 100px" />
	</div>
	<div>
		<input id="" type="file" name="" @change="chooseFileWorker" />
	</div>
	<div>
		<img v-for="(image, index) in _imageData" :key="index" :src="'local-yuanshan://' + image.path"
			style="width: 100px; height: 100px" />
	</div>
</template>
