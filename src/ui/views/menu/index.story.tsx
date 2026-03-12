import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";

import { Menu } from "./index";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			enabled: true,
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("Menu.story");
		return (
			<Menu
				enabled={controls.enabled}
				onReturn={() => logger.debug("Return!")}
			/>
		);
	},
);
