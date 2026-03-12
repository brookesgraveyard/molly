import Object from "@rbxts/object-utils";
import { Choose, CreateVideStory, Slider } from "@rbxts/ui-labs";
import Vide, { effect, source } from "@rbxts/vide";
import { BuildMode, SelectionMode } from "shared/constants/editor";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";
import { ThemePreview } from "ui/theme";

import { Toolbar } from "./toolbar";

const selectionModeKeys = Object.keys(SelectionMode);
const buildModeKeys = Object.keys(BuildMode);

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			enabled: true,
			showSelectionSize: true,
			selectionSizeX: Slider(0, -100, 100, 0.25),
			selectionSizeY: Slider(0, -100, 100, 0.25),
			selectionSizeZ: Slider(0, -100, 100, 0.25),
			selectionMode: Choose(selectionModeKeys, selectionModeKeys.indexOf("Selection") + 1),
			buildMode: Choose(buildModeKeys, buildModeKeys.indexOf("Build") + 1),
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("Toolbar.story");
		const buildMode = source(controls.buildMode());
		effect(() => buildMode(controls.buildMode()));

		return (
			<ThemePreview
				fillDirection="y"
				align="bm"
				render={() => (
					<Toolbar
						enabled={controls.enabled}
						selectionCoords={() => {
							return controls.showSelectionSize()
								? new Vector3(controls.selectionSizeX(), controls.selectionSizeY(), controls.selectionSizeZ())
								: undefined;
						}}
						selectionMode={() => SelectionMode[controls.selectionMode()]}
						buildMode={() => BuildMode[buildMode()]}
						onDeleteSelected={() => logger.debug("Delete!")}
						onCloneSelected={() => logger.debug("Clone!")}
						onTeleportSelected={() => logger.debug("Teleport!")}
						onBuildSelected={() => buildMode("Build")}
						onFlySelected={() => buildMode("Fly")}
						onFreecamSelected={() => buildMode("Freecam")}
					/>
				)}
			/>
		);
	},
);
