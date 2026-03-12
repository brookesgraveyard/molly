// All of Vide built-in primitives don't support Derivable </3

import { Derivable, untrack } from "@rbxts/vide";

import { dissolve } from "./dissolve";

type RecordKey = string | number | symbol;
type Table<K, V> = V[] | Map<K, V> | Set<K> | Record<Extract<K, RecordKey>, V>;

export const Default = table.freeze({}) as symbol;

export function match<I extends RecordKey, O>(
	source: Derivable<I>,
	map: {
		[_ in I | typeof Default]?: () => O;
	},
): Derivable<O> {
	return dissolve((read) => {
		const readSource = read(source);
		const out = map[readSource] ?? map[Default];
		if (out) return untrack(out);
		type GoShitYourselfTypeScriptIDontGiveAFuck = never;
		throw `Unexpected value in exhaustive match: ${readSource as GoShitYourselfTypeScriptIDontGiveAFuck}`;
	});
}

/** @alias indexes */
export function keys<KI, KO, V>(
	source: Derivable<Table<KI, V>>,
	map: (key: KI) => KO,
): Derivable<Table<KO, V>> {
	return dissolve((read) => {
		const readSource = read(source);
		const result = new Map();
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key, value] of pairs(readSource)) result.set(map(key as KI), value);
		return result as never;
	});
}

export function values<VI, VO>(
	source: Derivable<Array<VI>>,
	map: (value: VI) => VO,
): Derivable<Array<VO>>;
export function values<VI, VO, K>(
	source: Derivable<Table<K, VI>>,
	map: (value: VI) => VO,
): Derivable<Table<K, VO>> {
	return dissolve((read) => {
		const readSource = read(source);
		const result = new Map();
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key, value] of pairs(readSource)) result.set(key, map(value as VI));
		return result as never;
	});
}

export function map<KI, KO, VI, VO>(
	source: Derivable<Table<KI, VI>>,
	map: (key: KI, value: VI) => LuaTuple<[newKey: KO, newValue: VO]>,
): Derivable<Table<KO, VO>> {
	return dissolve((read) => {
		const readSource = read(source);
		const result = new Map();
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key, value] of pairs(readSource)) {
			const [newKey, newValue] = map(key as KI, value as VI);
			result.set(newKey, newValue);
		}
		return result as never;
	});
}

export function show<T, U>(
	source: unknown,
	ifTruthy: () => T,
): Derivable<Maybe<T>>;
export function show<T, U>(
	source: unknown,
	ifTruthy: () => T,
	fallback: () => U,
): Derivable<T | U>;
export function show<T>(
	source: unknown,
	ifTruthy: () => T,
	fallback?: () => T,
): Derivable<T>;
export function show<T, U>(
	source: unknown,
	ifTruthy: () => T,
	fallback?: () => U,
): Derivable<T | U | undefined> {
	return dissolve((read) => {
		const readSource = read(source);
		if (readSource) return untrack(ifTruthy);
		if (fallback) return untrack(fallback);
		return undefined;
	});
}
