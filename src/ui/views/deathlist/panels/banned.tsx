import Vide from "@rbxts/vide";
import { FontFamily } from "shared/fonts";

import { BasePanel, PanelProps } from "./base";

export function BannedPanel(_: PanelProps) {
	return (
		<BasePanel name="BannedPanel" bg={new Color3(0, 0, 0)}>
			<textlabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.75, 0.5)}
				BackgroundTransparency={1}
				FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Light)}
				TextColor3={new Color3(1, 1, 1)}
				Text="Due to your past history in Obby Creator, <b>you are deemed too dangerous for OCPlace and future projects by Roblaudio.</b> We will only consider unbanning if you have shown to improve over time."
				TextScaled
				RichText
			>
			</textlabel>
		</BasePanel>
	);
}
