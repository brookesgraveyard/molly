import Vide, { read } from "@rbxts/vide";
import { FontFamily } from "shared/fonts";
import assets from "shared/generated/assets";
import { FlexFill } from "ui/components/styles/flex";
import { ListX, ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";

import { BasePanel, defaultThubmanil, PanelProps } from "./base";

const RAPTV_ACCENT = "#f7650a";

function accent(str: string) {
	return `<font color="${RAPTV_ACCENT}">${str}</font>`;
}

export function RapTVPanel({ username = "YE", thumbnail = defaultThubmanil }: PanelProps) {
	return (
		<BasePanel name="RapTVPanel">
			<imagelabel
				Name="Thumbnail"
				AnchorPoint={new Vector2(0.5, 0)}
				Size={UDim2.fromScale(1.5, 1.5)}
				Position={UDim2.fromScale(0.5, -0.125)}
				Image={thumbnail}
				BackgroundTransparency={1}
			/>
			<frame
				Name="Content"
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromScale(0, 1 - 0.5 - 0.1)}
				Size={UDim2.fromScale(1, 0.5)}
				BackgroundColor3={new Color3()}
			>
				<uigradient
					Transparency={new NumberSequence(1, 0)}
					Rotation={90}
				/>
				<ListY align="bl" />
				<Padding paddingX={new UDim(0.025, 0)} />
				<textlabel
					Size={UDim2.fromScale(0.125, 0.1)}
					FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Bold)}
					Text="NEWS"
					RichText
					TextScaled
				>
					<Padding paddingX={new UDim(0.1, 0)} />
				</textlabel>
				<textlabel
					Size={UDim2.fromScale(1, 0)}
					TextColor3={new Color3(1, 1, 1)}
					FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Bold)}
					Text={() => {
						return `${
							accent(
								read(username).upper(),
							)
						}\nGETS ${accent("BANNED")} FROM ${accent("OCPLACE")} AND ${accent("ROBLAUDIO")}`;
					}}
					RichText
					TextWrapped
					TextScaled
					LineHeight={2 / 3}
					BackgroundTransparency={1}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Bottom}
				>
					<FlexFill />
				</textlabel>
				<textlabel
					Size={UDim2.fromScale(1, 0.1)}
					TextColor3={new Color3(1, 1, 1)}
					FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Regular, Enum.FontStyle.Italic)}
					Text="What do yall think of their past actions?"
					TextTransparency={0.5}
					RichText
					TextWrapped
					TextScaled
					BackgroundTransparency={1}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				>
				</textlabel>
			</frame>
			<frame
				Name="Bottom"
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.1)}
				BackgroundColor3={new Color3()}
			>
				<ListX align="ml" padding={new UDim(0.02, 0)} />
				<Padding paddingLeft={new UDim(0.02, 0)} paddingRight={new UDim(0.025, 0)} />
				<imagelabel
					Name="Logo"
					Size={UDim2.fromScale(1, 1)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					Image={assets.deathlist.raptv}
				/>
				<frame
					Name="Bar"
					Size={UDim2.fromScale(0, 0.025)}
					BackgroundTransparency={0.5}
				>
					<FlexFill />
				</frame>
			</frame>
		</BasePanel>
	);
}
