import { Controller, Modding, OnStart } from "@flamework/core";
import Iris from "@rbxts/iris";
import { UserInputService, Workspace } from "@rbxts/services";
import { createLogger } from "shared/logger";

const MATTER_DEBUGGER_PANEL_WIDTH = 260;

export interface DevPanelDropdown {
	renderDevPanelDropdown(): void;
}

@Controller()
export class DevPanelController implements OnStart {
	private logger = createLogger("DevPanelController");

	/** @hidden */
	onStart(): void {
		const nameByDropdowns = new Map<DevPanelDropdown, string>();
		const devPanelDropdownControllers = new Array<DevPanelDropdown>();

		Modding.onListenerAdded<DevPanelDropdown>((obj) => {
			const name = tostring(getmetatable(obj));
			this.logger.trace("Adding DevPanelDropdown for", name);
			nameByDropdowns.set(obj, name);
			devPanelDropdownControllers.push(obj);
		});

		Modding.onListenerRemoved<DevPanelDropdown>((obj) => {
			this.logger.trace("Removing DevPanelDropdown for", nameByDropdowns.get(obj));
			nameByDropdowns.delete(obj);
			devPanelDropdownControllers.remove(devPanelDropdownControllers.indexOf(obj));
		});

		let isOpen = false;
		let hide = false;

		function sortByName(lhs: DevPanelDropdown, rhs: DevPanelDropdown) {
			return nameByDropdowns.get(lhs)! < nameByDropdowns.get(rhs)!;
		}

		Iris.Init();
		Iris.UpdateGlobalConfig(Iris.TemplateConfig.colorDark);
		Iris.UpdateGlobalConfig(Iris.TemplateConfig.sizeClear);
		Iris.UpdateGlobalConfig({
			IgnoreGuiInset: true,
		});

		this.logger.info("Connecting to Iris");
		Iris.Connect(() => {
			if (!isOpen) return;
			if (hide) {
				Iris.PushConfig({ WindowBorderSize: 0 });
				const window = Iris.Window(["Unhide Devpanel", true, true, true, true, true, true, true, true, true]);
				Iris.PopConfig();
				window.state.position.set(new Vector2(MATTER_DEBUGGER_PANEL_WIDTH, 0));
				const unhide = Iris.Button(["Unhide Devpanel"]);
				Iris.End();
				if (!unhide.clicked()) {
					return;
				}
				hide = false;
				window.state.isOpened.set(false);
			}

			const window = Iris.Window([
				"OCPlace Developer Panel",
				false,
				false,
				true, // disable collapse
				true, // disable closing
				true, // disable moving
				false, // keep scrollbar
				true, // disable resizing
			]);

			window.ZIndex = math.huge;
			window.state.position.set(new Vector2(MATTER_DEBUGGER_PANEL_WIDTH, 0));
			if (Workspace.CurrentCamera) {
				const viewportSize = Workspace.CurrentCamera.ViewportSize;
				window.state.size.set(viewportSize.sub(new Vector2(MATTER_DEBUGGER_PANEL_WIDTH, 0)));
			}

			if (Iris.Button(["Hide Devpanel"]).clicked()) {
				hide = true;
			} else {
				table.sort(devPanelDropdownControllers, sortByName);

				for (const controller of devPanelDropdownControllers) {
					Iris.Tree([nameByDropdowns.get(controller)!]);
					controller.renderDevPanelDropdown();
					Iris.End();
				}
			}

			Iris.End();
		});

		UserInputService.InputBegan.Connect((input, gc) => {
			if (!gc && input.KeyCode === Enum.KeyCode.Comma) {
				this.logger.trace("Toggling devpanel is open");
				hide = false;
				isOpen = !isOpen;
			}
		});
	}
}
