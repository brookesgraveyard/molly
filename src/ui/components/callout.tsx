import Vide, { Derivable, PropsWithChildren } from "@rbxts/vide";
import { FlexFill } from "ui/components/styles/flex";
import { ListX, ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { Round } from "ui/components/styles/round";
import { wrapRemUDim, wrapRemUdim2 } from "ui/rem";
import { Colors } from "ui/theme";
import { IconType, LayoutProps } from "ui/types";

import { Icon } from "./icon";
import { Panel } from "./panel";

export interface CalloutProps extends LayoutProps, PropsWithChildren {
	name?: Derivable<string>;

	icon?: Derivable<IconType>;
	color?: Derivable<Color3>;
	transparency?: Derivable<number>;
}

export function Callout({
	name = "Callout",

	icon = "",
	color = Colors.inverted,
	transparency,

	position,
	anchorPoint,
	size,
	automaticSize = Enum.AutomaticSize.XY,
	layoutOrder,
	zIndex,
	visible,

	children,
}: CalloutProps) {
	return (
		<Panel
			name={name}
			color={color}
			transparency={transparency}
			position={position}
			anchorPoint={anchorPoint}
			size={size}
			automaticSize={automaticSize}
			layoutOrder={layoutOrder}
			zIndex={zIndex}
			visible={visible}
		>
			<Padding padding={wrapRemUDim(1)} />
			<ListX padding={wrapRemUDim(1)} />
			<Round round={wrapRemUDim(0.5)} />
			<Icon src={icon} color={color} transparency={transparency} size={wrapRemUdim2(2, 2)} />
			<frame Name="Content" BackgroundTransparency={1} AutomaticSize={Enum.AutomaticSize.XY}>
				<FlexFill />
				<ListY padding={wrapRemUDim(0.5)} />
				{children}
			</frame>
		</Panel>
	);
}
