import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { BannedPanel } from "./banned";

export = CreateVideStory({
	vide: Vide,
}, () => {
	return <BannedPanel />;
});
