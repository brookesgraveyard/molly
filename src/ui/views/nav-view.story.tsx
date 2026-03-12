import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";
import { ThemePreview } from "ui/theme";

import { NavView } from "./nav-view";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			enabled: true,
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("NavView.story");
		return (
			<ThemePreview
				align="bl"
				render={() => (
					<NavView
						onEdit={() => logger.debug("Edit Mode!")}
						onMenu={() => logger.debug("Menu!")}
						enabled={controls.enabled}
					/>
				)}
			/>
		);
	},
);
