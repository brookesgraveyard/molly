import { Choose, CreateVideStory, RGBA } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { getIcon, listIcons } from "shared/utils/icons";
import { useRem } from "ui/rem";

import { Callout } from "./callout";
import { Text } from "./text";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			icon: Choose(listIcons(), 1),
			rgba: RGBA(new Color3(1, 1, 1), 0),
			content: "I have a dream that one day on the red hills of <b>Obby Creator</b>, the sons of former "
				+ "<b>Builders</b> will be able to sit down together at the table of Obby Creator Music. "
				+ "I have a dream that one day even the state of <b>Roblox</b>, a state sweltering with"
				+ "the heat of <b>Silence</b>, sweltering with the heat of oppression will be "
				+ "transformed into an oasis of freedom and <b>Music</b>.",
		},
	},
	({ controls }) => {
		useRem();
		return (
			<Callout
				icon={() => getIcon(controls.icon())}
				color={() => controls.rgba().Color}
				transparency={() => controls.rgba().Transparency}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
			>
				<Text
					color={() => controls.rgba().Color}
					transparency={() => controls.rgba().Transparency}
					text={controls.content}
					rich
				/>
			</Callout>
		);
	},
);
