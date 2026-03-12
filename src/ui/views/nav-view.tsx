import Vide, { Derivable } from "@rbxts/vide";
import { icons } from "shared/generated/spritesheets";
import { Button } from "ui/components/controls/button";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

export interface NavViewProps {
	onEdit: () => void;
	onMenu: () => void;
	enabled?: Derivable<boolean>;
}

export function NavView({ onEdit, onMenu, enabled }: NavViewProps) {
	return (
		<HorizontalCollapsingNav
			name="NavView"
			enabled={enabled}
			align="bl"
			render={(transparency) => (
				<>
					<Padding padding={wrapRemUDim(0.75)} />
					<ListY padding={wrapRemUDim(0.75)} align="bl" />
					<Button
						name="Menu"
						icon={icons.filled.menu}
						color={Colors.inverted}
						transparency={transparency}
						onActivated={onMenu}
					/>
					<Button
						name="Edit"
						icon={icons.filled.construction}
						label="Edit Mode"
						color={Colors.green}
						transparency={transparency}
						onActivated={onEdit}
					/>
				</>
			)}
		/>
	);
}
