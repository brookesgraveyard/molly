import Vide, { Derivable, Node, read, Show, spring } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { Align2d, anchorPointFromDerivableAlign2d, positionFromAlign2d, yComponentToAlign1d } from "ui/align-2d";
import { rem } from "ui/rem";
import { LayoutProps } from "ui/types";

export interface HorizontalCollapsingNavProps extends Omit<LayoutProps, "position" | "anchorPoint" | "visible"> {
	name?: Derivable<string>;
	enabled?: Derivable<boolean>;
	align?: Derivable<Align2d>;
	hideWhenInvisible?: Derivable<boolean>;
	render: (transparency: Derivable<number>) => Node;
}

export function HorizontalCollapsingNav({
	name = "HorizontalCollapsingNav",
	enabled = true,
	align = "bl",
	hideWhenInvisible,
	render,

	size,
	automaticSize = Enum.AutomaticSize.XY,
	layoutOrder,
	zIndex,
	hideOverflow,
}: HorizontalCollapsingNavProps) {
	const transparency = spring(() => (read(enabled) ? 0 : 1), 0.2);

	const collapseBy = dissolve((read) => {
		const yComponent = yComponentToAlign1d(read(align));
		switch (yComponent) {
			case "start":
				return -1.5;
			case "mid":
				return 0;
			case "end":
				return 1.5;
		}
	});

	return (
		<frame
			Name={name}
			BackgroundTransparency={1}
			AnchorPoint={anchorPointFromDerivableAlign2d(align)}
			Position={() => {
				const position = positionFromAlign2d(read(align));
				return new UDim2(position.X.Scale, 0, position.Y.Scale, rem(read(collapseBy)) * transparency());
			}}
			Visible={() => transparency() < 0.995}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			ClipsDescendants={hideOverflow}
		>
			<uiscale Scale={() => math.map(transparency(), 0, 1, 1, 0.9)} />
			<Show
				when={() => read(hideWhenInvisible) ? (transparency() < 0.99) : true}
				children={() => render(transparency)}
			/>
		</frame>
	);
}
