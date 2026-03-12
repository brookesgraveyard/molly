export const OBBY_EDGE = new Vector3(-115, -0.5, -25);

export function translateToObby(cframe: CFrame) {
	const position = cframe.Position;
	return new CFrame(OBBY_EDGE.add(new Vector3(position.X, position.Y, -position.Z))).mul(cframe.Rotation);
}

export function translateFromObby(cframe: CFrame) {
	const position = cframe.Position.sub(OBBY_EDGE);
	return new CFrame(new Vector3(position.X, position.Y, -position.Z)).mul(cframe.Rotation);
}

export const FLY_BOUNDS_SIZE = new Vector3(280, 1050, 1050);
export const FLY_BOUNDS_POS = new Vector3(0, 499.5, -525);

export function clampFlyPosition(position: Vector3) {
	const size = FLY_BOUNDS_SIZE.div(2);
	const comparePos = position.sub(FLY_BOUNDS_POS);

	return new Vector3(
		math.clamp(comparePos.X, -size.X, size.X) + FLY_BOUNDS_POS.X,
		math.clamp(comparePos.Y, -size.Y, size.Y) + FLY_BOUNDS_POS.Y,
		math.clamp(comparePos.Z, -size.Z, size.Z) + FLY_BOUNDS_POS.Z,
	);
}
