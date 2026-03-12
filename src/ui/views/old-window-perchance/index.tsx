import { useMotion } from "@rbxts/pretty-vide-utils";
import Vide, { action, derive, effect, read } from "@rbxts/vide";
import { Derivable } from "@rbxts/vide";
import { Align2d } from "ui/align-2d";
import { Round } from "ui/components/styles/round";
import { Text } from "ui/components/text";
import { rem } from "ui/rem";
import { Colors } from "ui/theme";

import { useController, useWindow, useWindowState } from "./core";
import { isMaus, WINDOW_BORDER_SIZE } from "./utils";

const WINDOW_RESIZE_SIZE = 1.5;

// https://easings.net/#easeOutCirc
function progressCurve(n: number) {
	return math.sqrt(1 - math.pow(n - 1, 2));
}

interface WindowCoreProps {
	name?: Derivable<string>;
	enabled?: Derivable<boolean>;

	width?: number;
	height?: number;
	alignment?: Align2d;
}

export function WindowCore({
	name = "Window",
	enabled = true,

	width = 65,
	height = 38,
	alignment = "mm",
}: WindowCoreProps) {
	const state = useWindowState(width, height, alignment);
	const controller = useController(state);
	const window = useWindow(state);

	const [progress, progressMot] = useMotion(0);
	const transparency = derive(() => 1 - progressCurve(progress()));
	const scale = derive(() => math.map(progress(), 0, 1, 0.9, 1));

	effect(() =>
		progressMot.spring(read(enabled) ? 1 : 0, {
			mass: read(enabled) ? 1 : 0.3,
			tension: 180,
			friction: 20,
		})
	);

	return (
		<imagebutton
			Name={name}
			BackgroundColor3={Colors.base}
			BackgroundTransparency={transparency}
			BorderSizePixel={0}
			Image=""
			AnchorPoint={new Vector2(0, 0.5)}
			Position={() => UDim2.fromOffset(controller.position().X, controller.position().Y + (controller.size().Y / 2))}
			Size={() => UDim2.fromOffset(controller.size().X, controller.size().Y)}
			Rotation={controller.rotation}
			InputBegan={(input) => isMaus(input) && state.focus()}
			Visible={() => progress() >= 0.01}
			ZIndex={state.layer}
		>
			<uiscale Scale={scale} />
			<Round round={new UDim(0, 8)} />
			<uistroke Color={Colors.body} Thickness={WINDOW_BORDER_SIZE} Transparency={transparency} />
			<imagebutton
				Name="Dragger"
				Size={() => new UDim2(1, 0, 0, rem(3.5))}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Image=""
				ClipsDescendants
				InputBegan={(input) => isMaus(input) && controller.startDrag()}
				{...{ [1]: action<ImageButton>(window.dragger) }}
			>
				<Text
					text={name}
					size={UDim2.fromScale(1, 1)}
					align="mm"
					color={Colors.body}
					textSize={rem(2.5)}
					transparency={transparency}
				/>
			</imagebutton>
			<frame
				Name="DraggerBorder"
				Size={() => new UDim2(1, 0, 0, WINDOW_BORDER_SIZE)}
				BackgroundColor3={Colors.body}
				BackgroundTransparency={transparency}
				BorderSizePixel={0}
				Position={() => UDim2.fromOffset(0, rem(3.5))}
			/>
			<frame
				Name="ResizeHitboxLeft"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 1, -rem(WINDOW_RESIZE_SIZE))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0, 0.5)}
				BackgroundTransparency={1}
			/>
			<imagebutton
				Name="ResizeHitboxRight"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 1, -rem(WINDOW_RESIZE_SIZE))}
				Image=""
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(1, 0.5)}
				BackgroundTransparency={0.5}
				InputBegan={(input) => isMaus(input) && controller.startResize("x")}
			/>
			<imagebutton
				Name="ResizeHitboxDown"
				Size={() => new UDim2(1, -rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				Image=""
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 1)}
				BackgroundTransparency={0.5}
				InputBegan={(input) => isMaus(input) && controller.startResize("y")}
			/>
			<imagebutton
				Name="ResizeHitboxCornerBR"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				Image=""
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0.6}
				InputBegan={(input) => isMaus(input) && controller.startResize("xy")}
			/>
			<frame
				Name="ResizeHitboxUp"
				Size={() => new UDim2(1, -rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0)}
				BackgroundTransparency={1}
			/>
			<frame
				Name="ResizeHitboxCornerTL"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0, 0)}
				BackgroundTransparency={1}
			/>
			<frame
				Name="ResizeHitboxCornerTR"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(1, 0)}
				BackgroundTransparency={1}
			/>
			<frame
				Name="ResizeHitboxCornerBL"
				Size={() => new UDim2(0, rem(WINDOW_RESIZE_SIZE), 0, rem(WINDOW_RESIZE_SIZE))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0, 1)}
				BackgroundTransparency={1}
			/>
		</imagebutton>
	);
}
