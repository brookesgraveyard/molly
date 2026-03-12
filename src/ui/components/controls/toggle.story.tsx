import { CreateVideStory } from "@rbxts/ui-labs";
import Vide, { derive, source } from "@rbxts/vide";
import { useRem } from "ui/rem";
import { ThemePreview } from "ui/theme";

import { VideToggle } from "./toggle";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			value: false,
		},
	},
	({ controls }) => {
		useRem();

		const value = source(controls.value());
		derive(() => value(controls.value()));
		return (
			<ThemePreview
				render={() => (
					<VideToggle
						source={value}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
					/>
				)}
			/>
		);
	},
);
