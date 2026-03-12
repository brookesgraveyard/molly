import Vide, { Derivable } from "@rbxts/vide";

export interface RoundProps {
	name?: Derivable<string>;
	round?: Derivable<UDim>;
}

export function Round({ name = "Round", round }: RoundProps) {
	return <uicorner Name={name} CornerRadius={round} />;
}
