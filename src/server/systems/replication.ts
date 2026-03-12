import { useEvent, World } from "@rbxts/matter";
import Object from "@rbxts/object-utils";
import { Players } from "@rbxts/services";
import { Ecs } from "server/generated/blink";
import { REPLICATED_COMPONENTS } from "shared/ecs/components";
import { System } from "shared/ecs/types";

const REPLICATED_COMPONENTS_SET = new Set(Object.values(REPLICATED_COMPONENTS));
const REPLICATED_COMPONENTS_TO_NAME = new Map(
	Object.entries(REPLICATED_COMPONENTS).map(([key, component]) => [component, key] as const),
);

function replication(world: World) {
	// replicate to late players
	for (const [, player] of useEvent(Players, "PlayerAdded")) {
		const initial = new Map<number, Map<string, { delta: unknown }>>();

		for (const [id, record] of world) {
			const deltas = new Map<string, { delta: unknown }>();

			for (const [component, delta] of pairs(record)) {
				if (REPLICATED_COMPONENTS_SET.has(component)) {
					deltas.set(REPLICATED_COMPONENTS_TO_NAME.get(component)! as never, { delta });
				}
			}

			initial.set(id, deltas);
		}

		Ecs.ReplicateComponents.fire(player, initial);
	}

	// replicate deltas
	const changes = new Map<number, Map<string, { delta: unknown }>>();
	// eslint-disable-next-line roblox-ts/no-array-pairs
	for (const [key, component] of pairs(REPLICATED_COMPONENTS)) {
		for (const [id, delta] of world.queryChanged(component)) {
			if (world.contains(id)) {
				let componentToDeltas = changes.get(id)!;
				if (!componentToDeltas) {
					const newDeltas = new Map<string, { delta: unknown }>();
					changes.set(id, newDeltas);
					componentToDeltas = newDeltas;
				}
				componentToDeltas.set(key as never, { delta });
			}
		}
	}

	if (next(changes)[0]) {
		Ecs.ReplicateComponents.fireAll(changes);
	}
}

export = {
	system: replication,
	// We set the system priority to infinity so that it always runs last, at
	// the end of the frame.
	priority: math.huge,
} satisfies System;
