import Vide, { read } from "@rbxts/vide";
import { FontFamily } from "shared/fonts";
import assets from "shared/generated/assets";
import { FlexFill } from "ui/components/styles/flex";
import { ListX } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";

import { BasePanel, defaultThubmanil, PanelProps } from "./base";

const RAPTV_ACCENT = "#07bbff";

function accent(str: string) {
	return `<font color="${RAPTV_ACCENT}">${str}</font>`;
}

export function DharMannPanel({ username = "THIS PLAYER", thumbnail = defaultThubmanil }: PanelProps) {
	return (
		<BasePanel name="DharMannPanel">
			<imagelabel
				Name="Thumbnail"
				AnchorPoint={new Vector2(0, 0.5)}
				Size={UDim2.fromScale(1.75, 1.75)}
				Position={UDim2.fromScale(0, 0.75)}
				Image={thumbnail}
				BackgroundTransparency={1}
			>
			</imagelabel>
			<textlabel
				Name="Content"
				Position={UDim2.fromScale(0, 0.05)}
				Size={UDim2.fromScale(2 / 3, 0.8)}
				BackgroundColor3={new Color3()}
				Text={() => {
					return `${read(username).upper()}\nTHOUGHT THEY'RE TUFF,\n${accent("WHAT HAPPENS NEXT IS SHOCKING")}`;
				}}
				TextColor3={new Color3(1, 1, 1)}
				FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Bold)}
				TextScaled
				RichText
				TextXAlignment={Enum.TextXAlignment.Left}
				LineHeight={2 / 3}
			>
				<Padding paddingX={new UDim(0.025, 0)} />
			</textlabel>
			<frame
				Name="Bottom"
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(0.5, 0.15)}
				BackgroundTransparency={1}
			>
				<frame
					Name="Backing"
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(1, 0.75)}
					BackgroundColor3={new Color3()}
				>
				</frame>
				<frame Name="Content" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
					<ListX align="tl" />
					<imagelabel
						Name="Portrait"
						Size={UDim2.fromScale(1, 1.5)}
						SizeConstraint={Enum.SizeConstraint.RelativeYY}
						Image={assets.deathlist.dharmann}
						BackgroundTransparency={1}
					/>
					<textlabel
						Name="Name"
						Position={UDim2.fromScale(1, 0)}
						Size={UDim2.fromScale(0, 1)}
						Text="Dhar Mann"
						TextColor3={new Color3(1, 1, 1)}
						TextScaled
						RichText
						BackgroundTransparency={1}
						FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Bold)}
					>
						<FlexFill />
						<Padding padding={new UDim(0.05, 0)} paddingTop={new UDim(0.1, 0)} paddingLeft={new UDim()} />
					</textlabel>
				</frame>
			</frame>
		</BasePanel>
	);
}
