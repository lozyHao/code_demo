// declare function importScripts(...scripts: string[]): void;
// importScripts('/')  只能导入 (() => {})() 格式的函数

// worker.ts
self.onmessage = (event) => {
	const { data, currentFiles, callbackId } = event.data;
	console.log(data, currentFiles)
	const result = processFiles(data, currentFiles);
	postMessage({ result, callbackId });
};


const processFiles = (list: File[], files: any[]) => {
	let str = '加载完成';
	let arrList = []
	for (let i = 0; i < list.length; i++) {
		// 校验文件类型是否是图片
		const reg = /image\//;
		if (!reg.test(list[i].type)) {
			str = "文件类型错误";
			continue;
		}

		const index = files.findIndex(file => file.name === list[i].name && file.size === list[i].size);
		if (index > -1) {
			str = "文件重复";
			continue;
		}

		if (list[i].size > 20 * 1024 * 1024) {
			str = "文件大小不能超过 20MB";
			continue;
		}
		arrList.push(list[i]);
	}
	return {
		files: arrList,
		str
	};
};