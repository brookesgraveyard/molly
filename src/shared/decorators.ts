import { callMethodOnDependency } from "@rbxts/flamework-meta-utils";

import { flameworkIgnited } from "./flamework";

/** @metadata reflect identifier flamework:parameters */
export function OnBlink<Args extends unknown[], Returns>(
	event: { on: (callback: (...args: Args) => Returns) => () => void },
) {
	return (ctor: object, _: string, descriptor: TypedPropertyDescriptor<(this: unknown, ...args: Args) => Returns>) => {
		flameworkIgnited.Connect(() => event.on((...args) => callMethodOnDependency(ctor, descriptor, ...args)));
	};
}
