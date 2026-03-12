import { None, useEvent, World } from "@rbxts/matter";
import { Attributes, Model } from "shared/ecs/components";
import { System } from "shared/ecs/types";

function updateAttributes(world: World) {
	for (const [id, { instance }, attributes] of world.query(Model, Attributes)) {
		const patch: Record<string, unknown> = {};
		for (const [, attribute] of useEvent(instance, "AttributeChanged")) {
			patch[attribute] = instance.GetAttribute(attribute) ?? None;
		}
		world.insert(id, attributes.patch(patch));
	}
}

export = updateAttributes satisfies System;
