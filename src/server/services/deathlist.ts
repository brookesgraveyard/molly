import { Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Deathlist } from "server/generated/blink";
import { OnPlayerAdded } from "server/hook-managers/player-hook-manager";
import { OnBlink } from "shared/decorators";
import { DeathlistManager } from "shared/services/deathlist";
import { retryInfinitelyWithExponentialBackoff } from "shared/utils/retry";

function ban(config: BanAsyncConfig) {
	Players.BanAsync(config);
}

@Service()
export class DeathlistService extends DeathlistManager implements OnPlayerAdded {
	private banPromises = new Map<number, Promise<void>>();

	@OnBlink(Deathlist.SelfBan)
	async banNow(player: Player) {
		const userId = player.UserId;
		if (this.isInDeathlist(userId)) {
			const promise = this.banPromises.get(userId);
			if (promise) {
				pcall((promise) => promise.cancel(), promise);
				this.banPromises.delete(userId);
			}
			await this.ban(userId);
		}
	}

	async promiseBan(userId: number) {
		task.wait(30);
		// Delete now so the player can't override by calling Deathlist.SelfBan
		if (this.banPromises.has(userId)) this.banPromises.delete(userId);
		await this.ban(userId);
	}

	async ban(userId: number) {
		retryInfinitelyWithExponentialBackoff(5, 1.5, ban, {
			UserIds: [userId],
			ApplyToUniverse: true,
			Duration: -1,
			DisplayReason: "Due to your past history in Obby Creator, you are deemed too dangerous for OCPlace and \
                future projects by Roblaudio. We will only consider unbanning if you have shown to improve over time.",
			PrivateReason: "Is in deathlist",
			ExcludeAltAccounts: false,
		});
	}

	/** @hidden */
	onPlayerAdded(player: Player): void {
		const userId = player.UserId;
		if (this.isInDeathlist(userId)) {
			// Don't ban immediately so we can mess with the player via client
			this.banPromises.set(userId, this.promiseBan(player.UserId));
		}
	}
}
