import Vide, { PropsWithChildren, read } from "@rbxts/vide";
import { Derivable } from "@rbxts/vide";
import { rem } from "ui/rem";

import { Padding } from "./padding";

interface ViewProps extends PropsWithChildren {
	name?: Derivable<string>;
	padding?: Derivable<boolean>;
}

export function View({ name = "View", padding, children }: ViewProps) {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Name={name}>
			{read(padding) ? <Padding padding={() => new UDim(0, rem(0.6))} /> : undefined}
			{children}
		</frame>
	);
}
