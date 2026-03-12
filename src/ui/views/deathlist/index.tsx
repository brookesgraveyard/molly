import { useMotion } from "@rbxts/pretty-vide-utils";
import Vide, { Derivable, effect, read } from "@rbxts/vide";
import { values } from "shared/utils/vide/primitives";
import { ListX } from "ui/components/styles/list";

import { BannedPanel } from "./panels/banned";
import { PanelProps } from "./panels/base";
import { DharMannPanel } from "./panels/dharmann";
import { LeBronPanel } from "./panels/lebron";
import { LetMeKnowPanel } from "./panels/letmeknow";
import { RapTVPanel } from "./panels/raptv";

export const DEATHLIST_PANELS: Array<Vide.Component<PanelProps>> = [
	LetMeKnowPanel,
	LeBronPanel,
	DharMannPanel,
	RapTVPanel,
	BannedPanel,
];

export interface DeathlistProps extends PanelProps {
	index?: Derivable<number>;
	show?: Derivable<boolean>;
}

const PANEL_X_TWEEN_OPTIONS = {
	style: Enum.EasingStyle.Linear,
	time: 0.5,
};

const FADE_TWEEN_OPTIONS = {
	style: Enum.EasingStyle.Linear,
	time: 3,
};

export function DeathlistScroller({ username, thumbnail, index = 1, show = true }: DeathlistProps) {
	const props: PanelProps = { username, thumbnail };
	const [panelXPosition, panelXPositionMotion] = useMotion(0);
	const [fadeTransparency, fadeTransparencyMotion] = useMotion(0);

	effect(() => panelXPositionMotion.tween(read(index) - 1, PANEL_X_TWEEN_OPTIONS));

	effect(() => fadeTransparencyMotion.tween(read(show) ? 1 : 0, FADE_TWEEN_OPTIONS));

	return (
		<frame Name="Deathlist" Size={UDim2.fromScale(1, 1)} BackgroundColor3={new Color3()}>
			<frame
				Name="Container"
				Position={UDim2.fromScale(0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Size={UDim2.fromScale(1, 1)}
				ClipsDescendants
			>
				<uiaspectratioconstraint />
				<frame
					Name="Panels"
					Size={UDim2.fromScale(1, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
					Position={() => UDim2.fromScale(-panelXPosition(), 0)}
				>
					<ListX />
					{values(DEATHLIST_PANELS, (component) => component(props))}
				</frame>
				<frame
					Name="Fade"
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={new Color3()}
					BackgroundTransparency={fadeTransparency}
				/>
			</frame>
		</frame>
	);
}
