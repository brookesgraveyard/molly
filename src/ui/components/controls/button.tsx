import Vide, { Derivable, PropsWithChildren, read, source, spring } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { Gleam } from "ui/components/effects/gleam";
import { ListX } from "ui/components/styles/list";
import { Padding, PaddingProps } from "ui/components/styles/padding";
import { Round, RoundProps } from "ui/components/styles/round";
import { Text } from "ui/components/text";
import { rem, wrapRem } from "ui/rem";
import { Colors, Typography } from "ui/theme";
import type { IconType, LayoutProps, PrefixProps } from "ui/types";

import { Icon } from "../icon";

// north korean general with lots of medals ahh type
export interface ButtonProps
	extends PropsWithChildren, LayoutProps, PaddingProps, RoundProps, PrefixProps<"icon", LayoutProps>
{
	icon?: Derivable<IconType>;
	name?: Derivable<string>;

	label?: Derivable<string>;

	color?: Derivable<Color3>;
	disabled?: Derivable<boolean>;
	transparency?: Derivable<number>;

	scale?: Derivable<number>;

	onActivated?: () => void;
}

export function Button({
	name = "Button",

	icon,
	label,

	color = Colors.inverted,
	disabled,
	transparency = 0,

	onActivated,

	position,
	anchorPoint,
	size = () => UDim2.fromOffset(0, rem(4)),
	automaticSize = Enum.AutomaticSize.X,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,

	iconPosition,
	iconAnchorPoint,
	iconSize = UDim2.fromScale(1, 1),
	iconAutomaticSize,
	iconLayoutOrder,
	iconZIndex,
	iconVisible,

	padding = () => new UDim(0, rem(0.75)),
	paddingX,
	paddingY,
	paddingLeft,
	paddingRight,
	paddingTop,
	paddingBottom,

	round = () => new UDim(0, rem(0.5)),
	scale = 1,

	children,
}: ButtonProps) {
	const hover = source(false);
	const active = source(false);

	const base = Colors.blendBase(color);
	const baseHover = Colors.blendBaseHover(color);
	const gleam = Colors.blendGleam(color);

	const bg = spring(
		() => (hover() ? read(baseHover) : read(base)),
		0.2,
	);

	const buttonScale = spring(() => (active() ? 0.9 : 1), 0.2);

	const numClicks = source(0);

	return (
		<imagebutton
			Name={name}
			BackgroundColor3={bg}
			BackgroundTransparency={transparency}
			Interactable={dissolve((read) => !read(disabled))}
			Activated={() => {
				numClicks(numClicks() + 1);
				onActivated?.();
			}}
			MouseEnter={() => hover(true)}
			MouseLeave={() => {
				hover(false);
				active(false);
			}}
			MouseButton1Down={() => !read(disabled) && active(true)}
			MouseButton1Up={() => active(false)}
			SelectionGained={() => hover(true)}
			SelectionLost={() => {
				hover(false);
				active(false);
			}}
			Position={position}
			AnchorPoint={anchorPoint}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
		>
			<uiscale Scale={() => buttonScale() * read(scale)} />

			<Gleam dark={bg} light={gleam} transparency={transparency} />

			<Padding
				padding={padding}
				paddingX={paddingX}
				paddingY={paddingY}
				paddingLeft={paddingLeft}
				paddingRight={paddingRight}
				paddingTop={paddingTop}
				paddingBottom={paddingBottom}
			/>

			<ListX align="mm" padding={() => new UDim(0, rem(1))} />

			{icon
				? (
					<Icon
						src={icon}
						color={color}
						transparency={transparency}
						// rotation={spring(() => numClicks() * 360 + (active() ? 10 : 0), 0.2, 2 / 3)}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
					/>
				)
				: undefined}

			{label
				? (
					<Text
						text={label}
						textSize={wrapRem(Typography.button.remSize)}
						font={Typography.button.font}
						color={color}
						transparency={transparency}
					/>
				)
				: undefined}

			{round ? <Round round={round} /> : undefined}

			{children}
		</imagebutton>
	);
}
