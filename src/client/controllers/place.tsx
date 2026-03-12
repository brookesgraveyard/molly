import { Controller } from "@flamework/core";
import Iris from "@rbxts/iris";
import Object from "@rbxts/object-utils";
import { Dev } from "client/generated/blink";
import { placeStatus } from "shared/atoms";
import { PlaceStatus } from "shared/constants/place";

import { DevPanelDropdown } from "./devpanel";

@Controller()
export class PlaceController implements DevPanelDropdown {
	static FINAL_OBBY_ID = "ImNotFireMan123#25";

	renderDevPanelDropdown(): void {
		Iris.SeparatorText([`Place Status: ${PlaceStatus[placeStatus()]}`]);

		Iris.SameLine([]);
		for (const status of Object.values(PlaceStatus)) {
			if (typeIs(status, "number") && Iris.Button([PlaceStatus[status]]).clicked()) {
				Dev.OverridePlaceStatus.fire(status);
			}
		}
		Iris.End();
	}
}
