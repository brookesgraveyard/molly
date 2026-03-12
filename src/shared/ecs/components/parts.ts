import Matter from "@rbxts/matter";
import { t } from "@rbxts/t";

import { ComponentConstructor } from "../types";

export const partNameToGuard = new Map<string, t.check<unknown>>();
export const partComponentToGuard = new Map<ComponentConstructor, t.check<unknown>>();
export const partNames = new Array<string>();
export const partComponents = new Array<ComponentConstructor>();

function partComponent<T extends Record<string, t.check<unknown>>>(name: string, recordType: T) {
	const guard = t.strictInterface(recordType);
	partNameToGuard.set(name, guard);

	const component = Matter.component<{ [K in keyof T]: T[K] extends t.check<infer U> ? U : never }>(name);
	partComponentToGuard.set(component as ComponentConstructor, guard);

	partNames.push(name);
	partComponents.push(component as ComponentConstructor);

	return component;
}

export const Lava = partComponent("Lava", { damage: t.numberConstrained(0, 1000) });

export const checkPartNames = t.literalList(partNames);
