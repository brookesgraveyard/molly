import Vide, { Derivable } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { IconType, LayoutProps } from "ui/types";

export interface IconProps extends LayoutProps {
	name?: Derivable<string>;

	src: Derivable<IconType>;

	transparency?: Derivable<number>;
	color?: Derivable<Color3>;
	rotation?: Derivable<number>;
}

export function Icon({
	name = "Icon",

	src,
	transparency,
	color,
	rotation,

	position,
	anchorPoint,
	size,
	automaticSize = Enum.AutomaticSize.XY,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,
}: IconProps) {
	const image = dissolve((read) => {
		const iconSrc = read(src);
		if (typeIs(iconSrc, "string")) return iconSrc;
		return iconSrc.img;
	});

	const imageOffset = dissolve((read) => {
		const iconSrc = read(src);
		if (typeIs(iconSrc, "string")) return Vector2.zero;
		return new Vector2(iconSrc.x, iconSrc.y);
	});

	const imageSize = dissolve((read) => {
		const iconSrc = read(src);
		if (typeIs(iconSrc, "string")) return Vector2.zero;
		return new Vector2(iconSrc.w, iconSrc.h);
	});

	return (
		<imagelabel
			BackgroundTransparency={1}
			Name={name}
			Rotation={rotation}
			Image={image}
			ImageRectOffset={imageOffset}
			ImageRectSize={imageSize}
			ImageColor3={color}
			ImageTransparency={transparency}
			Position={position}
			AnchorPoint={anchorPoint}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagelabel>
	);
}
