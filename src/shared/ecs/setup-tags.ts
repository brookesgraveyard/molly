import { AnyEntity, World } from "@rbxts/matter";
import { CollectionService } from "@rbxts/services";

import { Attributes, Model } from "./components";
import { ComponentConstructor } from "./types";

function spawnBound(world: World, instance: Instance, component: ComponentConstructor, idAttributeName: string) {
	const id = world.spawn(component(), Model({ instance }), Attributes(instance.GetAttributes() as never));
	instance.SetAttribute(idAttributeName, id);
}

export function setupTags(world: World, idAttributeName: string, tagToComponent: Record<string, ComponentConstructor>) {
	for (const [tag, component] of pairs(tagToComponent)) {
		for (const instance of CollectionService.GetTagged(tag)) {
			spawnBound(world, instance, component, idAttributeName);
		}
		CollectionService.GetInstanceAddedSignal(tag).Connect((instance) =>
			spawnBound(world, instance, component, idAttributeName)
		);
		CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
			const id = instance.GetAttribute<number>(idAttributeName);
			if (id) world.despawn(id as AnyEntity);
		});
	}
}
