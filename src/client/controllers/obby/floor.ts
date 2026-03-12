import { Controller, OnInit, OnStart } from "@flamework/core";
import { effect } from "@rbxts/charm";
import { createMotion, Motion } from "@rbxts/ripple";
import { Workspace } from "@rbxts/services";
import { OnPreRender } from "client/hook-managers/render-hook-manager";
import { obbyProperties } from "shared/atoms";

import { EditorController } from "../editor";

@Controller()
export class FloorController implements OnInit, OnStart, OnPreRender {
	floor!: BasePart;

	floorColor!: Motion<Color3>;
	floorReflectance!: Motion<number>;
	floorTransparency!: Motion<number>;

	constructor(private editorController: EditorController) {}

	onInit(): void {
		this.floor = Workspace.WaitForChild<BasePart>("ObbyFloor");

		const { floorColor, floorReflectance, floorTransparency } = obbyProperties();
		this.floorColor = createMotion(floorColor, { start: true });
		this.floorReflectance = createMotion(floorReflectance, { start: true });
		this.floorTransparency = createMotion(floorTransparency, { start: true });
	}

	onStart(): void {
		const { floor } = this;
		effect(() => {
			const obbyPropertiesNow = obbyProperties();
			const isEditingNow = this.editorController.isEditing();
			floor.CanCollide = isEditingNow || obbyPropertiesNow.floorCanCollide;
			floor.Material = obbyPropertiesNow.floorMaterial;
			this.floorColor.spring(obbyPropertiesNow.floorColor);
			this.floorReflectance.spring(obbyPropertiesNow.floorReflectance);
			this.floorTransparency.spring(
				isEditingNow ? obbyPropertiesNow.floorTransparency / 2 : obbyPropertiesNow.floorTransparency,
			);
		});
	}

	onPreRender(): void {
		const { floor } = this;
		floor.Color = this.floorColor.get();
		floor.Reflectance = this.floorReflectance.get();
		floor.Transparency = this.floorTransparency.get();
	}
}
