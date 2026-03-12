import { Controller } from "@flamework/core";
import { atom, computed } from "@rbxts/charm";
import Vide, { effect, Source, spring } from "@rbxts/vide";
import { Component, Show, source } from "@rbxts/vide";
import { useAtom } from "@rbxts/vide-charm";
import { ZoomMod } from "ui/components/effects/zoom";

export interface WindowIDProps {
	show: Source<boolean>;
}

export type WindowIDComponent = Component<WindowIDProps>;
export type WindowID = { id: WindowIDComponent };

// can't directly save a function
const currentWindow = atom<WindowID>();
export const activeWindow = computed(currentWindow);

const windowTime = 0.1;
export async function openWindow(id: WindowIDComponent) {
	if (currentWindow()?.id === id) return await closeWindow(id);
	await closeAll();
	currentWindow({ id });
}
export async function closeWindow(id: WindowIDComponent) {
	if (currentWindow()?.id === id) await closeAll();
}
export async function closeAll() {
	if (currentWindow()) {
		currentWindow(undefined);
		task.wait(windowTime);
	}
}

@Controller()
export class WindowsController {
	render() {
		const window = useAtom(currentWindow);
		const active = source(window());
		const show = source(!!window());

		effect(() => show(!!window()));
		effect(() => currentWindow(active()));
		effect<thread | undefined>((thread) => {
			if (thread) pcall(task.cancel, thread);

			const shown = show(), win = window();
			if (shown) active(win);
			else return task.delay(windowTime, () => active(undefined));
		}, undefined);

		return (
			<>
				<ZoomMod scale={spring(() => show() ? 0.8 : 1, 0.5)} />
				<Show when={active}>
					{() => {
						const Component = active()?.id;
						if (!Component) return; // should literally never happen but WHATEVER

						return <Component show={show} />;
					}}
				</Show>
			</>
		);
	}
}
