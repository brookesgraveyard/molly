import { useMotion } from "@rbxts/pretty-vide-utils";
import Vide, { Derivable, derive, effect, Show, Source, source } from "@rbxts/vide";
import { icons } from "shared/generated/spritesheets";
import { Gleam } from "ui/components/effects/gleam";
import { Icon } from "ui/components/icon";
import { FlexShrink } from "ui/components/styles/flex";
import { Ignore } from "ui/components/styles/ignore";
import { ListX, ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { Round } from "ui/components/styles/round";
import { Text } from "ui/components/text";
import { remUdim, remUdim2, wrapRem, wrapRemUdim2 } from "ui/rem";
import { Colors, Typography } from "ui/theme";
import { IconType } from "ui/types";

interface LightProps {
	color: Derivable<Color3>;
	icon?: Derivable<IconType>;
	transparency?: Derivable<number>;
	action?: () => void;
}

function Light({
	color,
	icon,
	transparency = 0,
	action,
}: LightProps) {
	const hover = source(false);
	// const colorTransparency = spring(() => hover() ? 1 : 0, 0.25),
	// 	colorScale = derive(() => math.map(colorTransparency(), 0, 1, 1, 0.8));
	// const iconTransparency = spring(() => hover() ? 0 : 1, 0.25),
	// 	iconScale = derive(() => math.map(iconTransparency(), 0, 1, 2, 1.3));

	// size has to be an even number otherwise it looks like a weird semi-square
	// const evenSize = derive(() => {
	// 	const r = rem(0.95);
	// 	return math.ceil(r / 2) * 2;
	// });

	return (
		<imagebutton
			Name="Light"
			// Size={() => UDim2.fromOffset(evenSize(), evenSize())}
			Size={wrapRemUdim2(2, 2)}
			Position={UDim2.fromScale(1, 0)}
			AnchorPoint={new Vector2(1, 0)}
			BackgroundTransparency={1}
			MouseEnter={() => icon && hover(true)}
			MouseLeave={() => hover(false)}
			Activated={action}
		>
			{
				/* {<frame
				Name="Color"
				BackgroundColor3={color}
				BackgroundTransparency={() => colorTransparency() + read(transparency)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={() => UDim2.fromScale(colorScale(), colorScale())}
			>
				<Round round={new UDim(1)} />
			</frame>} */
			}
			{icon
				? (
					<Icon
						src={icon}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						color={color}
						// transparency={() => iconTransparency() + read(transparency)}
						// size={() => UDim2.fromScale(iconScale(), iconScale())}
						size={UDim2.fromScale(1, 1)}
						transparency={transparency}
					/>
				)
				: undefined}
		</imagebutton>
	);
}

interface WindowProps {
	show: Source<boolean>;
	color?: Derivable<Color3>;

	title?: Derivable<string>;
	icon?: Derivable<IconType>;

	children?: (transparency: Source<number>) => Vide.Node;
}

export function Window({
	show = source(true),
	color = Colors.inverted,

	title = "Window",
	icon,
	children,
}: WindowProps) {
	const [progress, progressMot] = useMotion(0);
	const scale = derive(() => math.map(progress(), 0, 1, 0.9, 1));
	const transparency = derive(() => math.map(progress(), 0, 1, 1, 0));

	effect(() =>
		progressMot.spring(show() ? 1 : 0, {
			tension: 250,
		})
	);

	const crust = Colors.blendCrust(color);

	return (
		<frame
			Name={title}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={remUdim2(65, 38)}
			BackgroundColor3={crust}
			BackgroundTransparency={transparency}
			Visible={() => progress() >= 0.01}
		>
			<Round round={new UDim(0, 8)} />
			<Padding padding={remUdim(1)} />
			<ListY align="tl" padding={remUdim(1)} />
			<Gleam light={Colors.blendGleam(color)} dark={crust} transparency={transparency} />
			<uiscale Scale={scale} />
			<frame
				Name="Header"
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
			>
				<ListX align="ml" padding={remUdim(1)} />
				{icon
					? (
						<Icon
							src={icon}
							size={remUdim2(Typography.windowheader.remSize, Typography.windowheader.remSize)} // so pretty
							color={color}
							transparency={transparency}
						/>
					)
					: undefined}
				<Text
					text={title}
					color={color}
					font={Typography.windowheader.font}
					textSize={wrapRem(Typography.windowheader.remSize)}
					transparency={transparency}
				/>
				<Ignore name="Buttons">
					<Light
						color={Colors.red}
						icon={icons.filled.close}
						transparency={transparency}
						action={() => show(false)}
					/>
				</Ignore>
			</frame>
			<frame Name="Contents" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
				<FlexShrink />
				<Show when={() => progress() >= 0.01}>
					{() => children?.(transparency)}
				</Show>
			</frame>
		</frame>
	);
}
