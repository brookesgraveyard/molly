import Vide, { Derivable } from "@rbxts/vide";
import { Align2d, derivableAlign2dToHorizontalAlignment, derivableAlign2dToVerticalAlignment } from "ui/align-2d";

export interface ListProps {
	name?: Derivable<string>;
	sort?: Derivable<Enum.SortOrder>;
	padding?: Derivable<UDim>;
	wraps?: Derivable<boolean>;
	flexX?: Derivable<Enum.UIFlexAlignment>;
	flexY?: Derivable<Enum.UIFlexAlignment>;
	align?: Derivable<Align2d>;
	itemLineAlignment?: Derivable<Enum.ItemLineAlignment>;
}

export interface ListDirectionProps extends ListProps {
	direction?: Derivable<Enum.FillDirection>;
}

const ZERO_UDIM = new UDim(0, 0);

export function ListDirection({
	name = "ListDirection",
	sort,
	padding,
	wraps,
	flexX,
	flexY,
	align = "tl",
	itemLineAlignment,
	direction,
}: ListDirectionProps) {
	return (
		<uilistlayout
			Name={name}
			FillDirection={direction}
			SortOrder={sort ?? Enum.SortOrder.LayoutOrder}
			Padding={padding ?? ZERO_UDIM}
			Wraps={wraps}
			HorizontalFlex={flexX}
			VerticalFlex={flexY}
			HorizontalAlignment={derivableAlign2dToHorizontalAlignment(align)}
			VerticalAlignment={derivableAlign2dToVerticalAlignment(align)}
			ItemLineAlignment={itemLineAlignment}
		/>
	);
}

export function ListX(props: ListProps) {
	return <ListDirection name="ListX" direction={Enum.FillDirection.Horizontal} {...props} />;
}

export function ListY(props: ListProps) {
	return <ListDirection name="ListY" direction={Enum.FillDirection.Vertical} {...props} />;
}
