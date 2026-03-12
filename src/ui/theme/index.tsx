import Vide, { context, Derivable, Node, read, source } from "@rbxts/vide";
import { lerpColor3 } from "shared/utils/lerp";
import { dissolve } from "shared/utils/vide/dissolve";
import { Align2d } from "ui/align-2d";
import { ListY } from "ui/components/styles/list";

import { DARK_THEME } from "./dark";
import { LIGHT_THEME } from "./light";
import type { ThemeDefinition, ThemeFontDefinition } from "./types";

export type * from "./types";

export const THEMES = [DARK_THEME, LIGHT_THEME];

export const userTheme = source(DARK_THEME);
export const currentTheme = context<Derivable<ThemeDefinition>>(userTheme);

function createThemeIndexSource<A extends keyof ThemeDefinition>(a: A): Derivable<ThemeDefinition[A]>;
function createThemeIndexSource<A extends keyof ThemeDefinition, B extends keyof ThemeDefinition[A]>(
	a: A,
	b: B,
): Derivable<ThemeDefinition[A][B]>;
function createThemeIndexSource(...indexes: unknown[]) {
	const len = indexes.size();

	function derived() {
		let result = read(currentTheme());
		for (const index of $range(1, len)) result = result[indexes[index - 1] as never];
		return result as never;
	}

	return derived;
}

function wrapDerivableFont(derived: Derivable<ThemeFontDefinition>) {
	return {
		font: dissolve((read) => read(derived).font),
		remSize: dissolve((read) => read(derived).remSize),
	};
}

export namespace Typography {
	export const header = wrapDerivableFont(createThemeIndexSource("typography", "header"));
	export const subheader = wrapDerivableFont(createThemeIndexSource("typography", "subheader"));
	export const windowheader = wrapDerivableFont(createThemeIndexSource("typography", "windowHeader"));
	export const body = wrapDerivableFont(createThemeIndexSource("typography", "body"));
	export const subtext = wrapDerivableFont(createThemeIndexSource("typography", "subtext"));
	export const button = wrapDerivableFont(createThemeIndexSource("typography", "button"));
}

export namespace Colors {
	export const base = createThemeIndexSource("colors", "base");
	export const inverted = createThemeIndexSource("colors", "inverted");
	export const body = createThemeIndexSource("colors", "body");
	export const floating = createThemeIndexSource("colors", "floating");

	export const red = createThemeIndexSource("colors", "red");
	export const yellow = createThemeIndexSource("colors", "yellow");
	export const green = createThemeIndexSource("colors", "green");
	export const blue = createThemeIndexSource("colors", "blue");
	export const purple = createThemeIndexSource("colors", "purple");

	export function blendGleam(target: Derivable<Color3>) {
		return dissolve((read) => lerpColor3(read(target), read(base), 0.5));
	}

	export function blendBase(target: Derivable<Color3>) {
		return dissolve((read) => lerpColor3(read(target), read(base), 0.7));
	}

	export function blendBaseHover(target: Derivable<Color3>) {
		return dissolve((read) => lerpColor3(read(target), read(base), 2 / 3));
	}

	export function blendCrust(target: Derivable<Color3>) {
		return dissolve((read) => lerpColor3(read(target), read(base), 0.9));
	}
}

export interface ThemePreviewProps {
	fillDirection?: "x" | "y";
	align?: Align2d;
	render: () => Node;
}

export function ThemePreview({ fillDirection = "x", align = "mm", render }: ThemePreviewProps) {
	return (
		<frame Name="ThemePreview" Size={UDim2.fromScale(1, 1)}>
			<uigridlayout
				CellSize={fillDirection === "x" ? UDim2.fromScale(1 / THEMES.size(), 1) : UDim2.fromScale(1, 1 / THEMES.size())}
				CellPadding={new UDim2()}
				FillDirection={fillDirection === "x" ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical}
			/>
			{THEMES.map((theme) => (
				<frame Name={theme.name} BackgroundColor3={theme.colors.base}>
					<ListY align={align} />
					{currentTheme(theme, render)}
				</frame>
			))}
		</frame>
	);
}
