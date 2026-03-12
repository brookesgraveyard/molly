import { Controller, OnStart } from "@flamework/core";
import { atom, effect } from "@rbxts/charm";
import Iris from "@rbxts/iris";
import Make from "@rbxts/make";
import Object from "@rbxts/object-utils";
import { createMotion } from "@rbxts/ripple";
import { Players, Workspace } from "@rbxts/services";
import { OnPreRender } from "client/hook-managers/render-hook-manager";
import { BuildMode, Commit, CommitMode, SelectionMode } from "shared/constants/editor";
import { PART_TAG } from "shared/constants/obby";
import { createLogger } from "shared/logger";

import { DevPanelDropdown } from "../devpanel";
import { teleportTo } from "./exports";

const SELECTION_MODE_AS_VALUES = Object.keys(SelectionMode).sort();
const BUILD_MODE_AS_VALUES = Object.keys(BuildMode).sort();

const PROPS_TO_HIDE_FROM_ROBLOX_LOADING = {
	Size: Vector3.zero,
	Position: new Vector3(math.huge, math.huge, math.huge),
};

function getHoveringObject(mouse: Mouse) {
	const ray = mouse.UnitRay;
	const params = new RaycastParams();
	params.FilterType = Enum.RaycastFilterType.Exclude;
	params.CollisionGroup = "PlayerCharacter";
	const raycast = Workspace.Raycast(ray.Origin, ray.Direction.mul(10_000), params);

	if (!raycast?.Instance) return;

	return {
		part: raycast.Instance,
		position: raycast.Position,
	};
}

function getHoveringObbyPart(mouse: Mouse) {
	const result = getHoveringObject(mouse);

	if (!result?.part) return;

	const id = result.part.GetAttribute("clientEntityId");
	if (!typeIs(id, "number") || !result.part.HasTag(PART_TAG)) return;

	return {
		part: result?.part,
		id,
	};
}

const normalOutlineColor = Color3.fromHex("#42ff42");
const dangerOutlineColor = Color3.fromHex("#ff6969");
const mysteriousWhiteOutlineColor = Color3.fromHex("#ffffff");
const mysteriousBlueOutlineColor = Color3.fromHex("#6969ff");

@Controller()
export class EditorController implements OnStart, OnPreRender, DevPanelDropdown {
	private logger = createLogger("EditorController");

	private mouse = Players.LocalPlayer.GetMouse();

	readonly isEditing = atom(false);
	readonly selectionHighlightTarget = atom<BasePart>();
	readonly currentCommit = atom<Commit>();
	readonly selectionMode = atom(SelectionMode.Selection);
	readonly buildMode = atom(BuildMode.Build);
	readonly selectedPart = atom<BasePart>();

	private selectionHighlightAdornee = Make("Part", {
		Name: "SelectionHighlightAdornee",
		Anchored: true,
		Transparency: 1,
		CanCollide: false,
		CanQuery: false,
		CanTouch: false,
		...PROPS_TO_HIDE_FROM_ROBLOX_LOADING,
	});

	private selectionHighlight = Make("SelectionBox", {
		Name: "SelectionHighlight",
		Parent: Workspace,
		Adornee: this.selectionHighlightAdornee,
		Color3: normalOutlineColor,
		SurfaceTransparency: 1,
		Transparency: 0,
		LineThickness: 4 / 20,
	});

	private hoverHighlight = Make("SelectionBox", {
		Name: "HoverHighlight",
		Parent: Workspace,
		Color3: normalOutlineColor,
		SurfaceTransparency: 1,
		Transparency: 0.5,
		LineThickness: 0.05 / 2,
	});

	private highlightCFrame = createMotion(new CFrame(), { start: true });
	private highlightSize = createMotion(new Vector3(), { start: true });
	private highlightThickness = createMotion(2, { start: true });
	private highlightTransparency = createMotion(1, { start: true });
	private hoverHighlightTransparency = createMotion(1, { start: true });
	private highlightColorMotion = createMotion(normalOutlineColor, { start: true });
	private highlightColor = atom(normalOutlineColor);

	deselect() {
		this.selectedPart(undefined);
		this.highlightThickness.spring(2);
		this.highlightTransparency.spring(1);
	}

	resetToSelection() {
		this.selectionMode(SelectionMode.Selection);
		this.deselect();
	}

	reset() {
		this.buildMode(BuildMode.Build);
		this.currentCommit(undefined);
		this.resetToSelection();
	}

	consumeCommit() {
		const currentCommit = this.currentCommit();
		this.currentCommit(undefined);

		if (currentCommit) {
			this.logger.trace(`Committing ${CommitMode[currentCommit.mode]}`);
			return;
		}

		this.logger.trace("No commit to consume");
	}

	doSelectionModeIfSelected(mode: SelectionMode) {
		if (this.selectedPart()) return this.doSelectionMode(mode);
		const oldMode = this.selectionMode();
		this.deselect();
		this.selectionMode(oldMode === mode ? SelectionMode.Selection : mode);
	}

	doSelectionMode(mode: SelectionMode = this.selectionMode()) {
		const character = Players.LocalPlayer.Character;
		if (!this.isEditing()) return;

		const obbyPart = getHoveringObbyPart(this.mouse);
		const part = obbyPart?.part;
		if (mode === SelectionMode.Teleport) {
			const location = getHoveringObject(this.mouse)?.position;
			if (location) {
				this.logger.trace(`Teleporting to ${location}`);
				if (character?.PrimaryPart) teleportTo.Fire(new CFrame(location));
				this.selectionMode(SelectionMode.Selection);
			}
		} else if (mode === SelectionMode.Clone) {
			// TODO
			if (part) this.resetToSelection();
		} else if (mode === SelectionMode.Delete) {
			// TODO
			if (part) this.resetToSelection();
		} else {
			const selectedPart = this.selectedPart();
			if (part) {
				if (selectedPart) {
					this.highlightCFrame.spring(part.CFrame, {
						damping: 1,
						mass: 0.5,
					});
					this.highlightSize.spring(part.Size, {
						damping: 1,
						mass: 0.25,
					});
				} else {
					this.highlightCFrame.immediate(part.CFrame);
					this.highlightSize.immediate(part.Size);
				}

				this.selectionMode(SelectionMode.Move);
				this.selectedPart(part);
				this.highlightThickness.spring(1);
				this.highlightTransparency.spring(0);

				if (selectedPart === part) {
					this.highlightThickness.impulse(1 / 30);
				}

				this.logger.trace("Selected", part);
			} else if (selectedPart) {
				this.resetToSelection();
			}
		}
	}

	/** @hidden */
	onStart(): void {
		this.mouse.Button1Down.Connect(() => this.doSelectionMode());

		effect(() => {
			let color: Color3;
			switch (this.selectionMode()) {
				case SelectionMode.Teleport:
					color = mysteriousBlueOutlineColor;
					break;
				case SelectionMode.Clone:
					color = mysteriousWhiteOutlineColor;
					break;
				case SelectionMode.Delete:
					color = dangerOutlineColor;
					break;
				default:
					color = normalOutlineColor;
					break;
			}
			this.highlightColor(color);
		});

		effect(() => this.highlightColorMotion.spring(this.highlightColor()));

		this.hoverHighlightTransparency.tween(2, {
			time: 1,
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.InOut,
			reverses: true,
			repeatCount: -1,
		});
	}

	/** @hidden */
	onPreRender(): void {
		this.selectionHighlightAdornee.CFrame = this.highlightCFrame.get();
		this.selectionHighlightAdornee.Size = this.highlightSize.get();
		this.selectionHighlight.Color3 = this.highlightColorMotion.get();
		this.selectionHighlight.Transparency = this.highlightTransparency.get();
		this.selectionHighlight.LineThickness = this.highlightThickness.get() / 20;
		this.hoverHighlight.Color3 = this.highlightColorMotion.get();
		this.hoverHighlight.Transparency = this.hoverHighlightTransparency.get() / 3;

		if (this.isEditing()) {
			this.hoverHighlight.Adornee = getHoveringObject(this.mouse)?.part;
		}
	}

	/** @hidden */
	renderDevPanelDropdown() {
		Iris.SeparatorText([`Selection mode: ${SelectionMode[this.selectionMode()]}`]);

		Iris.SameLine([]);
		for (const mode of SELECTION_MODE_AS_VALUES) {
			if (Iris.Button([mode]).clicked()) {
				this.selectionMode(SelectionMode[mode]);
			}
		}
		Iris.End();

		Iris.SeparatorText([`Building Mode: ${BuildMode[this.buildMode()]}`]);

		Iris.SameLine([]);
		for (const mode of BUILD_MODE_AS_VALUES) {
			if (Iris.Button([mode]).clicked()) {
				this.buildMode(BuildMode[mode]);
			}
		}
		Iris.End();

		Iris.SeparatorText([`Commit: ${this.currentCommit() ? CommitMode[this.currentCommit()!.mode] : "(None)"}`]);

		if (Iris.Button(["Consume Commit"]).clicked()) {
			this.consumeCommit();
		}
	}
}
