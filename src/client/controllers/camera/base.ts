export class BaseCamera {
	public type: Enum.CameraType | undefined;
	public mouseLocked: Enum.MouseBehavior | undefined;

	public toggle(enabled: boolean, camera: Camera) {}
	public update(camera: Camera, dt: number) {}
}
