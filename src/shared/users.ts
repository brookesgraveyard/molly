import { Players } from "@rbxts/services";

export enum UserId {
	ImNotFireMan123 = 1275426298,
	GABA8 = 304346361,
}

export const DEVELOPERS = new Set<number>([UserId.ImNotFireMan123, UserId.GABA8]);

export function isHost(player: Player = Players.LocalPlayer) {
	return DEVELOPERS.has(player.UserId);
}
