import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { useRem } from "ui/rem";

import { AddPartWindow } from "./add-part";

export = CreateVideStory({
	vide: Vide,
	controls: {
		show: true,
	},
}, ({ controls }) => {
	useRem();
	return <AddPartWindow show={controls.show} />;
});
