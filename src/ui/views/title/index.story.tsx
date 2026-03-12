import Object from "@rbxts/object-utils";
import { Choose, CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { PlaceStatus } from "shared/constants/place";
import { createLogger } from "shared/logger";
import { useRem } from "ui/rem";

import { PlaceTitle } from ".";

const placeStatusKeys = Object.keys(PlaceStatus);

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			isEligible: true,
			placeStatus: Choose(placeStatusKeys, placeStatusKeys.indexOf("Pending") + 1),
		},
	},
	({ controls }) => {
		useRem();
		const logger = createLogger("PlaceStatus.story");

		return (
			<PlaceTitle
				isEligible={controls.isEligible}
				placeStatus={() => PlaceStatus[controls.placeStatus()]}
			/>
		);
	},
);
