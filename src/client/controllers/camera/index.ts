import { Controller, OnStart } from "@flamework/core";
import { atom, effect } from "@rbxts/charm";
import Iris from "@rbxts/iris";
import Make from "@rbxts/make";
import Object from "@rbxts/object-utils";
import { RunService, UserInputService, Workspace } from "@rbxts/services";
import { OnPreRender } from "client/hook-managers/render-hook-manager";
import { BuildMode } from "shared/constants/editor";

import { DevPanelDropdown } from "../devpanel";
import { EditorController } from "../editor";
import { BaseCamera } from "./base";
import { DefaultCamera } from "./default";
import { FOV_MODIFIERS, ZOOM_MODIFIERS } from "./exports";
import { FreecamCamera } from "./freecam";

enum CameraMode {
	Default,
	Freecam,
}

const CAMERA_MODE_AS_VALUES = Object.keys(CameraMode).sort();

const cameraModules = {
	[CameraMode.Default]: DefaultCamera,
	[CameraMode.Freecam]: FreecamCamera,
};

@Controller()
export class CameraController implements OnStart, OnPreRender, DevPanelDropdown {
	private camera!: Camera;
	private snapshot?: BaseCamera;
	private preDistort?: CFrame;
	readonly cameraMode = atom(CameraMode.Default);
	readonly fov = atom(70);

	constructor(private editorController: EditorController) {}

	onStart(): void {
		this.camera = Make("Camera", {
			Name: "OCPlaceCamera",
			Parent: Workspace,
		});

		effect(() => {
			const mode = this.editorController.buildMode();
			if (mode === BuildMode.Freecam) this.cameraMode(CameraMode.Freecam);
			else this.cameraMode(CameraMode.Default);
		});

		// we can't use onRender due to a MEMORY LEAK??? lmao
		// https://devforum.roblox.com/t/easy-camera-distortion-and-manipulation-gone-wrong-professional-edition-custom-shiftlock-new-roblox-roblox-studio/1896438/37
		RunService.BindToRenderStep("OnPreDistortCamera", 199, () => this.onPreDistort());
		RunService.BindToRenderStep("DistortCamera", 201, () => this.onDistort());
	}

	getModule() {
		return cameraModules[this.cameraMode()] as BaseCamera;
	}

	getDistort() {
		const zoom = Object.keys(ZOOM_MODIFIERS()).reduce((a, b) => a * b.Value, 1);

		return new CFrame(
			0, // X offset
			0, // Y offset
			0, // Z offset
			1, // [ -1, 1 ] — squish X
			0, // [ -0.5, 0.5 ] — skew Y
			0, // [ -0.5, 0.5 ] — weird 3D pan X
			0, // [ -0.5, 0.5 ] — skew X
			1, // [ -1, 1 ] — squish Y
			0, // [ -0.5, 0.5 ] — weird 3D pan Y
			0, // [ -0.5, 0.5 ] — viewport translate X
			0, // [ -0.5, 0.5 ] — viewport translate Y
			zoom, // [ -1.2, 1.2 ] — viewport zoom
		);
	}

	onPreRender(dt: number): void {
		const module = this.getModule();

		if (this.snapshot && this.snapshot !== module) this.snapshot.toggle(false, this.camera);
		if (this.snapshot !== module) module.toggle(true, this.camera);
		this.snapshot = module;

		this.camera.FieldOfView = Object.keys(FOV_MODIFIERS()).reduce((a, b) => a * b.Value, this.fov());
		this.camera.CameraType = module.type!;
		if (module.mouseLocked) UserInputService.MouseBehavior = module.mouseLocked;
		if (module.mouseLocked === Enum.MouseBehavior.Default) module.mouseLocked = undefined;

		module.update(this.camera, dt);
		if (module.type === Enum.CameraType.Scriptable) {
			this.camera.CFrame = this.camera.CFrame.mul(this.getDistort());
		}

		Workspace.CurrentCamera = this.camera;
	}

	onPreDistort() {
		if (this.getModule().type === Enum.CameraType.Scriptable) return;

		if (this.preDistort) this.camera.CFrame = this.preDistort;
	}

	onDistort() {
		if (this.getModule().type === Enum.CameraType.Scriptable) return this.preDistort = undefined;

		this.preDistort = this.camera.CFrame;
		this.camera.CFrame = this.camera.CFrame.mul(this.getDistort());
	}

	renderDevPanelDropdown() {
		Iris.SeparatorText(["Camera Mode"]);

		Iris.Text([`Current: ${CameraMode[this.cameraMode()]}`]);

		Iris.SameLine([]);
		for (const mode of CAMERA_MODE_AS_VALUES) {
			if (Iris.Button([mode]).clicked()) {
				this.cameraMode(CameraMode[mode]);
			}
		}
		Iris.End();

		Iris.SeparatorText(["Camera State"]);

		const fovState = Iris.State(this.fov());
		fovState.onChange(this.fov);
		Iris.SliderNum([`FOV: ${this.fov()}`, 1, 1, 120], { number: fovState });
	}
}
