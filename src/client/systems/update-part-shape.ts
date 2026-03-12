import { World } from "@rbxts/matter";
import { PartModel, Shape } from "shared/ecs/components";
import { System } from "shared/ecs/types";

function updatePartShape(world: World) {
	for (const [id, shape] of world.queryChanged(Shape)) {
		const newShape = shape.new;
		const partModel = world.get(id, PartModel);
		if (partModel && newShape) {
			const { part } = partModel;
			if (classIs(part, "Part")) part.Shape = newShape.shape;
		}
	}
}

export = updatePartShape satisfies System;
