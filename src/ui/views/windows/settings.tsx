import Vide, { source } from "@rbxts/vide";
import { WindowIDProps } from "client/controllers/windows";
import { icons } from "shared/generated/spritesheets";
import { VideToggle } from "ui/components/controls/toggle";
import { Inline } from "ui/components/layouts/inline";
import { Page } from "ui/components/layouts/page";
import { Text } from "ui/components/text";
import { Window } from "ui/components/window";
import { remUdim } from "ui/rem";

export function SettingsWindow({ show }: WindowIDProps) {
	return (
		<Window title="Settings" icon={icons.filled.settings} show={show}>
			{(transparency) => (
				<Page padding={remUdim(0.5)}>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="The get tortured in hell forever setting" transparency={transparency} />
						<VideToggle source={source(false)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="The get banned setting" transparency={transparency} />
						<VideToggle source={source(true)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="Snap to grid" transparency={transparency} />
						<VideToggle source={source(false)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="Grid to snap" transparency={transparency} />
						<VideToggle source={source(true)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="Make the game worse by 100x" transparency={transparency} />
						<VideToggle source={source(false)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="Remove all code from game" transparency={transparency} />
						<VideToggle source={source(true)} transparency={transparency} />
					</Inline>
					<Inline flex={Enum.UIFlexAlignment.SpaceBetween}>
						<Text text="table: 0xef7fad9c97d6dadc" transparency={transparency} />
						<VideToggle source={source(false)} transparency={transparency} />
					</Inline>
				</Page>
			)}
		</Window>
	);
}
