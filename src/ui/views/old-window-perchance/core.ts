import { LockedSource, lockSource, useEventListener, useMotion } from "@rbxts/pretty-vide-utils";
import { Set as SiftSet } from "@rbxts/sift";
import { cleanup, effect, Source, source } from "@rbxts/vide";
import { InputService, useMaus, useVewport } from "shared/utils/vide/maus";
import { Align2d, anchorPointFromAlign2d } from "ui/align-2d";
import { rem } from "ui/rem";

import { isMaus, WINDOW_BORDER_SIZE, WINDOW_STACK_OFFSET } from "./utils";

export interface WindowState {
	position: LockedSource<Vector2>;
	size: LockedSource<Vector2>;
	layer: LockedSource<number>;
	moved: LockedSource<boolean>;
	move(location: Vector2): boolean;
	resize(size: Vector2): void;
	focus(): void;
}

export interface Window {
	dragger: Source<Maybe<ImageButton>>;
	state: WindowState;
	index: number;
}

export type ResizingDirection = "x" | "rx" | "y" | "ry" | "xy" | "rxy" | "xry" | "rxry";

const WINDOW_BORDERED_SIZE = new Vector2(WINDOW_BORDER_SIZE, WINDOW_BORDER_SIZE);
const WINDOW_LEAST_SIZE = 20;

export function useController(state: WindowState) {
	const [position, posMotion] = useMotion(state.position());
	const [size, sizeMotion] = useMotion(state.size());
	const rotation = source(0);

	const mouse = useMaus();
	const mouseStart = source<Vector2>(), positionStart = source<Vector2>(), sizeStart = source<Vector2>();
	const dragging = source(false), resizing = source<ResizingDirection | false>(false);
	effect(() => {
		const posStart = positionStart(), sizStart = sizeStart(), resized = resizing();
		const maus = mouse(), mausStart = mouseStart();
		if (!mausStart) return;

		const diff = maus.sub(mausStart);
		if (dragging() && posStart) {
			const clamped = state.move(posStart.add(diff));
			posMotion.spring(state.position(), {
				tension: 500,
				friction: 20,
				mass: clamped ? 0.1 : 0.5,
			});
		} else if (resized && sizStart) {
			const dir = resized === "xy" ? diff : resized === "y" ? new Vector2(0, diff.Y) : new Vector2(diff.X, 0);

			state.resize(sizStart.add(dir));
			sizeMotion.spring(state.size(), {
				tension: 500,
				friction: 20,
				mass: 0.5,
			});
		}
	});
	useEventListener(
		InputService.InputEnded,
		(input, processed) => {
			if (processed || !isMaus(input)) return;

			mouseStart(undefined);
			positionStart(undefined);
			sizeStart(undefined);
			dragging(false);
			resizing(false);
		},
	);

	cleanup(posMotion.onStep(() => rotation(posMotion.getVelocity().X)));

	const controller = source({
		position,
		size,
		rotation: lockSource(rotation),
		startDrag: () => {
			resizing(false);
			sizeStart();

			mouseStart(InputService.GetMouseLocation());
			positionStart(state.position());
			dragging(true);
			state.focus();
		},
		startResize: (direction: ResizingDirection) => {
			dragging(false);
			positionStart();

			mouseStart(InputService.GetMouseLocation());
			sizeStart(state.size());
			resizing(direction);
			state.focus();
		},
	})();

	return controller;
}

let globalIndex = 0;
export function useWindow(state: WindowState) {
	const dragger = source<ImageButton>();
	const window = source<Window>({
		dragger,
		state,
		index: globalIndex++,
	})();

	effect(() => {
		windows.add(window);
		cleanup(() => windows.delete(window));
	});

	return window;
}

function getPosition(viewport: Vector2, size: Vector2, alignment: Align2d) {
	const anchor = anchorPointFromAlign2d(alignment), fullAnchor = anchor.mul(2).sub(new Vector2(1, 1));
	const max = viewport.sub(size);

	const latest = SiftSet.toArray(windows).sort((a, b) => b.index < a.index)[0];
	if (latest && !latest.state.moved()) {
		return new Vector2(
			(latest.state.position().X + rem(WINDOW_STACK_OFFSET)) % max.X,
			(latest.state.position().Y + rem(WINDOW_STACK_OFFSET)) % max.Y,
		);
	}

	return new Vector2(
		((viewport.X - size.X) * anchor.X) - (WINDOW_BORDER_SIZE * fullAnchor.X),
		((viewport.Y - size.Y) * anchor.Y) - (WINDOW_BORDER_SIZE * fullAnchor.Y),
	);
}

let globalLayer = 0;
export function useWindowState(width: number, height: number, alignment: Align2d): WindowState {
	const viewport = useVewport();
	const size = source(new Vector2(rem(width), rem(height)));
	const position = source(getPosition(viewport(), size(), alignment));
	const layer = source(globalLayer++);
	const moved = source(false);

	const state = source<WindowState>({
		position: lockSource(position),
		size: lockSource(size),
		layer: lockSource(layer),
		moved: lockSource(moved),
		move(location) {
			const view = viewport();
			const max = view.sub(size()).sub(WINDOW_BORDERED_SIZE);

			const clamped = new Vector2(
				math.clamp(location.X, WINDOW_BORDER_SIZE, max.X),
				math.clamp(location.Y, WINDOW_BORDER_SIZE, max.Y),
			);

			moved(true);
			position(clamped);
			return location.X <= WINDOW_BORDER_SIZE || location.X >= max.X || location.Y <= WINDOW_BORDER_SIZE
				|| location.Y >= max.Y;
		},
		resize(resize) {
			const view = viewport();
			const max = view.sub(position()).sub(WINDOW_BORDERED_SIZE);

			const clamped = new Vector2(
				math.clamp(resize.X, rem(WINDOW_LEAST_SIZE), max.X),
				math.clamp(resize.Y, rem(WINDOW_LEAST_SIZE), max.Y),
			);

			moved(true);
			size(clamped);
		},
		focus() {
			layer(globalLayer++);
		},
	})();

	return state;
}

export const windows = new Set<Window>();
