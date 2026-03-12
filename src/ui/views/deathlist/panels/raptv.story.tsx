import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { RapTVPanel } from "./raptv";

export = CreateVideStory({
	vide: Vide,
	controls: {
		username: "mario118118",
	},
}, ({ controls }) => {
	return <RapTVPanel username={controls.username} />;
});
