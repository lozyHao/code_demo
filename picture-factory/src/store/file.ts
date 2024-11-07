// file.ts
import { defineStore } from "pinia";
import FileData from "../hooks/FileData";
import WorkerManager from "../hooks/WorkerManager";

import { ref } from "vue";

const useFileStore = defineStore("file", () => {
	const files = ref<FileData[]>([]);
	const index = ref<number>(0)
	const loading = ref<boolean>(false)

	const addFiles = async (list: File[]): Promise<string> => {
		loading.value = true
		return await new Promise((resolve) => {
			const worker = new WorkerManager();
			worker.createWorker("addFiles", new URL("../hooks/worker.ts", import.meta.url).href);
			worker.postMessage("addFiles", { data: list, currentFiles: [...files.value.map(item => item.file)] }, (message: any) => {
				console.log("接收到的数据", message);
				message.files.forEach((file: File) => {
					files.value.push(new FileData(file))
				})
				loading.value = false
				resolve(message.str);
			});
		})
	};



	const setIndex = (i: number) => {
		index.value = i
	}

	return {
		files,
		index,
		loading,
		addFiles,
		setIndex
	};
});

export default useFileStore;