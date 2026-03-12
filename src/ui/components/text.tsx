import Vide, { Derivable } from "@rbxts/vide";
import { Align2d, derivableAlign2dToTextXAlignment, derivableAlign2dToTextYAlignment } from "ui/align-2d";
import { wrapRem } from "ui/rem";
import { Colors, Typography } from "ui/theme";
import { LayoutProps } from "ui/types";

export interface TextProps extends LayoutProps {
	name?: Derivable<string>;

	text?: Derivable<string>;
	transparency?: Derivable<number>;
	textSize?: Derivable<number>;
	color?: Derivable<Color3>;
	rich?: Derivable<boolean>;
	wrap?: Derivable<boolean>;
	font?: Derivable<Font>;

	align?: Derivable<Align2d>;
}

export function Text({
	name = "Text",

	text,
	transparency,
	textSize = wrapRem(Typography.body.remSize),
	color = Colors.body,
	rich,
	wrap,
	font = Typography.body.font,

	align = "tl",

	position,
	anchorPoint,
	size,
	automaticSize = Enum.AutomaticSize.XY,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,
}: TextProps) {
	return (
		<textlabel
			BackgroundTransparency={1}
			Name={name}
			Text={text}
			TextTransparency={transparency}
			TextSize={textSize}
			TextColor3={color}
			RichText={rich}
			TextWrapped={wrap}
			FontFace={font}
			TextXAlignment={derivableAlign2dToTextXAlignment(align)}
			TextYAlignment={derivableAlign2dToTextYAlignment(align)}
			Position={position}
			AnchorPoint={anchorPoint}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
		/>
	);
}
