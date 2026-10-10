/**
 * Worker Manager Utility
 * Provides advanced worker management capabilities including:
 * - Circular buffers for memory efficiency
 * - Throttling for performance
 * - Batch processing
 */

/**
 * Memory-efficient circular buffer for storing historical data
 */
export class CircularBuffer<T> {
	private buffer: T[];
	private maxSize: number;
	private currentIndex: number = 0;
	private size: number = 0;

	constructor(maxSize: number) {
		this.maxSize = maxSize;
		this.buffer = new Array(maxSize);
	}

	public push(item: T): void {
		this.buffer[this.currentIndex] = item;
		this.currentIndex = (this.currentIndex + 1) % this.maxSize;
		if (this.size < this.maxSize) {
			this.size++;
		}
	}

	public get(index: number): T | undefined {
		if (index < 0 || index >= this.size) return undefined;
		const actualIndex = (this.currentIndex - this.size + index + this.maxSize) % this.maxSize;
		return this.buffer[actualIndex];
	}

	public toArray(): T[] {
		const result: T[] = [];
		for (let i = 0; i < this.size; i++) {
			const item = this.get(i);
			if (item !== undefined) {
				result.push(item);
			}
		}
		return result;
	}

	public getSize(): number {
		return this.size;
	}

	public clear(): void {
		this.currentIndex = 0;
		this.size = 0;
		this.buffer = new Array(this.maxSize);
	}

	public getLatest(): T | undefined {
		if (this.size === 0) return undefined;
		return this.get(this.size - 1);
	}

	public getOldest(): T | undefined {
		if (this.size === 0) return undefined;
		return this.get(0);
	}
}

/**
 * Throttle function calls to prevent overwhelming the system
 */
export class Throttler {
	private lastCallTime: number = 0;
	private interval: number;
	private pendingCall: (() => void) | null = null;
	private timeoutId: NodeJS.Timeout | null = null;

	constructor(interval: number) {
		this.interval = interval;
	}

	public throttle(fn: () => void): void {
		const now = Date.now();
		const timeSinceLastCall = now - this.lastCallTime;

		if (timeSinceLastCall >= this.interval) {
			this.lastCallTime = now;
			fn();
		} else {
			this.pendingCall = fn;
			if (!this.timeoutId) {
				this.timeoutId = setTimeout(() => {
					this.timeoutId = null;
					if (this.pendingCall) {
						this.lastCallTime = Date.now();
						this.pendingCall();
						this.pendingCall = null;
					}
				}, this.interval - timeSinceLastCall);
			}
		}
	}

	public cancel(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		this.pendingCall = null;
	}
}

/**
 * Batch processor for handling multiple similar tasks efficiently
 */
export class BatchProcessor<T, R> {
	private batchQueue: { item: T; resolve: (value: R) => void; reject: (reason: any) => void }[] =
		[];
	private batchSize: number;
	private batchTimeout: number;
	private timeoutId: NodeJS.Timeout | null = null;
	private processFn: (batch: T[]) => Promise<R[]>;

	constructor(
		processFn: (batch: T[]) => Promise<R[]>,
		batchSize: number = 10,
		batchTimeout: number = 100
	) {
		this.processFn = processFn;
		this.batchSize = batchSize;
		this.batchTimeout = batchTimeout;
	}

	public add(item: T): Promise<R> {
		return new Promise((resolve, reject) => {
			this.batchQueue.push({ item, resolve, reject });

			if (this.batchQueue.length >= this.batchSize) {
				this.processBatch();
			} else if (!this.timeoutId) {
				this.timeoutId = setTimeout(() => this.processBatch(), this.batchTimeout);
			}
		});
	}

	private async processBatch(): Promise<void> {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}

		if (this.batchQueue.length === 0) return;

		const batch = this.batchQueue.splice(0, this.batchSize);
		const items = batch.map((b) => b.item);

		try {
			const results = await this.processFn(items);
			batch.forEach((b, index) => {
				b.resolve(results[index]);
			});
		} catch (error) {
			batch.forEach((b) => {
				b.reject(error);
			});
		}
	}

	public flush(): Promise<void> {
		return this.processBatch();
	}

	public getQueueSize(): number {
		return this.batchQueue.length;
	}
}

/**
 * Performance monitor for tracking worker performance
 */
export class PerformanceMonitor {
	private measurements: number[] = [];
	private maxMeasurements: number;

	constructor(maxMeasurements: number = 100) {
		this.maxMeasurements = maxMeasurements;
	}

	public recordMeasurement(duration: number): void {
		this.measurements.push(duration);
		if (this.measurements.length > this.maxMeasurements) {
			this.measurements.shift();
		}
	}

	public getAverage(): number {
		if (this.measurements.length === 0) return 0;
		return this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
	}

	public getMax(): number {
		if (this.measurements.length === 0) return 0;
		return Math.max(...this.measurements);
	}

	public getMin(): number {
		if (this.measurements.length === 0) return 0;
		return Math.min(...this.measurements);
	}

	public clear(): void {
		this.measurements = [];
	}
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
	private samples: number[] = [];
	private maxSamples: number;

	constructor(maxSamples: number = 60) {
		this.maxSamples = maxSamples;
	}

	public sample(): void {
		if (typeof performance !== 'undefined' && 'memory' in performance) {
			const memory = (performance as any).memory;
			if (memory) {
				const usedMB = memory.usedJSHeapSize / (1024 * 1024);
				this.samples.push(usedMB);
				if (this.samples.length > this.maxSamples) {
					this.samples.shift();
				}
			}
		}
	}

	public getAverageUsage(): number {
		if (this.samples.length === 0) return 0;
		return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
	}

	public getMaxUsage(): number {
		if (this.samples.length === 0) return 0;
		return Math.max(...this.samples);
	}

	public clear(): void {
		this.samples = [];
	}
}
