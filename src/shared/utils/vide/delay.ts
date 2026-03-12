import { lockSource } from "@rbxts/pretty-vide-utils";
import { Derivable, effect, read, source } from "@rbxts/vide";

export function delay<T>(delaySeconds: Derivable<number>, observe: Derivable<T>) {
	const delayed = source(read(observe));
	effect(() => {
		const newObserve = read(observe);
		const thread = task.delay(read(delaySeconds), (delayed, newObserve) => delayed(newObserve), delayed, newObserve);
		return () => pcall(task.cancel, thread);
	});
	return lockSource(delayed);
}
