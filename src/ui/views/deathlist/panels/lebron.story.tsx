import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { LeBronPanel } from "./lebron";

export = CreateVideStory({
	vide: Vide,
	controls: {
		username: "mario118118",
	},
}, ({ controls }) => {
	return <LeBronPanel username={controls.username} />;
});
