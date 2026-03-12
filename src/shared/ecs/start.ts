import { Debugger, Loop, System, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { Context, HotReloader } from "@rbxts/rewire";
import { RunService, UserInputService } from "@rbxts/services";
import { createLogger } from "shared/logger";
import { isHost } from "shared/users";

import { Model } from "./components";
import { State } from "./types";

const logger = createLogger("shared.ecs.start");

export function start(containers: Instance[]) {
	const world = new World();
	const state = {} as State;
	const matterDebugger = new Debugger(Plasma);

	matterDebugger.loopParameterNames = ["World", "State", "Widgets"];

	matterDebugger.findInstanceFromEntity = (id) => {
		if (!world.contains(id)) return undefined;
		const instance = world.get(id, Model);
		return instance ? instance.instance : undefined;
	};

	matterDebugger.authorize = (player) => {
		return RunService.IsStudio() || isHost(player);
	};

	const loop = new Loop(world, state, matterDebugger.getWidgets());

	// hot reloading

	const hr = new HotReloader();
	let firstRunSystems: Maybe<System<unknown[]>[]> = [];
	const systemsByModule = new Map<ModuleScript, System<unknown[]>>();

	function loadModule(module: ModuleScript, { originalModule }: Context) {
		const [requireSuccess, systemOrError] = pcall(require, module);

		if (!requireSuccess) {
			logger.warn("Error when hot-reloading system", module.Name, systemOrError);
			return;
		}

		const originalSystem = systemsByModule.get(originalModule);
		if (firstRunSystems) firstRunSystems.push(systemOrError as never);
		else if (originalSystem) {
			loop.replaceSystem(originalSystem, systemOrError as never);
			matterDebugger.replaceSystem(originalSystem, systemOrError as never);
		} else loop.scheduleSystem(systemOrError as never);
	}

	function unloadModule(_: unknown, { isReloading, originalModule }: Context) {
		if (isReloading) return;
		const originalSystem = systemsByModule.get(originalModule);
		if (originalSystem) {
			loop.evictSystem(originalSystem);
			systemsByModule.delete(originalModule);
		}
	}

	for (const container of containers) hr.scan(container, loadModule, unloadModule);

	loop.scheduleSystems(firstRunSystems);
	firstRunSystems = undefined;

	matterDebugger.autoInitialize(loop);

	// begin systems

	const events = {
		default: RunService.PreSimulation,
		postSimulation: RunService.PostSimulation,
	};

	if (RunService.IsClient()) {
		(events as never as { preRender: RBXScriptSignal }).preRender = RunService.PreRender;
		(events as never as { preAnimation: RBXScriptSignal }).preAnimation = RunService.PreAnimation;
	}

	loop.begin(events);

	if (RunService.IsClient()) {
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.Comma) {
				matterDebugger.toggle();
				state.debugEnabled = matterDebugger.enabled;
			}
		});
	}

	return $tuple(world, state);
}
