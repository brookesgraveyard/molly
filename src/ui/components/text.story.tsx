import { CreateVideStory, RGBA, Slider } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { uiLabsChooseAlign2d } from "ui/align-2d";

import { Text } from "./text";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			text: "I have a dream that one day on the red hills of <b>Obby Creator</b>, the sons of former "
				+ "<b>Builders</b> will be able to sit down together at the table of Obby Creator Music. "
				+ "I have a dream that one day even the state of <b>Roblox</b>, a state sweltering with"
				+ "the heat of <b>Silence</b>, sweltering with the heat of oppression will be "
				+ "transformed into an oasis of freedom and <b>Music</b>.",
			rgba: RGBA(new Color3(1, 1, 1), 0),
			textSize: Slider(12, 6, 32, 2),
			wrap: true,
			rich: true,
			align: uiLabsChooseAlign2d("Middle"),
		},
	},
	({ controls }) => {
		return (
			<Text
				text={controls.text}
				color={() => controls.rgba().Color}
				transparency={() => controls.rgba().Transparency}
				textSize={controls.textSize}
				wrap={controls.wrap}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
				align={controls.align}
				rich={controls.rich}
			/>
		);
	},
);
