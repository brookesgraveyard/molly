export function waitForDocument<K>(documents: Map<Player, K>, player: Player): K | void {
	if (documents.has(player)) return documents.get(player)!;

	while (!documents.has(player) && player.Parent) {
		task.wait();
	}

	if (!player.Parent) {
		warn(`Player ${player.Name} (${player.UserId}) left before document could load.`);
		return;
	}
	return documents.get(player)!;
}

export function datastoreWarn(...args: unknown[]) {
	return warn("[Lapis Error]", ...args);
}
