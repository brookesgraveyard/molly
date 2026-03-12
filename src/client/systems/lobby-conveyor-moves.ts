import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { Players, Workspace } from "@rbxts/services";
import { Analytics } from "client/generated/blink";
import { Attributes, LobbyConveyorSegment, Model } from "shared/ecs/components";
import { State, System } from "shared/ecs/types";

const SPEED = 40;
const ANGULAR_ASSIST_STRENGTH = 1.5;
const ASSIST_STRENGTH = 0.25;

function lobbyConveyorMoves(world: World, _: State, ui: Widgets) {
	const oldRaycast = ui.checkbox("Use old raycasting").checked();

	const character = Players.LocalPlayer.Character;
	if (!character) return;

	const primary = character.PrimaryPart;
	if (!primary || math.abs(primary.Position.Z) > 10) return;

	const params = new OverlapParams();
	if (!oldRaycast) {
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = [character];
		params.MaxParts = 1;
	}
	for (const [, , instance, { Angular }] of world.query(LobbyConveyorSegment, Model, Attributes)) {
		const segment = instance.instance as BasePart;

		if (Workspace.GetPartsInPart(segment, params)[0]) {
			Analytics.RodeLobbyConveyor.fire();

			const ppos = primary.Position.mul(new Vector3(1, 0, 1));
			const apos = segment.CFrame.ToWorldSpace(segment.PivotOffset).Position.mul(new Vector3(1, 0, 1));

			if (Angular) {
				const offset = ppos.sub(apos);
				const radial = offset.Unit;
				const toCenter = offset.mul(-1).Unit;
				const distance = offset.Magnitude;

				// push the player towards the center (more agressive)
				const assist = toCenter.mul(distance * ANGULAR_ASSIST_STRENGTH);
				primary.AssemblyLinearVelocity = new Vector3(-radial.Z, 0, radial.X).mul(SPEED).add(assist);
			} else {
				const diff = ppos.sub(apos).mul(new Vector3(0, 0, 1));
				const assist = diff.mul(-1).mul(ASSIST_STRENGTH);

				// push the player towards the center (lightly)
				primary.AssemblyLinearVelocity = segment.CFrame.LookVector.mul(SPEED).add(assist);
			}
			break;
		}
	}
}

export = lobbyConveyorMoves satisfies System;
