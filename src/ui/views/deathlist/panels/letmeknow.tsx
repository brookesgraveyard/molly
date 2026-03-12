import Vide from "@rbxts/vide";
import assets from "shared/generated/assets";

import { BasePanel } from "./base";

export function LetMeKnowPanel() {
	return (
		<BasePanel name="LetMeKnowPanel">
			<imagelabel Size={UDim2.fromScale(1, 1)} Image={assets.deathlist.letmeknowdog} />
		</BasePanel>
	);
}
