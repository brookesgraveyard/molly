import Signal from "@rbxts/lemon-signal";
import { Players, RunService } from "@rbxts/services";

import { createLogger } from "./logger";

const logger = createLogger("flamework");

export const flameworkIgnited = new Signal();
export const flameworkExtinguished = new Signal();

export function panic(message: string): never {
	const isClient = RunService.IsClient();

	const fmtMessage = `The ${isClient ? "client" : "server"} panicked: ${message}.`
		+ "\nThis is a bug with OCPlace."
		+ "\nPlease file a bug report in the community server."
		+ "\nOCPlace will make a best effort recovery.";

	logger.error(`Panicked: ${message}`);
	pcall(() => flameworkExtinguished.Fire());

	if (isClient) {
		Players.LocalPlayer.Kick(fmtMessage);
	} else {
		for (const player of Players.GetPlayers()) player.Kick(fmtMessage);
		Players.PlayerAdded.Connect((player) => player.Kick(fmtMessage));
	}

	throw message;
}
