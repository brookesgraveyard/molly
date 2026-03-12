import { atom } from "@rbxts/charm";
import { useEventListener, useMouse, useViewport } from "@rbxts/pretty-vide-utils";
import Signal from "@rbxts/signal";
import { derive } from "@rbxts/vide";
import { useAtom } from "@rbxts/vide-charm";

type InputEventSignal = (input: InputObject, gameProcessedEvent: boolean) => void;

// The Signal type differs everywhere, so we can't assert this really
interface BarebonesInputListener {
	InputBegan: any;
	InputChanged: any;
	InputEnded: any;
}

const location = atom<Vector2>();
const viewportSize = atom<Vector2>();
export const InputService = table.freeze({
	GetMouseLocation: () => location() ?? new Vector2(),
	ViewportSize: () => viewportSize() ?? new Vector2(),
	InputBegan: new Signal<InputEventSignal>(),
	InputChanged: new Signal<InputEventSignal>(),
	InputEnded: new Signal<InputEventSignal>(),
});

export function useMaus() {
	const mausLocation = useAtom(location);
	const mouse = useMouse();
	return derive(() => mausLocation() ?? mouse());
}
export function useVewport() {
	const vewportSize = useAtom(viewportSize);
	const viewport = useViewport();
	return derive(() => vewportSize() ?? viewport());
}

export function useInputListener(inputListener: BarebonesInputListener, target: GuiObject) {
	function handleInput(signal: Signal<InputEventSignal>, input: InputObject, gameProcessedEvent: boolean) {
		const inpType = input.UserInputType;
		if (inpType === Enum.UserInputType.MouseMovement || inpType === Enum.UserInputType.Touch) {
			location(new Vector2(input.Position.X, input.Position.Y));
		}
		signal.Fire(input, gameProcessedEvent);
	}

	useEventListener(inputListener.InputBegan, (i, p) => handleInput(InputService.InputBegan, i, p));
	useEventListener(inputListener.InputChanged, (i, p) => handleInput(InputService.InputChanged, i, p));
	useEventListener(inputListener.InputEnded, (i, p) => handleInput(InputService.InputEnded, i, p));

	if (target.AbsoluteSize.Magnitude >= 0.01) viewportSize(target.AbsoluteSize);
	useEventListener(
		target.GetPropertyChangedSignal("AbsoluteSize"),
		() => target.AbsoluteSize.Magnitude >= 0.01 && viewportSize(target.AbsoluteSize),
	);
}
