// WorkerManager.ts
class WorkerManager {
	workers: { [workerName: string]: Worker };
	callbacks: { [key: string]: Function } = {};

	constructor() {
		this.workers = {};
	}

	createWorker(workerName: string, workerScript: any) {
		const worker = new workerScript();
		worker.onmessage = (event) => {
			if (event.data.callbackId) {
				this.callbacks[event.data.callbackId] && this.callbacks[event.data.callbackId](event.data.result);
				delete this.callbacks[event.data.callbackId]; // 执行完毕后删除回调函数
			}
		};

		worker.onerror = (error) => {
			console.error(`Error in ${workerName}:`, error);
		};

		this.workers[workerName] = worker;
		return worker;
	}

	postMessage(workerName: string, message: any, callback: Function) {
		const worker = this.workers[workerName];
		const callbackId = workerName;

		if (worker && callback) {
			this.callbacks[callbackId] = callback;
			worker.postMessage({ ...message, callbackId });
		}
	}

	terminateWorker(workerName: string) {
		const worker = this.workers[workerName];
		if (worker) {
			worker.terminate();
			delete this.workers[workerName];
		}
	}
}

export default WorkerManager