import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { DharMannPanel } from "./dharmann";

export = CreateVideStory({
	vide: Vide,
	controls: {
		username: "mario118118",
	},
}, ({ controls }) => {
	return <DharMannPanel username={controls.username} />;
});
