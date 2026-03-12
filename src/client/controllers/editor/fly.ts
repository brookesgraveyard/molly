import { Controller, OnStart } from "@flamework/core";
import { subscribe } from "@rbxts/charm";
import Iris from "@rbxts/iris";
import { createMotion } from "@rbxts/ripple";
import { Players, Workspace } from "@rbxts/services";
import { clampFlyPosition } from "shared/constants/bounds";
import { BuildMode } from "shared/constants/editor";
import { OnPreSimulation } from "shared/hook-managers/physic-hook-manager";

import { DevPanelDropdown } from "../devpanel";
import { beginCapturingMovement, getMovementVector, stopCapturingMovement } from "../input/movement";
import { EditorController } from ".";
import { teleportTo } from "./exports";

interface Character extends Model {
	HumanoidRootPart: BasePart;
	Humanoid: Humanoid;
}

@Controller()
export class FlyController implements OnStart, OnPreSimulation, DevPanelDropdown {
	flySpeed = 60;

	private cframeSpring = createMotion(new CFrame());
	private savedPivot = new CFrame();

	constructor(private editorController: EditorController) {}

	onStart(): void {
		subscribe(this.editorController.buildMode, (state) => {
			if (state === BuildMode.Fly) {
				beginCapturingMovement("fly");
				this.savedPivot = Players.LocalPlayer.Character?.GetPivot() ?? new CFrame();
				this.cframeSpring.immediate(this.savedPivot);
				this.cframeSpring.start();
			} else {
				stopCapturingMovement("fly");
				this.cframeSpring.stop();
			}
		});

		teleportTo.Connect((location) => {
			if (this.editorController.buildMode() === BuildMode.Fly) {
				this.savedPivot = location;
			} else {
				Players.LocalPlayer.Character?.PivotTo(location);
			}
		});
	}

	onPreSimulation(dt: number): void {
		const character = Players.LocalPlayer.Character as Character;
		if (!character) return;

		const buildMode = this.editorController.buildMode();

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		const root = character.FindFirstChild("HumanoidRootPart");
		if (!humanoid || !root) return;

		if (buildMode === BuildMode.Fly) {
			const camera = Workspace.CurrentCamera;

			if (humanoid) humanoid.PlatformStand = true;
			if (root && camera) {
				root.Anchored = true;
				root.AssemblyLinearVelocity = Vector3.zero;
				root.AssemblyAngularVelocity = Vector3.zero;

				// eslint-disable-next-line prefer-const
				let [moveAmount, slow] = getMovementVector();
				moveAmount = moveAmount.mul(dt).mul(slow ? this.flySpeed / 2 : this.flySpeed);

				const pivot = this.savedPivot;
				const newPivot = new CFrame(pivot.Position, pivot.Position.add(camera.CFrame.LookVector.mul(dt))).mul(
					new CFrame(moveAmount),
				);

				const targetCFrame = new CFrame(clampFlyPosition(newPivot.Position)).mul(newPivot.Rotation);
				this.savedPivot = targetCFrame;
				this.cframeSpring.spring(targetCFrame, { friction: 40, tension: 500 });

				character.PivotTo(this.cframeSpring.get());
			}
		} else {
			if (humanoid) humanoid.PlatformStand = false;
			if (root) root.Anchored = false;
		}
	}

	renderDevPanelDropdown(): void {
		const flySpeed = Iris.State(this.flySpeed);
		if (Iris.SliderNum(["Fly Speed", 10, -1000, 1000], { number: flySpeed }).numberChanged()) {
			this.flySpeed = flySpeed.get();
		}
	}
}
