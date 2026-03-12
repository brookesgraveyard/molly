import Vide, { Derivable } from "@rbxts/vide";
import { PlaceStatus } from "shared/constants/place";
import { match } from "shared/utils/vide/primitives";
import { ListY } from "ui/components/styles/list";
import { wrapRemUDim } from "ui/rem";

import { PlaceActive } from "./active";
import { PlaceConcluded } from "./concluded";
import { PlacePending } from "./pending";

export interface PlaceTitleProps {
	isEligible?: Derivable<boolean>;
	placeStatus?: Derivable<PlaceStatus>;
	visibility?: Derivable<number>;
}

export function PlaceTitle({ isEligible, placeStatus = PlaceStatus.Pending, visibility = 0 }: PlaceTitleProps) {
	return (
		<frame Name="PlaceTitle" BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<ListY align="mm" padding={wrapRemUDim(1)} />
			{match(placeStatus, {
				[PlaceStatus.Pending]: () => <PlacePending isEligible={isEligible} />,
				[PlaceStatus.Active]: () => <PlaceActive isEligible={isEligible} />,
				[PlaceStatus.Concluded]: () => <PlaceConcluded />,
			})}
		</frame>
	);
}
