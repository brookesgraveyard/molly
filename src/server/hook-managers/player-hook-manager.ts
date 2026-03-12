import { Modding, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnPlayerAdded {
	onPlayerAdded(player: Player): void;
}
export interface OnPlayerRemoving {
	onPlayerRemoving(player: Player): void;
}

@Service()
export class PlayerHookManager implements OnStart {
	onStart(): void {
		const listeners = {
			add: new Set<OnPlayerAdded>(),
			rem: new Set<OnPlayerRemoving>(),
		};

		Modding.onListenerAdded<OnPlayerAdded>((object) => listeners.add.add(object));
		Modding.onListenerRemoved<OnPlayerAdded>((object) => listeners.add.delete(object));

		Modding.onListenerAdded<OnPlayerRemoving>((object) => listeners.rem.add(object));
		Modding.onListenerRemoved<OnPlayerRemoving>((object) => listeners.rem.delete(object));

		Players.PlayerAdded.Connect((plr) => {
			for (const listener of listeners.add) task.spawn(() => listener.onPlayerAdded(plr));
		});
		Players.PlayerRemoving.Connect((plr) => {
			for (const listener of listeners.rem) task.spawn(() => listener.onPlayerRemoving(plr));
		});

		for (const plr of Players.GetPlayers()) {
			for (const listener of listeners.add) task.spawn(() => listener.onPlayerAdded(plr));
		}
	}
}
