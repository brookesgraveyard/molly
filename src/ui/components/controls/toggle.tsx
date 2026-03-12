import { useMotion } from "@rbxts/pretty-vide-utils";
import Vide, { cleanup, derive, effect, read, Source, source, spring } from "@rbxts/vide";
import { Derivable } from "@rbxts/vide";
import { remUdim, remUdim2 } from "ui/rem";
import { Colors } from "ui/theme";
import { LayoutProps } from "ui/types";

import { Padding } from "../styles/padding";
import { Round } from "../styles/round";

interface ToggleProps extends Omit<LayoutProps, "size"> {
	name?: Derivable<string>;
	value?: Derivable<boolean>;
	demo?: Derivable<boolean>;

	onChange?: (value: boolean) => void;

	transparency?: Derivable<number>;
}

export function Toggle({
	name = "Toggle",
	value = false,

	onChange,

	position,
	anchorPoint,
	automaticSize,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,

	transparency,
}: ToggleProps) {
	const pressing = source(false), pressingSquish = spring(() => pressing() ? 1.1 : 1, 0.25);
	const [ball, ballMotion] = useMotion(read(value) ? 1 : 0), ballSquish = source(0);

	const [progress, progressMotion] = useMotion(read(value) ? 1 : 0);
	const background = derive(() => read(Colors.blendBase(Colors.body)).Lerp(read(Colors.blue), progress()));

	effect(() => {
		ballMotion.spring(read(value) ? 1 : 0, {
			tension: 545,
			friction: 35,
		});
		progressMotion.spring(read(value) ? 1 : 0);
	});
	effect(() => cleanup(ballMotion.onStep(() => ballSquish(math.abs(ballMotion.getVelocity()) * 40))));

	return (
		<imagebutton
			Name={name}
			Image=""
			BackgroundColor3={background}
			BackgroundTransparency={transparency}
			Activated={() => onChange?.(!read(value))}
			Size={remUdim2(5, 2.5)}
			Position={position}
			AnchorPoint={anchorPoint}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
			MouseButton1Down={() => pressing(true)}
			MouseButton1Up={() => pressing(false)}
		>
			<Padding padding={remUdim(0.35)} />
			<Round round={new UDim(1)} />
			<frame
				Name="Handle"
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				Position={() => UDim2.fromScale(ball(), 0.5)}
				AnchorPoint={() => new Vector2(ball(), 0.5)}
			>
				<frame
					Name="Ball"
					Size={() => UDim2.fromScale(1, 1 - (math.sin(ball() * math.pi) * 0.3))}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Colors.floating}
					BackgroundTransparency={transparency}
				>
					<uiscale Scale={pressingSquish} />
					<Round round={new UDim(1)} />
				</frame>
			</frame>
		</imagebutton>
	);
}

interface VideToggleProps extends Omit<ToggleProps, "value" | "onChange"> {
	source: Source<boolean>;
}

export function VideToggle(props: VideToggleProps) {
	return <Toggle value={props.source} onChange={props.source} {...props} />;
}
