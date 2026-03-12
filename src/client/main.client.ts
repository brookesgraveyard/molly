// Dogshit
// Your errors wasnt even that good anyway
import Vide from "@rbxts/vide";
Vide.strict = false;

import { Flamework } from "@flamework/core";
import { flameworkIgnited, panic } from "shared/flamework";

try {
	Flamework.addPaths("src/client/hook-managers");
	Flamework.addPaths("src/client/controllers");
	Flamework.addPaths("src/shared/hook-managers");
	Flamework.ignite();
	flameworkIgnited.Fire();
} catch (e) {
	panic(`Failed to ignite client; ${e}`);
}
