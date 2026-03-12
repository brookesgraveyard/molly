import {
	color3_to_linear_srgb,
	linear_srgb_to_color3,
	linear_srgb_to_oklab,
	oklab_to_linear_srgb,
} from "./color/oklab";

export function lerpCFrame(a: CFrame, b: CFrame, t: number) {
	return a.Lerp(b, t);
}

export function lerpColor3(a: Color3, b: Color3, t: number) {
	const aLch = linear_srgb_to_oklab(color3_to_linear_srgb(a));
	const bLch = linear_srgb_to_oklab(color3_to_linear_srgb(b));
	return linear_srgb_to_color3(
		oklab_to_linear_srgb(
			lerpVector3(aLch, bLch, t),
		),
	);
}

export function lerpColorSequenceKeypoint(a: ColorSequenceKeypoint, b: ColorSequenceKeypoint, t: number) {
	return new ColorSequenceKeypoint(math.lerp(a.Time, b.Time, t), lerpColor3(a.Value, b.Value, t));
}

export function lerpDateTime(a: DateTime, b: DateTime, t: number) {
	return DateTime.fromUnixTimestampMillis(math.lerp(a.UnixTimestampMillis, b.UnixTimestampMillis, t));
}

export function lerpNumberRange(a: NumberRange, b: NumberRange, t: number) {
	return new NumberRange(math.lerp(a.Min, b.Min, t), math.lerp(a.Max, b.Max, t));
}

export function lerpNumberSequenceKeypoint(a: NumberSequenceKeypoint, b: NumberSequenceKeypoint, t: number) {
	return new NumberSequenceKeypoint(
		math.lerp(a.Time, b.Time, t),
		math.lerp(a.Value, b.Value, t),
		math.lerp(a.Envelope, b.Envelope, t),
	);
}

export function lerpPhysicalProperties(a: PhysicalProperties, b: PhysicalProperties, t: number) {
	return new PhysicalProperties(
		math.lerp(a.Density, b.Density, t),
		math.lerp(a.Friction, b.Friction, t),
		math.lerp(a.Elasticity, b.Elasticity, t),
		math.lerp(a.FrictionWeight, b.FrictionWeight, t),
		math.lerp(a.ElasticityWeight, b.ElasticityWeight, t),
	);
}

export function lerpRay(a: Ray, b: Ray, t: number) {
	return new Ray(
		a.Origin.Lerp(b.Origin, t),
		a.Direction.Lerp(b.Direction, t),
	);
}

export function lerpRect(a: Rect, b: Rect, t: number) {
	return new Rect(
		a.Min.Lerp(b.Min, t),
		a.Max.Lerp(b.Max, t),
	);
}

export function lerpRegion3(a: Region3, b: Region3, t: number) {
	const position = a.CFrame.Position.Lerp(b.CFrame.Position, t);
	const halfSize = a.Size.Lerp(b.Size, t).div(2);
	return new Region3(position.sub(halfSize), position.add(halfSize));
}

export function lerpRegion3int16(a: Region3int16, b: Region3int16, t: number) {
	return new Region3int16(lerpVector3int16(a.Min, b.Min, t), lerpVector3int16(a.Max, b.Max, t));
}

export function lerpUDim(a: UDim, b: UDim, t: number) {
	return new UDim(
		math.lerp(a.Scale, a.Scale, t),
		math.lerp(a.Offset, a.Offset, t),
	);
}

export function lerpUDim2(a: UDim2, b: UDim2, t: number) {
	return a.Lerp(b, t);
}

export function lerpVector(a: vector, b: vector, t: number) {
	return vector.create(
		math.lerp(a.x, b.x, t),
		math.lerp(a.y, b.y, t),
		math.lerp(a.z, b.z, t),
	);
}

export function lerpVector3(a: Vector3, b: Vector3, t: number) {
	return a.Lerp(b, t);
}

export function lerpVector3int16(a: Vector3int16, b: Vector3int16, t: number) {
	return new Vector3int16(
		math.lerp(a.X, b.X, t),
		math.lerp(a.Y, b.Y, t),
		math.lerp(a.Z, b.Z, t),
	);
}

export function lerpVector2(a: Vector2, b: Vector2, t: number) {
	return a.Lerp(b, t);
}

export function lerpVector2int16(a: Vector2int16, b: Vector2int16, t: number) {
	return new Vector2int16(
		math.lerp(a.X, b.X, t),
		math.lerp(a.Y, b.Y, t),
	);
}

export const lerpDataTypes = {
	number: math.lerp,
	CFrame: lerpCFrame,
	Color3: lerpColor3,
	ColorSequenceKeypoint: lerpColorSequenceKeypoint,
	DateTime: lerpDateTime,
	NumberRange: lerpNumberRange,
	NumberSequenceKeypoint: lerpNumberSequenceKeypoint,
	PhysicalProperties: lerpPhysicalProperties,
	Ray: lerpRay,
	Rect: lerpRect,
	Region3: lerpRegion3,
	Region3int16: lerpRegion3int16,
	UDim: lerpUDim,
	UDim2: lerpUDim2,
	vector: lerpVector as never,
	Vector3: lerpVector3,
	Vector3int16: lerpVector3int16,
	Vector2: lerpVector2,
	Vector2int16: lerpVector2int16,
} as const satisfies {
	[K in keyof CheckableTypes]?: (a: CheckableTypes[K], b: CheckableTypes[K], t: number) => CheckableTypes[K];
};

export type ImplementsLerp = CheckableTypes[keyof typeof lerpDataTypes];

export function lerp<T>(a: T, b: T, t: number) {
	const lerpFunction = lerpDataTypes[typeOf(a) as never] as Maybe<(a: T, b: T, t: number) => T>;
	if (lerpFunction) return lerpFunction(a, b, t);
	return t > 0.5 ? b : a;
}
