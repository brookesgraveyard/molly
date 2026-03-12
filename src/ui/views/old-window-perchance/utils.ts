import { useEventListener, useMotion } from "@rbxts/pretty-vide-utils";
import Ripple, { Motion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import { effect, source } from "@rbxts/vide";
import { InputService, useMaus, useVewport } from "shared/utils/vide/maus";
import { positionFromAlign1d } from "ui/align-1d";
import { Align2d, xComponentToAlign1d, yComponentToAlign1d } from "ui/align-2d";
import { rem } from "ui/rem";
import { Align1d } from "ui/types";

export function isMaus(input: InputObject) {
	const itype = input.UserInputType;
	return itype === Enum.UserInputType.MouseButton1 || itype === Enum.UserInputType.Touch;
}

export const WINDOW_BORDER_SIZE = 2;
export const WINDOW_STACK_OFFSET = 2;

function getPosition(area: number, element: number, align: Align1d, offset: number) {
	const alpha = positionFromAlign1d(align);
	return (area * alpha) - (element * alpha) - (WINDOW_BORDER_SIZE * ((alpha * 2) - 1))
		+ (rem(WINDOW_STACK_OFFSET) * offset);
}

export function useWindow(defWid: number, defHei: number, defAlign: Align2d, winOffset: number) {
	const viewport = useVewport();
	const width = source(rem(defWid)), height = source(rem(defHei));
	const [x, xMotion] = useMotion(getPosition(viewport().X, width(), xComponentToAlign1d(defAlign), winOffset)),
		[y, yMotion] = useMotion(getPosition(viewport().Y, height(), yComponentToAlign1d(defAlign), winOffset));
	const rot = source(0);

	const dragging = source(false);
	function dragger(state: boolean) {
		const position = InputService.GetMouseLocation();

		dragging(state);
		if (state) {
			mouseStart(position);
			startPos(new Vector2(x(), y()));
		} else {
			mouseStart(undefined);
			startPos(undefined);
		}
	}

	const windowDims = table.freeze({
		width,
		height,
		x,
		y,
		rot,
	});

	const controller = table.freeze({
		startDrag: (input: InputObject) => isMaus(input) && dragger(true),
		dragging,
	});

	const mouse = useMaus(), mouseStart = source<Vector2>();
	const startPos = source<Vector2>();
	effect(() => {
		const mouseDiff = mouseStart()?.sub(mouse());
		const newPos = mouseDiff && startPos()?.sub(mouseDiff);
		if (!newPos) return;

		const viewX = viewport().X, viewY = viewport().Y;
		const endX = viewX - width() - WINDOW_BORDER_SIZE, endY = viewY - height() - WINDOW_BORDER_SIZE;

		const config: Ripple.SpringOptions = { tension: 400 };
		function maybeClamp(motion: Motion, n: number, min: number, max: number) {
			if (n <= min || n >= max) {
				motion.spring(math.clamp(n, min, max), {
					...config,
					mass: 0.7,
				});
			} else motion.spring(n);
		}

		maybeClamp(xMotion, newPos.X, WINDOW_BORDER_SIZE, endX);
		maybeClamp(yMotion, newPos.Y, WINDOW_BORDER_SIZE, endY);
	});

	useEventListener(RunService.PreRender, () => rot(xMotion.getVelocity()));
	useEventListener(InputService.InputEnded, (input) => isMaus(input) && dragger(false));

	return $tuple(windowDims, controller);
}
// im touching your mother :(
