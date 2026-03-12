import Vide, { Derivable } from "@rbxts/vide";

export interface PaddingProps {
	name?: Derivable<string>;
	padding?: Derivable<UDim>;
	paddingX?: Derivable<UDim>;
	paddingY?: Derivable<UDim>;
	paddingLeft?: Derivable<UDim>;
	paddingRight?: Derivable<UDim>;
	paddingTop?: Derivable<UDim>;
	paddingBottom?: Derivable<UDim>;
}

const ZERO_UDIM = new UDim(0, 0);

export function Padding({
	name = "Padding",
	padding,
	paddingX,
	paddingY,
	paddingLeft,
	paddingRight,
	paddingTop,
	paddingBottom,
}: PaddingProps) {
	return (
		<uipadding
			Name={name}
			PaddingLeft={paddingLeft ?? paddingX ?? padding ?? ZERO_UDIM}
			PaddingRight={paddingRight ?? paddingX ?? padding ?? ZERO_UDIM}
			PaddingTop={paddingTop ?? paddingY ?? padding ?? ZERO_UDIM}
			PaddingBottom={paddingBottom ?? paddingY ?? padding ?? ZERO_UDIM}
		/>
	);
}
