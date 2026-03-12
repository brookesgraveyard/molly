import { component, World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";

export type ComponentConstructor<T extends object = object> = ReturnType<typeof component<T>>;

export interface State {
	debugEnabled: boolean;
}

export type SystemRunner = (world: World, state: State, ui: Widgets) => void;

export interface SystemTable {
	system: SystemRunner;
	event?: "preSimulation" | "postSimulation" | "preRender" | "preAnimation";
	priority?: number;
	after?: System[];
}

export type System = SystemRunner | SystemTable;
