import { World } from "@rbxts/matter";
import { PartModel } from "shared/ecs/components";
import { System } from "shared/ecs/types";

function removeDespawnedParts(world: World) {
	for (const [, model] of world.queryChanged(PartModel)) {
		if (model.new === undefined && model.old) {
			model.old.part.Destroy();
		}
	}
}

export = removeDespawnedParts satisfies System;
