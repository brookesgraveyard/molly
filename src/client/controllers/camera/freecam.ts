import { createMotion } from "@rbxts/ripple";
import { ContextActionService } from "@rbxts/services";
import { Set } from "@rbxts/sift";
import { clampFlyPosition } from "shared/constants/bounds";

import { beginCapturingMovement, getMovementVector, stopCapturingMovement } from "../input/movement";
import { BaseCamera } from "./base";
import { FOV_MODIFIERS } from "./exports";

// https://create.roblox.com/store/asset/90670668368455/Freecam-v11-Module

const CAMERA_SPEED = 2;
const PITCH_LIMIT = math.rad(90);
const MOUSE_PAN_SPEED = 1 / math.pi;
const GAMEPAD_PAN_SPEED = math.pi;
const SLOW_MULTIPLIER = 3;

class CustomCamera extends BaseCamera {
	public type = Enum.CameraType.Scriptable;

	private cameraPosition = new Vector3();
	private cameraRotation = new Vector2();
	private delta = new Vector2();
	private joystickDelta = new Vector2();
	private fovMultiplier = 1;

	private positionSpring = createMotion(new Vector3(), { start: true });
	private rotationSpring = createMotion(new Vector2(), { start: true });
	private fovMultiplierSpring = createMotion(1, { start: true });

	private fovMultiplierInstance: NumberValue | undefined;

	public toggle(enabled: boolean, camera: Camera): void {
		if (enabled) {
			beginCapturingMovement("freecam");

			const cf = camera.CFrame;
			const rot = cf.ToEulerAnglesYXZ();
			this.cameraPosition = cf.Position;
			this.cameraRotation = new Vector2(rot[0], rot[1]);
			this.fovMultiplier = 1;

			this.positionSpring.immediate(this.cameraPosition);
			this.rotationSpring.immediate(this.cameraRotation);
			this.fovMultiplierSpring.immediate(this.fovMultiplier);

			const multiplier = new Instance("NumberValue");
			multiplier.Value = 1;
			this.fovMultiplierInstance = multiplier;
			FOV_MODIFIERS((x) => Set.add(x, multiplier));

			let isPanning = false;
			ContextActionService.BindAction(
				"FREECAM_ROTATE",
				(_, state, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton2) {
						isPanning = state === Enum.UserInputState.Begin;
						this.mouseLocked = isPanning ? Enum.MouseBehavior.LockCenter : Enum.MouseBehavior.Default;
					} else if (input.UserInputType === Enum.UserInputType.MouseMovement && isPanning) {
						const dt = input.Delta;
						this.delta = new Vector2(-dt.Y, -dt.X);
					} else if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
						const pos = input.Position;
						this.joystickDelta = new Vector2(pos.Y, -pos.X);
					}

					return Enum.ContextActionResult.Sink;
				},
				false,
				Enum.UserInputType.MouseButton2,
				Enum.UserInputType.MouseMovement,
				Enum.KeyCode.Thumbstick2,
			);
			ContextActionService.BindAction(
				"FREECAM_ZOOM",
				(_, state, input) => {
					const fovStart = 0.5, fovEnd = 1.7;
					if (input.UserInputType === Enum.UserInputType.MouseWheel) {
						const incr = input.Position.Z / 11;
						this.fovMultiplier = math.clamp(this.fovMultiplier - incr, fovStart, fovEnd);
					} else if (state === Enum.UserInputState.Begin && input.KeyCode === Enum.KeyCode.ButtonR3) {
						// TODO: fix!!! :3 mrrp meowww nyaa miauu
						// const fovDuration = fovEnd - fovStart, incr = fovDuration / 5;
						// const newMult = (math.floor(this.fovMultiplier / incr) * incr) + incr;

						// this.fovMultiplier = fovDuration - (newMult % (fovDuration + 0.1)) + fovStart;
					}
				},
				false,
				Enum.UserInputType.MouseWheel,
				Enum.KeyCode.ButtonR3,
			);
		} else {
			stopCapturingMovement("freecam");

			ContextActionService.UnbindAction("FREECAM_ROTATE");
			ContextActionService.UnbindAction("FREECAM_ZOOM");

			if (this.fovMultiplierInstance) {
				FOV_MODIFIERS((x) => Set.delete(x, this.fovMultiplierInstance));
				this.fovMultiplierInstance.Destroy();
				this.fovMultiplierInstance = undefined;
			}
		}
	}

	private getCameraCFrame() {
		return new CFrame(this.cameraPosition).mul(CFrame.fromOrientation(this.cameraRotation.X, this.cameraRotation.Y, 0));
	}

	public update(camera: Camera, dt: number): void {
		const [vector, slow] = getMovementVector();
		const cameraSpeed = slow ? CAMERA_SPEED / SLOW_MULTIPLIER : CAMERA_SPEED;
		const cameraCframe = this.getCameraCFrame();

		// position
		const movementDirection = vector.mul(cameraSpeed);
		const updatedPosition = clampFlyPosition(cameraCframe.mul(movementDirection));

		// rotation
		let deltaWarrior = this.delta.mul(MOUSE_PAN_SPEED);
		if (this.joystickDelta.Magnitude > 0) deltaWarrior = this.joystickDelta.mul(GAMEPAD_PAN_SPEED);
		deltaWarrior = deltaWarrior.mul(dt).mul(this.fovMultiplier);

		const rawUpdatedRotation = this.cameraRotation.add(deltaWarrior);
		const updatedRotation = new Vector2(
			math.clamp(rawUpdatedRotation.X, -PITCH_LIMIT, PITCH_LIMIT),
			rawUpdatedRotation.Y,
		);

		this.cameraPosition = updatedPosition;
		this.cameraRotation = updatedRotation;
		this.delta = new Vector2();
		this.positionSpring.spring(this.cameraPosition, { friction: 40, tension: 500 });
		this.rotationSpring.spring(this.cameraRotation, { friction: 40, tension: 500 });
		this.fovMultiplierSpring.spring(this.fovMultiplier, { friction: 40, tension: 500 });

		// so schizo

		let camRotSpringValue = this.rotationSpring.get();
		camRotSpringValue = new Vector2(
			camRotSpringValue.X,
			camRotSpringValue.Y % (2 * math.pi),
		);

		camera.CFrame = new CFrame(this.positionSpring.get()).mul(
			CFrame.fromOrientation(camRotSpringValue.X, camRotSpringValue.Y, 0),
		);
		if (this.fovMultiplierInstance) this.fovMultiplierInstance.Value = this.fovMultiplierSpring.get();
	}
}

export const FreecamCamera = new CustomCamera();
