import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { useRem } from "ui/rem";

import { SettingsWindow } from "./settings";

export = CreateVideStory({
	vide: Vide,
	controls: {
		show: true,
	},
}, ({ controls }) => {
	useRem();
	return <SettingsWindow show={controls.show} />;
});
