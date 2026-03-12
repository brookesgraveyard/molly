import Vide from "@rbxts/vide";

import { EditorNav, EditorNavProps } from "./nav";
import { Toolbar, ToolbarProps } from "./toolbar";

export interface EditorProps extends EditorNavProps, ToolbarProps {}

export function Editor({
	enabled = true,

	onReturn,

	selectionMode,
	buildMode,
	selectionCoords: selectionSize,

	onDeleteSelected,
	onCloneSelected,
	onTeleportSelected,
	onBuildSelected,
	onFlySelected,
	onFreecamSelected,
}: EditorProps) {
	return (
		<>
			<EditorNav enabled={enabled} onReturn={onReturn} />
			<Toolbar
				enabled={enabled}
				selectionMode={selectionMode}
				buildMode={buildMode}
				selectionCoords={selectionSize}
				onDeleteSelected={onDeleteSelected}
				onCloneSelected={onCloneSelected}
				onTeleportSelected={onTeleportSelected}
				onBuildSelected={onBuildSelected}
				onFlySelected={onFlySelected}
				onFreecamSelected={onFreecamSelected}
			/>
		</>
	);
}
