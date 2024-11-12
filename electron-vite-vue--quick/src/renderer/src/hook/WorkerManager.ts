// WorkerManager
class WorkerManager {
  workers: { [workerName: string]: Worker };
  callbacks: { [key: string]: (result: any) => void } = {};

  constructor() {
    this.workers = {};
  }

  createWorker(workerName: string, MyWorker: any) {
    console.log(workerName, MyWorker);
    const worker = new MyWorker();
    console.log("worker", worker);
    worker.onmessage = (event) => {
      console.log("worker接受的数据2", event.data);
      if (event.data.callbackId && this.callbacks[event.data.callbackId]) {
        this.callbacks[event.data.callbackId](event.data.result);
      }
    };

    worker.onerror = (error) => {
      console.error(`Error in ${workerName}:`, error);
    };

    this.workers[workerName] = worker;
    return worker;
  }

  postMessage(
    workerName: string,
    message: any,
    callback: (result: any) => void,
  ) {
    const worker = this.workers[workerName];
    const callbackId = Math.random().toString(36).slice(2);
    console.log("worker发送的数据", message);
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

  delete(workerName: string) {
    // delete this.callbacks[event.data.callbackId]; // 执行完毕后删除回调函数
    // 结束后，删除该 worker
    this.terminateWorker(workerName);
  }
}

export default WorkerManager;
