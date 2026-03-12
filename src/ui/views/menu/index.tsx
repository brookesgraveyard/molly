import { effect, read, source, spring } from "@rbxts/vide";
import Vide from "@rbxts/vide";
import { openWindow } from "client/controllers/windows";
import { Analytics } from "client/generated/blink";
import { Blur } from "ui/components/effects/blur";
import { ZoomMod } from "ui/components/effects/zoom";

import { SettingsWindow } from "../windows/settings";
import { MenuNav, MenuNavProps } from "./menu-nav";
import { MenuSelection } from "./menu-selection";

enum Page {
	Selection = "Selection",
	Info = "info",
	Donate = "Donate",
	Stats = "stats",
}

export function Menu({
	enabled = true,

	onReturn,
}: MenuNavProps) {
	const page = source(Page.Selection);

	effect(() => {
		if (page() === Page.Info) Analytics.OpenedInfo.fire();
		else if (page() === Page.Donate) Analytics.OpenedDonate.fire();
		else if (page() === Page.Stats) Analytics.OpenedStats.fire();
	});

	return (
		<>
			<Blur name="MenuBlur" size={spring(() => read(enabled) ? 20 : 0, 0.5)} />
			<ZoomMod scale={spring(() => read(enabled) ? 0.8 : 1, 0.5)} />

			<MenuNav
				enabled={enabled}
				onReturn={() => {
					if (page() === Page.Selection) onReturn();
					else page(Page.Selection);
				}}
			/>
			<MenuSelection
				enabled={() => read(enabled) && page() === Page.Selection}
				onInfo={() => page(Page.Info)}
				onDonate={() => page(Page.Donate)}
				onStats={() => page(Page.Stats)}
				onSettings={() => {
					onReturn();
					openWindow(SettingsWindow);
				}}
			/>
		</>
	);
}
