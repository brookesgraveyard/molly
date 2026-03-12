import { md5 } from "@rbxts/hashlib";
import { DEATHLIST_IDS } from "shared/generated/deathlist";

export class DeathlistManager {
	private idsToHashed = new Map<number, string>();

	constructor() {}

	isInDeathlist(userId: number) {
		return DEATHLIST_IDS.has(this.getHashed(userId));
	}

	getHashed(userId: number) {
		let hashed = this.idsToHashed.get(userId);
		if (hashed) return hashed;
		hashed = md5(tostring(userId));
		this.idsToHashed.set(userId, hashed);
		return hashed;
	}
}
