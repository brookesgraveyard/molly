type Maybe<T> = T | undefined;

type DeepReadonly<T> = T extends (infer R)[] ? DeepReadonlyArray<R>
	: T extends Callback ? T
	: T extends object ? DeepReadonlyObject<T>
	: T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type DeepWritable<T> = T extends (infer R)[] ? DeepWritableArray<R>
	: T extends Callback ? T
	: T extends object ? DeepWritableObject<T>
	: T;

type DeepWritableArray<T> = Array<DeepWritable<T>>;

type DeepWritableObject<T> = {
	-readonly [P in keyof T]: DeepWritable<T[P]>;
};

type RequiredKeys<T> = {
	[K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
	[K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Sprite {
	img: string;
	x: number;
	y: number;
	w: number;
	h: number;
}
