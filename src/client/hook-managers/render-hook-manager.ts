import { Controller, Modding, OnStart } from "@flamework/core";
import { RunService } from "@rbxts/services";

export interface OnPreRender {
	onPreRender(dt: number): void;
}

export interface OnPreAnimation {
	onPreAnimation(dt: number): void;
}

@Controller()
export class RenderHookManager implements OnStart {
	private preRender = new Set<OnPreRender>();
	private preAnimation = new Set<OnPreAnimation>();

	onStart(): void {
		Modding.onListenerAdded<OnPreRender>((object) => this.preRender.add(object));
		Modding.onListenerAdded<OnPreAnimation>((object) => this.preAnimation.add(object));
		Modding.onListenerRemoved<OnPreRender>((object) => this.preRender.delete(object));
		Modding.onListenerRemoved<OnPreAnimation>((object) => this.preAnimation.delete(object));

		RunService.PreRender.Connect((dt) => {
			for (const listener of this.preRender) task.spawn(() => listener.onPreRender(dt));
		});
		RunService.PreAnimation.Connect((dt) => {
			for (const listener of this.preAnimation) task.spawn(() => listener.onPreAnimation(dt));
		});
	}
}
