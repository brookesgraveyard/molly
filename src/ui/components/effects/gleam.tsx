import Vide, { Derivable } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { Round, RoundProps } from "ui/components/styles/round";

export interface GleamProps extends RoundProps {
	name?: Derivable<string>;
	transparency?: Derivable<number>;

	dark: Derivable<Color3>;
	light: Derivable<Color3>;
}

export function Gleam({ name = "Gleam", dark, light, transparency }: GleamProps) {
	return (
		<uistroke Name={name} Color={new Color3(1, 1, 1)} Transparency={transparency} Thickness={1}>
			<uigradient
				Color={dissolve(
					(read) =>
						new ColorSequence([
							new ColorSequenceKeypoint(0, read(light)),
							new ColorSequenceKeypoint(0.5, read(dark)),
							new ColorSequenceKeypoint(1, read(light)),
						]),
				)}
				Rotation={90}
			/>
		</uistroke>
	);
}

export function GleamFrame(props: GleamProps) {
	return (
		<frame Name={props.name ?? "GleamFrame"} BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<Gleam {...props} />
			{props.round ? <Round round={props.round} /> : undefined}
		</frame>
	);
}
