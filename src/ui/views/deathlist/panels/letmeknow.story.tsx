import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { LetMeKnowPanel } from "./letmeknow";

export = CreateVideStory({
	vide: Vide,
}, () => {
	return <LetMeKnowPanel />;
});
