import Vide from "@rbxts/vide";
import { Derivable } from "@rbxts/vide";
import { icons } from "shared/generated/spritesheets";
import { delay } from "shared/utils/vide/delay";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListX } from "ui/components/styles/list";
import { rem, wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

import { ToolbarButton } from "./toolbar-button";

const MODE_PADDING_IN_REM = 0.25;
const MODE_WIDTH_IN_REM = 3;
const MODE_FULL_WIDTH_IN_REM = MODE_WIDTH_IN_REM + MODE_PADDING_IN_REM * 2;

export interface BuildModesProps {
	enabled?: Derivable<boolean>;

	onBuildSelected?: () => void;
	onFlySelected?: () => void;
	onFreecamSelected?: () => void;
}

export function BuildModes({
	enabled = false,

	onBuildSelected,
	onFlySelected,
	onFreecamSelected,
}: BuildModesProps) {
	return (
		<HorizontalCollapsingNav
			name="BuildModes"
			enabled={enabled}
			align="ml"
			size={UDim2.fromScale(1, 0.8)}
			automaticSize={Enum.AutomaticSize.Y}
			render={(transparency) => (
				<>
					<ListX align="ml" padding={wrapRemUDim(0.5)} />

					<ToolbarButton
						name="Build"
						icon={icons.filled.construction}
						color={Colors.green}
						position={() => new UDim2(0, 0, 0.5, 0)}
						onActivated={onBuildSelected}
						visibility={transparency}
					/>
					<ToolbarButton
						name="Fly"
						icon={icons.filled.flight}
						color={Colors.green}
						position={() => new UDim2(0, rem(MODE_FULL_WIDTH_IN_REM), 0.5, 0)}
						onActivated={onFlySelected}
						visibility={delay(0.05, transparency)}
					/>
					<ToolbarButton
						name="Freecam"
						icon={icons.filled.photo_camera}
						color={Colors.green}
						position={() => new UDim2(0, rem(MODE_FULL_WIDTH_IN_REM * 2), 0.5, 0)}
						onActivated={onFreecamSelected}
						visibility={delay(0.1, transparency)}
					/>
				</>
			)}
		/>
	);
}
