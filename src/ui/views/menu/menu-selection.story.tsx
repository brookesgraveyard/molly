import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";
import { ThemePreview } from "ui/theme";

import { MenuSelection } from "./menu-selection";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			enabled: true,
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("MenuSelection.story");
		return (
			<ThemePreview
				fillDirection="y"
				render={() => (
					<MenuSelection
						enabled={controls.enabled}
						onInfo={() => logger.debug("Info!")}
						onDonate={() => logger.debug("Donate!")}
						onStats={() => logger.debug("Stats!")}
						onSettings={() => logger.debug("Settings!")}
					/>
				)}
			/>
		);
	},
);
