export default class Semaphore {
	private permits: number;
	private promiseResolverQueue: Array<(v: boolean) => void> = [];

	constructor(permits: number) {
		this.permits = permits;
	}

	public getPermits(): number {
		return this.permits;
	}

	public async wait(): Promise<boolean> {
		if (this.permits > 0) {
			this.permits -= 1;
			return Promise.resolve(true);
		}
		return new Promise<boolean>(resolver => this.promiseResolverQueue.push(resolver));
	}

	public async acquire(): Promise<boolean> {
		return this.wait();
	}

	public async waitFor(milliseconds: number): Promise<boolean> {
		if (this.permits > 0) {
			this.permits -= 1;
			return Promise.resolve(true);
		}

		let resolver: (v: boolean) => void = b => void 0;
		const promise = new Promise<boolean>(r => {
			resolver = r;
		});

		this.promiseResolverQueue.push(resolver);

		setTimeout(() => {
			const index = this.promiseResolverQueue.indexOf(resolver);
			if (index !== -1) {
				this.promiseResolverQueue.splice(index, 1);
			} else {
				console.warn(`Semaphore.waitFor couldn't find its promise resolver in the queue`);
			}

			resolver(false);
		}, milliseconds);

		return promise;
	}

	public tryAcquire(): boolean {
		if (this.permits > 0) {
			this.permits -= 1;
			return true;
		}

		return false;
	}

	public drainPermits(): number {
		if (this.permits > 0) {
			const permitCount = this.permits;
			this.permits = 0;
			return permitCount;
		}

		return 0;
	}

	public signal(): void {
		this.permits += 1;

		if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
			console.warn('Semaphore.permits should never be > 0 when there is someone waiting.');
		} else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
			this.permits -= 1;

			const nextResolver = this.promiseResolverQueue.shift();
			if (nextResolver) {
				nextResolver(true);
			}
		}
	}

	public release(): void {
		this.signal();
	}

	public async execute<T>(func: () => T | PromiseLike<T>): Promise<T> {
		await this.wait();
		try {
			return await func();
		} finally {
			this.signal();
		}
	}
}