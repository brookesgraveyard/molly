import { Choose, CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { getIcon, listIcons } from "shared/utils/icons";
import { useRem } from "ui/rem";

import { Window } from "./window";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			show: true,
			title: "Window",
			icon: Choose(listIcons(), 1),
		},
	},
	({ controls }) => {
		useRem();

		return (
			<Window
				show={controls.show}
				title={controls.title}
				icon={() => getIcon(controls.icon())}
			/>
		);
	},
);
