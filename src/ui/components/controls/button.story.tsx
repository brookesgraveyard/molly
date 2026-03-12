import { Choose, CreateVideStory, RGBA } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { getIcon, listIcons } from "shared/utils/icons";
import { useRem } from "ui/rem";
import { Colors, ThemePreview } from "ui/theme";

import { Button } from "./button";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			label: "Call Airstrikes",
			icon: Choose(listIcons(), 1),
			rgba: RGBA(new Color3(0, 1, 1), 0),
		},
	},
	({ controls }) => {
		useRem();

		return (
			<ThemePreview
				render={() => (
					<Button
						label={controls.label}
						icon={() => getIcon(controls.icon())}
						color={Colors.blue}
						transparency={() => controls.rgba().Transparency}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
					/>
				)}
			/>
		);
	},
);
