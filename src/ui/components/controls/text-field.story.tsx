import { CreateVideStory, RGBA, Slider } from "@rbxts/ui-labs";
import Vide, { source } from "@rbxts/vide";
import { useRem, wrapRemUdim2 } from "ui/rem";

import { TextField } from "./text-field";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			placeholder: "Type to search potential victims...",
			bgColor: RGBA(Color3.fromHSV(200 / 360, 1, 0.25), 0),
			textColor: Color3.fromHSV(200 / 360, 1, 1),
			focusRingColor: Color3.fromHSV(200 / 360, 1, 1),
			roundScale: Slider(0, 0, 1, 0.1),
			roundPx: Slider(4, 0, 16, 2),
			textSize: Slider(14, 0, 32, 8),
		},
	},
	({ controls }) => {
		useRem();

		function round() {
			return new UDim(controls.roundScale(), controls.roundPx());
		}

		const text = source("");

		return (
			<TextField
				text={text}
				textSize={controls.textSize}
				placeholderText={controls.placeholder}
				onInput={text}
				bgColor={() => controls.bgColor().Color}
				textColor={controls.textColor}
				focusRingColor={controls.focusRingColor}
				transparency={() => controls.bgColor().Transparency}
				round={round}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={wrapRemUdim2(32, 4)}
			/>
		);
	},
);
