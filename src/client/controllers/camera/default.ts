import { Players } from "@rbxts/services";

import { BaseCamera } from "./base";

class CustomCamera extends BaseCamera {
	public type = Enum.CameraType.Custom;

	public update(camera: Camera): void {
		const character = Players.LocalPlayer.Character;
		camera.CameraSubject = character?.FindFirstChildOfClass("Humanoid");
	}
}

export const DefaultCamera = new CustomCamera();
