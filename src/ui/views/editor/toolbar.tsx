import Vide, { Derivable, derive, effect, read, source } from "@rbxts/vide";
import { openWindow } from "client/controllers/windows";
import { BuildMode, SelectionMode } from "shared/constants/editor";
import { icons } from "shared/generated/spritesheets";
import { delay } from "shared/utils/vide/delay";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { Text } from "ui/components/text";
import { rem, wrapRem, wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

import { SettingsWindow } from "../windows/settings";
import { BuildModes, BuildModesProps } from "./build-modes";
import { ToolbarButton } from "./toolbar-button";

export interface ToolbarProps extends BuildModesProps {
	name?: Derivable<string>;

	enabled?: Derivable<boolean>;

	selectionCoords?: Derivable<Maybe<Vector3>>;
	selectionMode?: Derivable<SelectionMode>;
	buildMode?: Derivable<BuildMode>;

	onDeleteSelected?: () => void;
	onCloneSelected?: () => void;
	onTeleportSelected?: () => void;
}

const TOOL_PADDING_IN_REM = 0.25;
const TOOL_WIDTH_IN_REM = 4;
const TOOL_FULL_WIDTH_IN_REM = TOOL_WIDTH_IN_REM + TOOL_PADDING_IN_REM * 2;
const TOOL_SECTION_HEIGHT_IN_REM = TOOL_WIDTH_IN_REM + TOOL_PADDING_IN_REM * 2;

export function Toolbar({
	name = "ToolbarView",

	enabled = true,

	selectionCoords,
	selectionMode = SelectionMode.Selection,
	buildMode = BuildMode.Build,

	onDeleteSelected,
	onCloneSelected,
	onTeleportSelected,

	onBuildSelected,
	onFlySelected,
	onFreecamSelected,
}: ToolbarProps) {
	const buildModesOpen = source(false);
	effect(() => {
		read(enabled);
		buildModesOpen(false);
	});

	const coords = derive(() => {
		const mode = read(selectionMode);
		const vector = read(selectionCoords);
		if (!vector) return;

		const coords = `${vector.X}, ${vector.Y}, ${vector.Z}`;
		switch (mode) {
			case SelectionMode.Move:
				return `Position: ${coords}`;
			case SelectionMode.Rotate:
				return `Rotation: ${coords}`;
			case SelectionMode.Scale:
				return `Size: ${coords}`;
			default:
				return;
		}
	});

	return (
		<HorizontalCollapsingNav
			name={name}
			enabled={enabled}
			align="bm"
			size={UDim2.fromScale(1, 0)}
			automaticSize={Enum.AutomaticSize.Y}
			render={(transparency) => (
				<>
					<ListY align="tm" padding={wrapRemUDim(0.25)} />
					<Text
						name="Size"
						text={() => coords() ?? ""}
						color={Colors.floating}
						visible={() => coords() !== undefined}
						textSize={wrapRem(2)}
						transparency={transparency}
					>
						<uistroke Color={new Color3()} />
					</Text>
					<Text
						name="Mode"
						text={() => {
							switch (read(selectionMode)) {
								case SelectionMode.Delete:
									return "Mode: Delete";
								case SelectionMode.Clone:
									return "Mode: Clone";
								case SelectionMode.Teleport:
									return "Mode: Teleport";
								case SelectionMode.Move:
									return "Mode: Move";
								case SelectionMode.Rotate:
									return "Mode: Rotate";
								case SelectionMode.Scale:
									return "Mode: Scale";
								default:
									return "Mode: Selection";
							}
						}}
						color={() => {
							switch (read(selectionMode)) {
								case SelectionMode.Delete:
									return read(Colors.red);
								case SelectionMode.Teleport:
									return read(Colors.blue);
								default:
									return read(Colors.floating);
							}
						}}
						textSize={wrapRem(2)}
						transparency={transparency}
					>
						<uistroke Color={new Color3()} />
					</Text>
					<frame
						Name="Toolbar"
						BackgroundTransparency={1}
						Size={() => new UDim2(1, 0, 0, rem(TOOL_SECTION_HEIGHT_IN_REM))}
					>
						<uiaspectratioconstraint AspectRatio={10} />
						<Padding padding={wrapRemUDim(0.25)} />

						<ToolbarButton
							name="Settings"
							icon={icons.filled.settings}
							position={() =>
								new UDim2(
									0.5,
									-rem(TOOL_FULL_WIDTH_IN_REM * 2),
									0.5,
									-rem(TOOL_PADDING_IN_REM),
								)}
							color={Colors.inverted}
							onActivated={() => openWindow(SettingsWindow)}
							visibility={transparency}
						/>
						<ToolbarButton
							name="Delete"
							icon={icons.filled.delete}
							color={Colors.red}
							position={() =>
								new UDim2(
									0.5,
									-rem(TOOL_FULL_WIDTH_IN_REM),
									0.5,
									-rem(TOOL_PADDING_IN_REM),
								)}
							onActivated={onDeleteSelected}
							visibility={delay(0.025, transparency)}
						/>
						<ToolbarButton
							name="Clone"
							icon={icons.filled.content_copy}
							color={Colors.inverted}
							position={() => new UDim2(0.5, 0, 0.5, -rem(TOOL_PADDING_IN_REM))}
							onActivated={onCloneSelected}
							visibility={delay(0.05, transparency)}
						/>
						<ToolbarButton
							name="Teleport"
							icon={icons.filled.location_on}
							color={Colors.blue}
							position={() =>
								new UDim2(
									0.5,
									rem(TOOL_FULL_WIDTH_IN_REM),
									0.5,
									-rem(TOOL_PADDING_IN_REM),
								)}
							onActivated={onTeleportSelected}
							visibility={delay(0.075, transparency)}
						/>
						<ToolbarButton
							name={() => BuildMode[read(buildMode)]}
							icon={() => {
								switch (read(buildMode)) {
									case BuildMode.Freecam:
										return icons.filled.photo_camera;
									case BuildMode.Fly:
										return icons.filled.flight;
									default:
										return icons.filled.construction;
								}
							}}
							color={Colors.green}
							position={() =>
								new UDim2(
									0.5,
									rem(TOOL_FULL_WIDTH_IN_REM * 2),
									0.5,
									-rem(TOOL_PADDING_IN_REM),
								)}
							onActivated={() => buildModesOpen(!buildModesOpen())}
							visibility={delay(0.1, transparency)}
							bouncy
						/>
						<frame
							BackgroundTransparency={1}
							Position={() =>
								new UDim2(
									0.5,
									rem(TOOL_FULL_WIDTH_IN_REM * 2.5) + rem(TOOL_PADDING_IN_REM),
									1,
									-rem(TOOL_PADDING_IN_REM),
								)}
							AnchorPoint={new Vector2(0, 1)}
							Size={UDim2.fromScale(1, 1)}
						>
							<BuildModes
								enabled={buildModesOpen}
								onBuildSelected={() => {
									buildModesOpen(false);
									onBuildSelected?.();
								}}
								onFlySelected={() => {
									buildModesOpen(false);
									onFlySelected?.();
								}}
								onFreecamSelected={() => {
									buildModesOpen(false);
									onFreecamSelected?.();
								}}
							/>
						</frame>
					</frame>
				</>
			)}
		/>
	);
}
