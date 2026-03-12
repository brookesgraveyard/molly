import { OnStart, Service } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { Analytics } from "server/generated/blink";

import { TrackingService } from "./tracking";

@Service()
export class NetworkService implements OnStart {
	constructor(private trackingService: TrackingService) {}

	onStart(): void {
		this.registerAnalytics();
	}

	private registerAnalytics() {
		for (const key of Object.keys(Analytics)) {
			Analytics[key].on((player) => this.trackingService.writeAnalytic(player, key));
		}
	}
}
