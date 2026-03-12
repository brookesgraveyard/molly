import { Choose, CreateVideStory, RGBA } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { getIcon, listIcons } from "shared/utils/icons";
import { rem, useRem } from "ui/rem";

import { Icon } from "./icon";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			icon: Choose(listIcons(), 1),
			rgba: RGBA(new Color3(1, 1, 1), 0),
		},
	},
	({ controls }) => {
		useRem();
		return (
			<Icon
				src={() => getIcon(controls.icon())}
				color={() => controls.rgba().Color}
				transparency={() => controls.rgba().Transparency}
				position={UDim2.fromScale(0.5, 0.5)}
				size={() => UDim2.fromOffset(rem(7), rem(7))}
				anchorPoint={new Vector2(0.5, 0.5)}
			/>
		);
	},
);
