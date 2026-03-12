import Vide from "@rbxts/vide";
import { Text } from "ui/components/text";

import { Logo } from "./logo";

export function PlaceConcluded() {
	return (
		<>
			<Logo />
			<Text
				text={"OCPlace has concluded." + "\nThank you for your participation!"
					+ "\nYou can play the finished product at the ObbyId:"}
				align="mm"
			/>
			<Text text="ImNotFireMan123#25" />
			<Text text="Also checkout Roblaudio!" />
		</>
	);
}
