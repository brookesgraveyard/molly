import { Controller, Modding, OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";

export interface OnPreSimulation {
	onPreSimulation(dt: number): void;
}

export interface OnPostSimulation {
	onPostSimulation(dt: number): void;
}

@Controller()
export class RunServiceHookManager implements OnStart {
	private preSimulation = new Set<OnPreSimulation>();
	private postSimulation = new Set<OnPostSimulation>();

	onStart(): void {
		Modding.onListenerAdded<OnPreSimulation>((object) => this.preSimulation.add(object));
		Modding.onListenerRemoved<OnPreSimulation>((object) => this.preSimulation.delete(object));
		Modding.onListenerAdded<OnPostSimulation>((object) => this.postSimulation.add(object));
		Modding.onListenerRemoved<OnPostSimulation>((object) => this.postSimulation.delete(object));

		RunService.PreSimulation.Connect((dt) => {
			for (const listener of this.preSimulation) {
				task.spawn((listener, dt) => listener.onPreSimulation(dt), listener, dt);
			}
		});
		RunService.PostSimulation.Connect((dt) => {
			for (const listener of this.postSimulation) {
				task.spawn((listener, dt) => listener.onPostSimulation(dt), listener, dt);
			}
		});
	}
}
