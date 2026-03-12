export function isInsideBox(point: Vector3, boxCFrame: CFrame, boxSize: Vector3) {
	const pointOffset = boxCFrame.PointToObjectSpace(point);
	return (math.abs(pointOffset.X) <= boxSize.X / 2) && (math.abs(pointOffset.Y) <= boxSize.Y / 2)
		&& (math.abs(pointOffset.Z) <= boxSize.Z / 2);
}
