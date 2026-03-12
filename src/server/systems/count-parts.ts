import { World } from "@rbxts/matter";
import { partCount } from "shared/atoms";
import { Part } from "shared/ecs/components";
import { System } from "shared/ecs/types";

function countParts(world: World) {
	let count = 0;
	for (const _ of world.query(Part)) count += 1;
	partCount(count);
}

export = countParts satisfies System;
