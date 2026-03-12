import Vide, { Derivable } from "@rbxts/vide";
import { openWindow } from "client/controllers/windows";
import { icons } from "shared/generated/spritesheets";
import { Button } from "ui/components/controls/button";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

import { AddPartWindow } from "../windows/add-part";

export interface EditorNavProps {
	enabled?: Derivable<boolean>;
	onReturn: () => void;
}

export function EditorNav({ enabled, onReturn }: EditorNavProps) {
	return (
		<HorizontalCollapsingNav
			name="EditNav"
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
					<Button
						name="Add"
						icon={icons.filled.add}
						label="Add"
						color={Colors.green}
						transparency={transparency}
						onActivated={() => openWindow(AddPartWindow)}
					/>
				</>
			)}
		/>
	);
}
