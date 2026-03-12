import { create, Derivable, PropsWithChildren, read, source, spring } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { Gleam } from "ui/components/effects/gleam";
import { Colors } from "ui/theme";
import { LayoutProps } from "ui/types";

export interface PanelProps extends LayoutProps, PropsWithChildren {
	name?: Derivable<string>;
	color?: Derivable<Color3>;
	transparency?: Derivable<number>;
	scale?: Derivable<number>;
	round?: Derivable<UDim>;
	onActivated?: () => void;
}

export function Panel({
	name,
	color = Colors.inverted,
	transparency = 0,
	scale = 1,
	onActivated,

	position,
	anchorPoint,
	size,
	automaticSize,
	layoutOrder,
	zIndex,
	visible,
	hideOverflow,

	children,
}: PanelProps) {
	const isPassthrough = onActivated === undefined;
	const className = isPassthrough ? "Frame" : "ImageButton" as const;

	const baseColor = Colors.blendBase(color);
	const gleamColor = Colors.blendGleam(color);
	const hoverColor = isPassthrough ? baseColor : Colors.blendBaseHover(color);

	const hover = isPassthrough ? undefined as never : source(false);
	const active = isPassthrough ? undefined as never : source(false);
	const bg = isPassthrough ? baseColor : spring(() => hover() ? read(hoverColor) : read(baseColor), 0.2);
	const extraScale = isPassthrough ? 1 : spring(() => active() ? 0.9 : hover() ? 1.05 : 1, 0.2);
	const realScale = dissolve((read) => read(scale) * read(extraScale));

	return create(className)({
		Name: name ?? isPassthrough ? "Panel (passthrough)" : "Panel",
		BackgroundColor3: bg,
		BackgroundTransparency: transparency,

		Position: position,
		AnchorPoint: anchorPoint,
		Size: size,
		AutomaticSize: automaticSize,
		LayoutOrder: layoutOrder,
		ZIndex: zIndex,
		Visible: visible,
		ClipsDescendants: hideOverflow,

		[0]: Gleam({
			dark: bg,
			light: gleamColor,
			transparency,
		}),

		[1]: create("UIScale")({
			Scale: realScale,
		}),

		[2]: [children],

		[3]: isPassthrough ? undefined : {
			Activated: onActivated,

			MouseButton1Down: () => active(true),
			MouseButton1Up: () => active(false),
			MouseEnter: () => hover(true),
			MouseLeave: () => {
				hover(false);
				active(false);
			},
			SelectionGained: () => hover(true),
			SelectionLost: () => hover(false),
		} as never,
	});
}
