import { CreateVideStory, Slider } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { DEATHLIST_PANELS, DeathlistScroller } from ".";

export = CreateVideStory({
	vide: Vide,
	controls: {
		index: Slider(1, 1, DEATHLIST_PANELS.size(), 1),
		show: false,
		username: "mario118118",
	},
}, ({ controls }) => {
	return <DeathlistScroller index={controls.index} show={controls.show} username={controls.username} />;
});
