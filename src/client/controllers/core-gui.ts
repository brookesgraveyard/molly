import { Controller, OnInit, OnStart } from "@flamework/core";
import { atom, effect } from "@rbxts/charm";
import Iris from "@rbxts/iris";
import { GuiService, StarterGui, StarterPlayer, UserInputService } from "@rbxts/services";
import { retryInfinitelyWithExponentialBackoff } from "shared/utils/retry";

import { DevPanelDropdown } from "./devpanel";

function setCoreGuiEnabled(guiType: Enum.CoreGuiType, enabled: boolean) {
	StarterGui.SetCoreGuiEnabled(guiType, enabled);
}

@Controller()
export class CoreGuiController implements OnInit, OnStart, DevPanelDropdown {
	readonly isGamepad = atom(false);

	/** @hidden */
	onInit() {
		StarterPlayer.UserEmotesEnabled = false;

		this.isGamepad(UserInputService.PreferredInput === Enum.PreferredInput.Gamepad);
		UserInputService.GetPropertyChangedSignal("PreferredInput").Connect(() =>
			this.isGamepad(UserInputService.PreferredInput === Enum.PreferredInput.Gamepad)
		);

		effect(() => {
			GuiService.GuiNavigationEnabled = this.isGamepad();
		});
	}

	/** @hidden */
	onStart() {
		retryInfinitelyWithExponentialBackoff(5, 1.5, setCoreGuiEnabled, Enum.CoreGuiType.EmotesMenu, false);
	}

	/** @hidden */
	renderDevPanelDropdown(): void {
		Iris.Text([`Is Gamepad: ${this.isGamepad()}`]);
	}
}
