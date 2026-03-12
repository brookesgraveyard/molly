import { OnStart, Service } from "@flamework/core";
import { createCollection, Document } from "@rbxts/lapis";
import { CollectionService, MarketplaceService, Players } from "@rbxts/services";
import { Array, Dictionary } from "@rbxts/sift";
import { Analytics } from "server/generated/blink";
import { OnPlayerAdded, OnPlayerRemoving } from "server/hook-managers/player-hook-manager";
import { createLogger } from "shared/logger";
import { datastoreWarn, waitForDocument } from "shared/utils/data";

export type ServerTracking =
	| "JoinedWithNewerAccount"
	| "JoinedWithNewAccount"
	| "JoinedFromPlayer"
	| "Died"
	| "Spent5min"
	| "Spent10min"
	| "Spent30min"
	| "Spent1hour"
	| "Spent2hours"
	| "Spent5hours"
	| "Spent10hours"
	| "SpentMoney";

type AnalyticName = ServerTracking | keyof typeof Analytics;

interface Analytic {
	name: AnalyticName;
	achievedAt: number;
}

interface AnalyticsDocument {
	joinedAt: number;
	stats: Analytic[];
}

const collection = createCollection<AnalyticsDocument, true>("Analytics", {
	defaultData: () => ({
		joinedAt: os.time(),
		stats: [],
	}),
	// TODO write this!!!!! (WE CAN ONLY USE @rbxts/t for some goddamn reason)
	validate: undefined,
});

@Service()
export class TrackingService implements OnPlayerAdded, OnPlayerRemoving, OnStart {
	private logger = createLogger("TrackingService");
	private playerToTimeTrackerThreads = new Map<Player, thread[]>();
	private documents = new Map<Player, Document<AnalyticsDocument, true>>();

	public async writeAnalytic(player: Player, name: AnalyticName) {
		const document = waitForDocument(this.documents, player);
		if (!document) return;

		const data = document.read();
		if (!data.stats.find(x => x.name === name)) {
			const stats = Array.push(data.stats, {
				name,
				achievedAt: os.time(),
			});
			document.write(Dictionary.merge(data, { stats }));
			await document.save().then(() => this.logger.debug(`Tracked and saved that @${player.Name} ${name}`)).catch(
				datastoreWarn,
			);
		}
	}

	onCharacter(character: Model, player: Player): void {
		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid) this.onHumanoid(humanoid, character, player);
		character.ChildAdded.Connect((x) => x.IsA("Humanoid") && this.onHumanoid(x, character, player));

		for (const descendant of character.GetDescendants()) this.onPart(descendant);
		character.DescendantAdded.Connect((x) => this.onPart(x));

		task.spawn(() => {
			character.PrimaryPart = character.WaitForChild<BasePart>("Head");
			character.PrimaryPart.PivotOffset = new CFrame(0, -4.5, 0);
		});
	}

	onHumanoid(humanoid: Humanoid, _character: Model, player: Player): void {
		humanoid.Died.Connect(() => this.writeAnalytic(player, "Died"));
	}

	onPart(part: Instance) {
		CollectionService.AddTag(part, "PlayerCharacter");
	}

	onStart(): void {
		MarketplaceService.ProcessReceipt = (info) => {
			const player = Players.GetPlayerByUserId(info.PlayerId);
			if (player && info.CurrencySpent > 0) {
				this.writeAnalytic(player, "SpentMoney");
				return Enum.ProductPurchaseDecision.PurchaseGranted;
			} else {
				return Enum.ProductPurchaseDecision.NotProcessedYet;
			}
		};
	}

	async onPlayerAdded(player: Player): Promise<void> {
		collection.load(`analytics-${player.UserId}`, [player.UserId]).then(document => {
			if (!player.Parent) return document.close().catch(datastoreWarn);
			this.documents.set(player, document);
		}).catch(datastoreWarn);

		if (player.Character) this.onCharacter(player.Character, player);
		player.CharacterAdded.Connect((x) => this.onCharacter(x, player));

		if (player.AccountAge <= 5) this.writeAnalytic(player, "JoinedWithNewAccount");
		else if (player.AccountAge <= 30) this.writeAnalytic(player, "JoinedWithNewerAccount");
		if (player.FollowUserId) this.writeAnalytic(player, "JoinedFromPlayer");

		this.playerToTimeTrackerThreads.set(player, [
			task.delay(5 * 60, () => player.Parent && this.writeAnalytic(player, "Spent5min")),
			task.delay(10 * 60, () => player.Parent && this.writeAnalytic(player, "Spent10min")),
			task.delay(30 * 60, () => player.Parent && this.writeAnalytic(player, "Spent30min")),
			task.delay(1 * 60 * 60, () => player.Parent && this.writeAnalytic(player, "Spent1hour")),
			task.delay(2 * 60 * 60, () => player.Parent && this.writeAnalytic(player, "Spent2hours")),
			task.delay(5 * 60 * 60, () => player.Parent && this.writeAnalytic(player, "Spent5hours")),
			task.delay(10 * 60 * 60, () => player.Parent && this.writeAnalytic(player, "Spent10hours")),
		]);
	}

	onPlayerRemoving(player: Player): void {
		this.documents.get(player)?.close().catch(datastoreWarn);
		this.documents.delete(player);

		for (const thread of this.playerToTimeTrackerThreads.get(player)!) pcall(task.cancel, thread);
		this.playerToTimeTrackerThreads.delete(player);
	}
}
