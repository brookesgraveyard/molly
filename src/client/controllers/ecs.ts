import { Controller, OnInit } from "@flamework/core";
import { AnyComponent, World } from "@rbxts/matter";
import { ReplicatedStorage } from "@rbxts/services";
import { Ecs } from "client/generated/blink";
import { OnBlink } from "shared/decorators";
import { LobbyConveyorSegment, REPLICATED_COMPONENTS } from "shared/ecs/components";
import { setupTags } from "shared/ecs/setup-tags";
import { start } from "shared/ecs/start";
import { State } from "shared/ecs/types";
import { ComponentConstructor } from "shared/ecs/types";

@Controller({ loadOrder: -1 })
export class EcsController implements OnInit {
	world!: World;
	state!: State;
	serverToClientEntityIds = new Map<number, number>();

	@OnBlink(Ecs.ReplicateComponents)
	replicateComponents(entities: Map<number, Map<string, { delta: unknown }>>) {
		for (const [serverId, componentDeltas] of entities) {
			let clientId = this.serverToClientEntityIds.get(serverId);

			// If we've created this entity before, and there are no
			// components inside its list, that means the entity was
			// despawned on the server. We despawn it here too.
			if (clientId !== undefined && next(componentDeltas)[0] === undefined) {
				this.world.despawn(clientId as never);
				this.serverToClientEntityIds.delete(serverId);
				continue;
			}

			const toInsert = new Array<AnyComponent>();
			const toRemove = new Array<ComponentConstructor>();

			for (const [name, { delta }] of pairs(componentDeltas)) {
				const component = (REPLICATED_COMPONENTS as never as Map<string, ComponentConstructor>).get(name)!;
				// If delta exists, the component was either changed or
				// added.
				if (delta !== undefined) toInsert.push(component(delta!));
				// If it doesn't exist, it was removed!
				else toRemove.push(component);
			}

			if (clientId === undefined) {
				// We haven't created this entity on the client before.
				// Create it.
				clientId = this.world.spawn(...toInsert);
				this.serverToClientEntityIds.set(serverId, clientId);
			} else {
				// We've seen this entity before. Just insert or remove any
				// necessary components.
				if (toInsert.size() > 0) this.world.insert(clientId as never, ...toInsert);
				if (toRemove.size() > 0) this.world.remove(clientId as never, ...toRemove);
			}
		}
	}

	/** @hidden */
	onInit() {
		const [world, state] = start([
			ReplicatedStorage.WaitForChild("Client").WaitForChild("systems"),
			ReplicatedStorage.WaitForChild("Shared").WaitForChild("systems"),
		]);

		this.world = world;
		this.state = state;

		setupTags(world, "clientEntityId", {
			LobbyConveyorSegment,
		});
	}
}
