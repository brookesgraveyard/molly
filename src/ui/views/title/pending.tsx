import Vide, { Derivable, read, spring } from "@rbxts/vide";

import { Logo } from "./logo";
import { UneligibleWarning } from "./uneligible-warning";

export interface PlacePendingProps {
	isEligible?: Derivable<boolean>;
	visibility?: Derivable<number>;
}

export function PlacePending({ isEligible, visibility = 0 }: PlacePendingProps) {
	return (
		<>
			<Logo />
			<UneligibleWarning
				transparency={spring(() => math.min((read(isEligible) ? 0 : 1) + read(visibility), 1), 0.2)}
			/>
		</>
	);
}
