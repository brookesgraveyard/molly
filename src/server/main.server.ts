import { Flamework } from "@flamework/core";
import { ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { Suite } from "@rbxts/zest";
import { flameworkIgnited, panic } from "shared/flamework";
import { createLogger } from "shared/logger";

function pathToInstance([root, parts]: [Instance, string[]]) {
	for (const part of parts) {
		root = root.WaitForChild(part);
	}
	return root;
}

const logger = createLogger("server");

try {
	logger.trace("Starting server");

	Flamework.addPaths("src/server/hook-managers");
	Flamework.addPaths("src/server/services");
	Flamework.ignite();
	flameworkIgnited.Fire();

	logger.trace("Flamework ignited");

	const checkFor = [
		...ReplicatedStorage.WaitForChild("Shared").GetDescendants(),
		...ServerScriptService.WaitForChild("Server").GetDescendants(),
	];

	const specModules = [
		...checkFor,
		...pathToInstance($getModuleTree("@rbxts/zest")).GetDescendants(),
		// not done yet
		// ...pathToInstance($getModuleTree("@rbxts/tenna")).GetDescendants(),
		// ...pathToInstance($getModuleTree("@rbxts/rottie")).GetDescendants(),
		// ...pathToInstance($getModuleTree("@rbxts/pls-tip")).GetDescendants(),
	].filter((instance) => instance.IsA("ModuleScript") && instance.Name.match("%.spec$")[0] !== undefined);

	if (RunService.IsStudio()) {
		logger.trace("Running zest suite");
		new Suite()
			.collectModules(specModules)
			.runAndPrint();
	}

	logger.trace("Deleting specs");
	for (const module of specModules) module.Destroy();

	logger.trace("Deleting stories");
	for (
		const story of checkFor.filter((instance) => {
			return instance.IsA("ModuleScript") && instance.Name.match("%.story$")[0] !== undefined;
		})
	) {
		logger.trace("Deleting story", story.GetFullName());
		story.Destroy();
	}

	logger.trace("Finished start up");
} catch (e) {
	panic(`Failed to ignite server; ${e}`);
}

// Players.BanAsync({
// 	UserIds: [UserId.GABA8],
// 	ApplyToUniverse: true,
// 	Duration: -1,
// 	DisplayReason: "Go fuck yourself",
// 	PrivateReason: "Wow",
// });
// Rude.
