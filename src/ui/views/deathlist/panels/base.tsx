import Vide, { Derivable, PropsWithChildren } from "@rbxts/vide";

export interface BasePanelProps extends PropsWithChildren {
	name?: Derivable<string>;
	bg?: Derivable<Color3>;
}

export interface PanelProps {
	username?: Derivable<string>;
	thumbnail?: Derivable<string>;
}

export const defaultThubmanil = "rbxthumb://type=Avatar&id=1275426298&w=420&h=420";

export function BasePanel({ name = "BasePanel", children, bg = new Color3(0.1, 0.1, 0.1) }: BasePanelProps) {
	return (
		<frame Name={name} Size={UDim2.fromScale(1, 1)} BackgroundColor3={bg} ClipsDescendants>
			<uiaspectratioconstraint></uiaspectratioconstraint>
			{children}
		</frame>
	);
}
