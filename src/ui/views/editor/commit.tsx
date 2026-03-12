// import { useMotion } from "@rbxts/pretty-vide-utils";
// import Vide, { Derivable, effect, read } from "@rbxts/vide";
// import { Button } from "ui/components/controls/button";
// import { rem } from "ui/rem";
// import { IconType, LayoutProps } from "ui/types";

// export interface ToolbarButtonProps extends LayoutProps {
// 	name?: Derivable<string>;
// 	icon: Derivable<IconType>;
// 	color?: Derivable<Color3>;
// 	onActivated?: () => void;
// 	visibility?: Derivable<number>;
// 	bouncy?: Derivable<boolean>;
// }

// export function Commit({
// 	name = "Commit",
// 	icon,
// 	color,
// 	onActivated,
// 	visibility = 0,
// 	bouncy,

// 	position = () => new UDim2(0.5, 0, 0.5, -rem(0.25)),
// 	anchorPoint = new Vector2(0.5, 0.5),
// 	size = () => new UDim2(1, -rem(0.25), 1, -rem(0.25)),
// 	automaticSize,
// 	layoutOrder,
// 	zIndex,
// 	visible,
// 	hideOverflow,
// }: ToolbarButtonProps) {
// 	const [bounce, bounceMotion] = useMotion(1.08);
// 	effect(() => {
// 		read(name);
// 		bounceMotion.set(1.08);
// 		bounceMotion.tween(1, {
// 			style: Enum.EasingStyle.Back,
// 			direction: Enum.EasingDirection.Out,
// 			time: 0.8,
// 		});
// 	});

// 	return (
// 		<Button
// 			name={name}
// 			icon={icon}
// 			color={color}
// 			onActivated={onActivated}
// 			transparency={visibility}
// 			position={() => read(position).add(UDim2.fromOffset(0, rem(2) * read(visibility)))}
// 			anchorPoint={anchorPoint}
// 			size={size}
// 			automaticSize={automaticSize}
// 			layoutOrder={layoutOrder}
// 			zIndex={zIndex}
// 			visible={visible}
// 			scale={() => read(bouncy) ? bounce() : 1}
// 			hideOverflow={hideOverflow}
// 		>
// 			<uiaspectratioconstraint AspectRatio={1} />
// 		</Button>
// 	);
// }
