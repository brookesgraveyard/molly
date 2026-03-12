import Vide, { read } from "@rbxts/vide";
import { FontFamily } from "shared/fonts";
import assets from "shared/generated/assets";
import { FlexFill } from "ui/components/styles/flex";
import { ListX } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";

import { BasePanel, defaultThubmanil, PanelProps } from "./base";

const RAPTV_ACCENT = "#f7650a";

function accent(str: string) {
	return `<font color="${RAPTV_ACCENT}">${str}</font>`;
}

export function LeBronPanel({ username = "LEBRON JAMES", thumbnail = defaultThubmanil }: PanelProps) {
	return (
		<BasePanel name="LeBronPanel">
			<imagelabel
				Name="Player"
				Position={UDim2.fromScale(-0.25, 0)}
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundTransparency={1}
				Image={thumbnail}
			>
			</imagelabel>
			<imagelabel
				Name="LeBron"
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1, 1 - 0.4 - 0.1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				Image={assets.deathlist.lebron}
			>
			</imagelabel>
			<frame
				Name="Fade"
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromScale(0, 1 - 0.4 - 0.1 - 0.1)}
				Size={UDim2.fromScale(1, 0.1)}
				BackgroundColor3={new Color3()}
			>
				<uigradient
					Transparency={new NumberSequence(1, 0)}
					Rotation={90}
				/>
			</frame>
			<textlabel
				Name="Content"
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromScale(0, 1 - 0.4 - 0.1)}
				Size={UDim2.fromScale(1, 0.4)}
				BackgroundColor3={new Color3()}
				TextColor3={new Color3(1, 1, 1)}
				FontFace={new Font(FontFamily.Montserrat, Enum.FontWeight.Bold)}
				Text={() => {
					return `${
						accent(
							read(username).upper(),
						)
					}\nREPORTEDLY ${accent("BANNED")} FROM ${accent("OCPLACE")} AND ${accent("ROBLAUDIO")}`;
				}}
				RichText
				TextWrapped
				TextScaled
				LineHeight={2 / 3}
				TextXAlignment={Enum.TextXAlignment.Center}
				TextYAlignment={Enum.TextYAlignment.Bottom}
			>
				<Padding paddingX={new UDim(0.025, 0)} />
			</textlabel>
			<frame
				Name="Bottom"
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.1)}
				BackgroundColor3={new Color3()}
			>
				<ListX align="ml" padding={new UDim(0.02, 0)} />
				<Padding paddingLeft={new UDim(0.02, 0)} paddingRight={new UDim(0.025, 0)} />
				<frame
					Name="Left"
					Size={UDim2.fromScale(0, 0.025)}
					BackgroundTransparency={0.5}
				>
					<uigradient
						Transparency={new NumberSequence([
							new NumberSequenceKeypoint(0, 0.5),
							new NumberSequenceKeypoint(0.9, 0.5),
							new NumberSequenceKeypoint(1, 1),
						])}
					/>
					<FlexFill />
				</frame>
				<imagelabel
					Name="Logo"
					Size={UDim2.fromScale(1, 1)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					Image={assets.deathlist.raptv}
				/>
				<frame
					Name="Right"
					Size={UDim2.fromScale(0, 0.025)}
					BackgroundTransparency={0.5}
				>
					<uigradient
						Transparency={new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.1, 0.5),
							new NumberSequenceKeypoint(1, 0.5),
						])}
					/>
					<FlexFill />
				</frame>
			</frame>
		</BasePanel>
	);
}
