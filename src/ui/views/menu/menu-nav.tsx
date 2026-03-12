import Vide, { Derivable, effect, read } from "@rbxts/vide";
import { closeWindow } from "client/controllers/windows";
import { icons } from "shared/generated/spritesheets";
import { Button } from "ui/components/controls/button";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

import { SettingsWindow } from "../windows/settings";

export interface MenuNavProps {
	enabled?: Derivable<boolean>;
	onReturn: () => void;
}

export function MenuNav({ enabled, onReturn }: MenuNavProps) {
	effect(() => read(enabled) && closeWindow(SettingsWindow));

	return (
		<HorizontalCollapsingNav
			name="MenuNav"
			enabled={enabled}
			align="bl"
			render={(transparency) => (
				<>
					<Padding padding={wrapRemUDim(0.75)} />
					<ListY padding={wrapRemUDim(0.75)} align="bl" />
					<Button
						name="Return"
						icon={icons.filled.arrow_back}
						color={Colors.inverted}
						transparency={transparency}
						onActivated={onReturn}
					/>
				</>
			)}
		/>
	);
}
