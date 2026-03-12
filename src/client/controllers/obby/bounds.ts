import { Controller, OnInit } from "@flamework/core";
import { atom, effect } from "@rbxts/charm";
import Make from "@rbxts/make";
import { createMotion } from "@rbxts/ripple";
import { Players, Workspace } from "@rbxts/services";
import { OnPreRender } from "client/hook-managers/render-hook-manager";
import { OnPreSimulation } from "shared/hook-managers/physic-hook-manager";
import { isInsideBox } from "shared/utils/math/is-inside-box";

import { EditorController } from "../editor";

function intoBoolean(x: unknown) {
	return !(!x);
}

@Controller()
export class BoundsController implements OnInit, OnPreSimulation, OnPreRender {
	bounds!: BasePart;
	boundsCFrame!: CFrame;
	boundsSize!: Vector3;

	isInBounds = atom(false);

	private localPlayer = Players.LocalPlayer;
	private boundsTransparency = createMotion(1, { start: true });
	private boundsHighlight = Make("SelectionBox", {
		Name: "BoundsHighlight",
		Color3: new Color3(0, 1, 0),
		LineThickness: 0.05,
		SurfaceTransparency: 1,
		Transparency: 1,
		Parent: Workspace,
	});

	constructor(private editorController: EditorController) {}

	onInit(): void | Promise<void> {
		this.bounds = Workspace.WaitForChild<BasePart>("ObbyBounds");
		this.boundsCFrame = this.bounds.CFrame;
		this.boundsSize = this.bounds.Size;

		this.boundsHighlight.Adornee = this.bounds;
		effect(() => this.boundsTransparency.spring(this.editorController.isEditing() ? 0 : 1));
	}

	onPreRender(): void {
		this.boundsHighlight.Transparency = this.boundsTransparency.get();
	}

	onPreSimulation(): void {
		const root = this.localPlayer.Character && this.localPlayer.Character.FindFirstChild<BasePart>("HumanoidRootPart");
		this.isInBounds(intoBoolean(root && isInsideBox(root.Position, this.boundsCFrame, this.boundsSize)));
	}
}
