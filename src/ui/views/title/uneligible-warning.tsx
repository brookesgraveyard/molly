import Vide, { Derivable } from "@rbxts/vide";
import { icons } from "shared/generated/spritesheets";
import { Callout } from "ui/components/callout";
import { Text } from "ui/components/text";
import { Colors } from "ui/theme";

export interface UneligibleWarningProps {
	transparency?: Derivable<number>;
}

export function UneligibleWarning({ transparency }: UneligibleWarningProps) {
	return (
		<Callout icon={icons.filled.warning} color={Colors.red} transparency={transparency}>
			<Text
				text="You need the 5 likes badge to contribute in OCPlace!"
				color={Colors.red}
				transparency={transparency}
			/>
		</Callout>
	);
}
