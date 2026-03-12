import { Array } from "@rbxts/sift";
import { CreateVideStory, Slider } from "@rbxts/ui-labs";
import Vide, { For } from "@rbxts/vide";
import { useInputListener } from "shared/utils/vide/maus";
import { useRem } from "ui/rem";

import { WindowCore } from ".";

const windows = [
	"Family",
	"Guy",
	"Funny",
	"Moments",
	"Compilation",
	"BREAKING NEWS",
];

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			windows: Slider(2, 1, 6, 1),
		},
	},
	({ controls, target, inputListener }) => {
		useInputListener(inputListener, target);
		useRem();

		return (
			<For each={() => Array.slice(windows, 1, controls.windows())}>
				{(name, i) => <WindowCore name={name} enabled />}
			</For>
		);
	},
);
