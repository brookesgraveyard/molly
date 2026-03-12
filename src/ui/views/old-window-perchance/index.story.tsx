import { CreateVideStory, Slider } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { useInputListener } from "shared/utils/vide/maus";
import { uiLabsChooseAlign2d } from "ui/align-2d";
import { useRem } from "ui/rem";

import { WindowCore } from ".";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			name: "Window",
			enabled: true,
			width: Slider(65, 5, 80, 1),
			height: Slider(38, 5, 80, 1),
			alignment: uiLabsChooseAlign2d("Middle"),
		},
	},
	({ controls, target, inputListener }) => {
		useInputListener(inputListener, target);
		useRem();
		return (
			<WindowCore
				name={controls.name}
				enabled={controls.enabled}
				width={controls.width()}
				height={controls.height()}
				alignment={controls.alignment()}
			/>
		);
	},
);
