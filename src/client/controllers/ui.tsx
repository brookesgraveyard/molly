import { Controller, OnStart } from "@flamework/core";
import Iris from "@rbxts/iris";
import Object from "@rbxts/object-utils";
import { Players } from "@rbxts/services";
import Vide, { derive, effect, mount, read, source } from "@rbxts/vide";
import { useAtom } from "@rbxts/vide-charm";
import { Analytics } from "client/generated/blink";
import { translateFromObby } from "shared/constants/bounds";
import { BuildMode, SelectionMode } from "shared/constants/editor";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";
import { currentTheme, THEMES, userTheme } from "ui/theme";
import { Editor } from "ui/views/editor";
import { Menu } from "ui/views/menu";
import { NavView } from "ui/views/nav-view";

import { DevPanelDropdown } from "./devpanel";
import { EditorController } from "./editor";
import { WindowsController } from "./windows";

export enum UIState {
	Title,
	Idle,
	Editor,
	Menu,
	Settings,
}

const UISTATE_AS_VALUES = Object.keys(UIState).sort().map((k) => UIState[k]);

@Controller()
export class UIController implements OnStart, DevPanelDropdown {
	private logger = createLogger("UIController");
	readonly state = source(UIState.Idle);

	/** @hidden */
	constructor(private editorController: EditorController, private windowsController: WindowsController) {}

	getSelectionCoords(mode: SelectionMode, part?: BasePart) {
		if (!part) return undefined;

		const cap = (vector: Vector3) =>
			new Vector3(math.ceil(vector.X * 100) / 100, math.ceil(vector.Y * 100) / 100, math.ceil(vector.Z * 100) / 100);

		if (mode === SelectionMode.Move) return cap(translateFromObby(part.CFrame).Position);
		else if (mode === SelectionMode.Rotate) return cap(part.Orientation);
		else if (mode === SelectionMode.Scale) return cap(part.Size);
	}

	/** @hidden */
	onStart(): void {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

		mount(() => {
			this.logger.trace("Mounting UI");
			useRem();

			const selectionMode = useAtom(this.editorController.selectionMode);
			const buildMode = useAtom(this.editorController.buildMode);
			const selectedPart = useAtom(this.editorController.selectedPart);

			const selectionCoords = derive(() => this.getSelectionCoords(selectionMode(), selectedPart()));

			effect(() => {
				const state = this.state();
				// if (state === UIState.Menu) this.editorController.isEditing(false);
				if (state === UIState.Editor) Analytics.OpenedEditor.fire();
				else if (state === UIState.Settings) Analytics.OpenedSettings.fire();

				this.editorController.isEditing(state === UIState.Editor);
			});

			effect(() => {
				const mode = buildMode();
				if (mode === BuildMode.Fly) Analytics.UsedFlyMode.fire();
				else if (mode === BuildMode.Freecam) Analytics.UsedFreecamMode.fire();
			});

			return (
				<>
					<screengui Name="NavView" IgnoreGuiInset ResetOnSpawn={false}>
						<NavView
							enabled={() => this.state() === UIState.Idle}
							onEdit={() => {
								this.editorController.reset();
								this.state(UIState.Editor);
							}}
							onMenu={() => {
								this.state(UIState.Menu);
							}}
						/>
					</screengui>
					<screengui Name="MenuView" IgnoreGuiInset ResetOnSpawn={false}>
						<Menu
							enabled={() => this.state() === UIState.Menu}
							onReturn={() => {
								this.state(UIState.Idle);
							}}
						/>
					</screengui>
					<screengui Name="Editor" IgnoreGuiInset ResetOnSpawn={false}>
						<Editor
							enabled={() => this.state() === UIState.Editor}
							onReturn={() => {
								this.state(UIState.Idle);
								this.editorController.reset();
							}}
							selectionMode={selectionMode}
							buildMode={buildMode}
							selectionCoords={selectionCoords}
							onDeleteSelected={() => this.editorController.doSelectionModeIfSelected(SelectionMode.Delete)}
							onCloneSelected={() => this.editorController.doSelectionModeIfSelected(SelectionMode.Clone)}
							onTeleportSelected={() => this.editorController.doSelectionModeIfSelected(SelectionMode.Teleport)}
							onBuildSelected={() => this.editorController.buildMode(BuildMode.Build)}
							onFlySelected={() => this.editorController.buildMode(BuildMode.Fly)}
							onFreecamSelected={() => this.editorController.buildMode(BuildMode.Freecam)}
						/>
					</screengui>
					<screengui Name="Windows" IgnoreGuiInset ResetOnSpawn={false}>
						{this.windowsController.render()}
					</screengui>
				</>
			);
		}, playerGui);
	}

	/** @hidden */
	renderDevPanelDropdown(): void {
		Iris.SeparatorText([`State: ${UIState[this.state()]}`]);

		Iris.SameLine([]);
		for (const state of UISTATE_AS_VALUES) {
			if (Iris.Button([UIState[state]]).clicked()) {
				this.state(state);
			}
		}
		Iris.End();

		Iris.SeparatorText([`Theme: ${read(currentTheme()).name} (User: ${userTheme().name})`]);

		Iris.SameLine([]);
		for (const theme of THEMES) {
			if (Iris.Button([theme.name]).clicked()) {
				userTheme(theme);
			}
		}
		Iris.End();
	}
}
