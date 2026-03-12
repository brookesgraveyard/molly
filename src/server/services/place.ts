import { OnInit, Service } from "@flamework/core";
import { t } from "@rbxts/t";
import { Dev } from "server/generated/blink";
import { placeStatus } from "shared/atoms";
import { PlaceStatus } from "shared/constants/place";
import { createLogger } from "shared/logger";
import { isHost } from "shared/users";

const valueOfPlaceStatus = t.valueOf(PlaceStatus);

@Service()
export class PlaceService implements OnInit {
	private logger = createLogger("PlaceService");

	onInit(): void | Promise<void> {
		Dev.OverridePlaceStatus.on((player, status) => {
			if (!isHost(player)) return;
			if (!valueOfPlaceStatus(status)) return;
			this.logger.trace(
				"Host",
				player,
				"is overriding place status from",
				PlaceStatus[placeStatus()],
				"to",
				PlaceStatus[status],
			);
			placeStatus(status);
		});
	}
}
