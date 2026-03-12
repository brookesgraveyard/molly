import { FontFamily } from "shared/fonts";
import Oklab from "shared/utils/color/oklab";

import { ThemeDefinition } from "./types";

function lch(lightness: number, chroma: number, hue: number) {
	return Oklab.linear_srgb_to_color3(
		Oklab.oklab_to_linear_srgb(Oklab.oklch_to_oklab(new Vector3(lightness, chroma, hue))),
	);
}

const ACCENT_LIGHTNESS = 2 / 3;
const ACCENT_CHROMA = 1 / 3;

export const DARK_THEME = identity<ThemeDefinition>({
	name: "Dark",

	typography: {
		header: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.Bold), remSize: 4 },
		subheader: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.SemiBold), remSize: 3 },
		windowHeader: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.SemiBold), remSize: 2 },
		body: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.Regular), remSize: 2 },
		subtext: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.Regular), remSize: 1.2 },
		button: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.Medium), remSize: 2 },
		input: { font: new Font(FontFamily.Montserrat, Enum.FontWeight.Regular), remSize: 2 },
	},

	colors: {
		base: lch(0.2, 0, 0),
		inverted: lch(0.9, 0, 0),
		body: lch(0.8, 0, 0),
		floating: lch(1, 0, 0), // lch(100, 100, 100)

		red: lch(ACCENT_LIGHTNESS, ACCENT_CHROMA, 30 / 360),
		yellow: lch(ACCENT_LIGHTNESS, ACCENT_CHROMA, 60 / 360),
		green: lch(ACCENT_LIGHTNESS, ACCENT_CHROMA, 140 / 360),
		blue: lch(ACCENT_LIGHTNESS, ACCENT_CHROMA, 240 / 360),
		purple: lch(ACCENT_LIGHTNESS, ACCENT_CHROMA, 270 / 360),
	},
});
