/* eslint-disable roblox-ts/no-spread-destructuring */

// can't do $tuple(...results), redeclaring table.unpack instead
declare const table: {
	unpack: (tbl: object, startingIndex?: number, lastIndex?: number) => LuaTuple<unknown[]>;
};

/**
 * Repeatedly calls a function until it does not throw an error or it exhausts
 * the specified maximum attempts.
 */
export function retry<Args extends unknown[], Returns extends LuaTuple<unknown[]>>(
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, ...Returns]>;
export function retry<Args extends unknown[], Returns>(
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, Returns]> {
	let success = false;
	let results: unknown;

	for (const _ of $range(1, maxAttempts)) {
		const callResults = pcall(toRetry, ...args);
		[success, ...results] = callResults;
		if (success) break;
	}

	return $tuple(success, ...(results as never));
}

/** Repeatedly calls a function until it does not throw an error. */
export function retryInfinitely<Args extends unknown[], Returns>(
	toRetry: (...args: Args) => Returns,
	...args: Args
): Returns {
	while (true) {
		const callResults = pcall(toRetry, ...args);
		const [success, ...results] = callResults;
		if (success) return table.unpack(results) as never;
	}
}

/**
 * Repeatedly calls a function until it does not throw an error. Waits by the
 * specified delay between calls.
 */
export function retryInfinitelyWithDelay<Args extends unknown[], Returns>(
	delay: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): Returns {
	while (true) {
		const callResults = pcall(toRetry, ...args);
		const [success, ...results] = callResults;
		if (success) return table.unpack(results) as never;
		task.wait(delay);
	}
}

/**
 * Repeatedly calls a function until it does not throw an error. Waits by the
 * specified exponential backoff delay between calls.
 */
export function retryInfinitelyWithExponentialBackoff<Args extends unknown[], Returns>(
	delay: number,
	delayExponent: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): Returns {
	let attempts = 0;
	while (true) {
		const callResults = pcall(toRetry, ...args);
		const [success, ...results] = callResults;
		if (success) return table.unpack(results) as never;
		task.wait(delay + delayExponent ** attempts);
		attempts += 1;
	}
}

/**
 * Repeatedly calls a function until it does not throw an error or it exhausts
 * the specified maximum attempts. Waits by the specified delay between calls.
 */
export function retryWithDelay<Args extends unknown[], Returns extends LuaTuple<unknown[]>>(
	delay: number,
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, ...Returns]>;
export function retryWithDelay<Args extends unknown[], Returns>(
	delay: number,
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, Returns]> {
	let success = false;
	let results: unknown;

	for (const _ of $range(1, maxAttempts)) {
		const callResults = pcall(toRetry, ...args);
		[success, ...results] = callResults;
		if (success) break;
		task.wait(delay);
	}

	return $tuple(success, ...(results as never));
}

/**
 * Repeatedly calls a function until it does not throw an error or it exhausts
 * the specified maximum attempts. Waits by the specified exponential backoff
 * delay between calls.
 */
export function retryWithExponentialBackoff<Args extends unknown[], Returns extends LuaTuple<unknown[]>>(
	delay: number,
	delayExponent: number,
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, ...Returns]>;
export function retryWithExponentialBackoff<Args extends unknown[], Returns>(
	delay: number,
	delayExponent: number,
	maxAttempts: number,
	toRetry: (...args: Args) => Returns,
	...args: Args
): LuaTuple<[success: boolean, Returns]> {
	let success = false;
	let results: unknown;

	for (const attempt of $range(1, maxAttempts)) {
		const callResults = pcall(toRetry, ...args);
		[success, ...results] = callResults;
		if (success) break;
		task.wait(delay + delayExponent ** attempt);
	}

	return $tuple(success, ...(results as never));
}
