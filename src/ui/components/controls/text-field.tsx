// Adapted from Epoch:
// https://github.com/team-fireworks/epoch/blob/main/src/UI/Components/Controls/TextField.luau

import { TextService } from "@rbxts/services";
import Vide, { Derivable, read, source, spring } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { Gleam } from "ui/components/effects/gleam";
import { Padding, PaddingProps } from "ui/components/styles/padding";
import { Round, RoundProps } from "ui/components/styles/round";
import { Text } from "ui/components/text";
import { rem, wrapRemUDim } from "ui/rem";
import { LayoutProps } from "ui/types";

export interface TextFieldProps extends LayoutProps, RoundProps, PaddingProps {
	name?: Derivable<string>;

	text?: Derivable<string>;
	placeholderText?: Derivable<string>;
	textSize?: Derivable<number>;
	onInput?: (input: string) => void;
	onUnfocused?: (input: string, enter: boolean) => void;

	bgColor?: Derivable<Color3>;
	textColor?: Derivable<Color3>;
	placeholderColor?: Derivable<Color3>;
	gleamColor?: Derivable<Color3>;
	focusRingColor?: Derivable<Color3>;

	transparency?: Derivable<number>;
}

export function TextField({
	name = "TextField",

	text = "",
	placeholderText = "Type to search...",
	textSize = 14,
	onInput,
	onUnfocused,

	bgColor = new Color3(0, 0, 0),
	textColor = new Color3(1, 1, 1),
	placeholderColor = dissolve((read) => read(bgColor).Lerp(read(textColor), 0.5)),
	gleamColor = dissolve((read) => read(bgColor).Lerp(read(textColor), 0.6)),
	focusRingColor = textColor,

	transparency = 0,

	position,
	anchorPoint,
	size = () => new UDim2(1, 0, 0, rem(3)),
	automaticSize,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,

	round = wrapRemUDim(0.5),

	padding = wrapRemUDim(0.75),
	paddingX,
	paddingY,
	paddingLeft,
	paddingRight,
	paddingTop,
	paddingBottom,
}: TextFieldProps) {
	const focused = source(false);
	const canvasPosition = source(Vector2.zero);

	function isTextEmpty() {
		return read(text).size() === 0;
	}

	const placeholderVisibility = spring(() => (isTextEmpty() ? 0 : 1), 0.2);

	const textBox = source<Vide.Node>();

	return (
		<imagebutton
			Name={name}
			BackgroundColor3={bgColor}
			BackgroundTransparency={transparency}
			Position={position}
			AnchorPoint={anchorPoint}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
			Activated={() => {
				(textBox() as TextBox).CaptureFocus();
				focused(true);
			}}
		>
			<Gleam dark={bgColor} light={gleamColor} transparency={transparency} round={round} />
			<Round round={round} />
			<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} ClipsDescendants>
				<Round round={round} />
				<uistroke
					Name="FocusRing"
					Color={focusRingColor}
					Thickness={spring(() => (focused() ? 2 : 12), 0.4)}
					Transparency={spring(() => (focused() ? 0 : 1), 0.2)}
				/>
				<Padding
					padding={padding}
					paddingX={paddingX}
					paddingY={paddingY}
					paddingLeft={paddingLeft}
					paddingRight={paddingRight}
					paddingTop={paddingTop}
					paddingBottom={paddingBottom}
				/>
				<scrollingframe
					Name="Scroller"
					Position={() => UDim2.fromOffset(read(textSize) / 2, 0)}
					Size={() => new UDim2(1, -read(textSize) * 2, 1, 0)}
					ZIndex={2}
					CanvasPosition={spring(canvasPosition, 0.2)}
					CanvasSize={spring(() => {
						const size = TextService.GetTextSize(
							read(text),
							read(textSize),
							// read(textFont),
							Enum.Font.Montserrat,
							new Vector2(math.huge, math.huge),
						);
						return UDim2.fromOffset(size.X, size.Y);
					}, 0.1)}
					BackgroundTransparency={1}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.X}
					ClipsDescendants={false}
				>
					{textBox(
						<textbox
							Name="Input"
							Size={UDim2.fromScale(1, 1)}
							PlaceholderText={""}
							FontFace={Font.fromEnum(Enum.Font.Montserrat)}
							Text={text}
							TextColor3={textColor}
							TextSize={textSize}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							TextTransparency={transparency}
							BackgroundTransparency={1}
							TextChanged={onInput}
							CursorPositionChanged={(cursor) =>
								canvasPosition(
									TextService.GetTextSize(
										string.sub(read(text), 1, cursor),
										read(textSize),
										// read(textFont),
										Enum.Font.Montserrat,
										new Vector2(math.huge, math.huge),
									),
								)}
							Focused={() => focused(true)}
							FocusLost={onUnfocused
								? (enter) => {
									focused(false);
									onUnfocused(read(text), enter);
								}
								: () => focused(false)}
						/>,
					)}
				</scrollingframe>
				<Text
					name="Placeholder"
					text={placeholderText}
					textSize={textSize}
					color={placeholderColor}
					align="ml"
					transparency={placeholderVisibility}
					visible={() => placeholderVisibility() < 0.995}
					size={dissolve((read) => new UDim2(1, read(textSize), 1, 0))}
					automaticSize={Enum.AutomaticSize.None}
					position={() => new UDim2(0, (placeholderVisibility() + 1) * (read(textSize) / 2), 0.5, 0)}
					anchorPoint={new Vector2(0, 0.5)}
				/>
			</frame>
		</imagebutton>
	);
}
