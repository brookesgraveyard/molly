import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";
import { ThemePreview } from "ui/theme";

import { EditorNav } from "./nav";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			enabled: true,
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("EditorNav.story");
		return (
			<ThemePreview
				align="bl"
				render={() => (
					<EditorNav
						onReturn={() => logger.debug("Return!")}
						enabled={controls.enabled}
					/>
				)}
			/>
		);
	},
);
