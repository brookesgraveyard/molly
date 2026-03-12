import { Choose, CreateVideStory, RGBA } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { getIcon, listIcons } from "shared/utils/icons";
import { useRem } from "ui/rem";

import { ToolbarButton } from "./toolbar-button";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			rgba: RGBA(new Color3(1, 1, 1), 0),
			icon: Choose(listIcons(), 1),
			bouncy: false,
			state: false,
		},
	},
	({ controls }) => {
		useRem();
		return (
			<ToolbarButton
				name={() => controls.bouncy() ? `ToolbarButton-${controls.state()}` : "ToolbarButton"}
				icon={() => getIcon(controls.icon())}
				color={() => controls.rgba().Color}
				bouncy={controls.bouncy}
				visibility={() => controls.rgba().Transparency}
			/>
		);
	},
);
