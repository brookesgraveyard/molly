import { Controller, OnStart } from "@flamework/core";
import { MarketplaceService } from "@rbxts/services";
import { Analytics } from "client/generated/blink";

@Controller()
export class TrackingController implements OnStart {
	/** @hidden */
	onStart(): void {
		const trackSpend = () => Analytics.WantedToDonate.fire();
		MarketplaceService.PromptBulkPurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptBundlePurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptGamePassPurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptPremiumPurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptProductPurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptPurchaseFinished.Connect(trackSpend);
		MarketplaceService.PromptSubscriptionPurchaseFinished.Connect(trackSpend);
	}
}
