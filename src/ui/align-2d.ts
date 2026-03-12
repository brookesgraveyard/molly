/* eslint-disable no-fallthrough */

import Object from "@rbxts/object-utils";
import { EnumList } from "@rbxts/ui-labs";
import { Derivable } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";

import { Align1d } from "./types";

export type Align2d = `${"t" | "m" | "b"}${"l" | "m" | "r"}`;

export const ALL_ALIGN_2DS = ["tl", "tm", "tr", "ml", "mm", "mr", "bl", "bm", "br"] as const satisfies Align2d[];

// Align2d -> Properties

/**
 * Represents an Align2d as a `UDim2 to be used as the `Position` of
 * `GuiObject`s.
 */
export function positionFromAlign2d(align2d: Align2d) {
	switch (align2d) {
		case "tl":
			return UDim2.fromScale(0, 0);
		case "tm":
			return UDim2.fromScale(0.5, 0);
		case "tr":
			return UDim2.fromScale(1, 0);
		case "ml":
			return UDim2.fromScale(0, 0.5);
		case "mm":
			return UDim2.fromScale(0.5, 0.5);
		case "mr":
			return UDim2.fromScale(1, 0.5);
		case "bl":
			return UDim2.fromScale(0, 1);
		case "bm":
			return UDim2.fromScale(0.5, 1);
		case "br":
			return UDim2.fromScale(1, 1);
	}
}

/**
 * Represents an Align2d as a `Vector2` to be used as the `AnchorPoint` of
 * `GuiObject`s.
 */
export function anchorPointFromAlign2d(align2d: Align2d) {
	switch (align2d) {
		case "tl":
			return new Vector2(0, 0);
		case "tm":
			return new Vector2(0.5, 0);
		case "tr":
			return new Vector2(1, 0);
		case "ml":
			return new Vector2(0, 0.5);
		case "mm":
			return new Vector2(0.5, 0.5);
		case "mr":
			return new Vector2(1, 0.5);
		case "bl":
			return new Vector2(0, 1);
		case "bm":
			return new Vector2(0.5, 1);
		case "br":
			return new Vector2(1, 1);
	}
}

/**
 * Returns a derivable that represents an Align2d as a `UDim2` to be used as the
 * `Position` of `GuiObject`s.
 */
export function positionFromDerivableAlign2d(align2d: Derivable<Align2d>) {
	return dissolve((read) => positionFromAlign2d(read(align2d)));
}

/**
 * Returns a derivable that represents an Align2d as a `Vector2` to be used as
 * the `AnchorPoint` of `GuiObject`s.
 */
export function anchorPointFromDerivableAlign2d(align2d: Derivable<Align2d>) {
	return dissolve((read) => anchorPointFromAlign2d(read(align2d)));
}

// Align1d -> Align2d

/** Converts a pair of `Align1d` to an `Align2d. */
export function align1dsTo2d(x: Align1d, y: Align1d): Align2d {
	switch (x) {
		case "start":
			switch (y) {
				case "start":
					return "tl";
				case "mid":
					return "tm";
				case "end":
					return "tr";
			}
		case "mid":
			switch (y) {
				case "start":
					return "ml";
				case "mid":
					return "mm";
				case "end":
					return "mr";
			}
		case "end":
			switch (y) {
				case "start":
					return "bl";
				case "mid":
					return "bm";
				case "end":
					return "br";
			}
	}
}

/** Returns a derivable that converts a pair of `Align1d` to an `Align2d. */
export function derivableAlign1dsTo2d(x: Derivable<Align1d>, y: Derivable<Align1d>) {
	return dissolve((read) => align1dsTo2d(read(x), read(y)));
}

/** Converts the x component of an `Align2d` to an `Align1d`. */
export function xComponentToAlign1d(align2d: Align2d): Align1d {
	const xComponent = string.sub(align2d, 2);
	switch (xComponent) {
		case "l":
			return "start";
		case "m":
			return "mid";
		case "r":
			return "end";
	}
	throw `Align2d is has invalid x component "${xComponent}"`;
}

/**
 * Returns a derivable that converts the x component of an `Align2d` to an
 * `Align1d`.
 */
export function derivableXComponentToAlign1d(align2d: Derivable<Align2d>) {
	return dissolve((read) => xComponentToAlign1d(read(align2d)));
}

/** Converts the y component of an `Align2d` to an `Align1d`. */
export function yComponentToAlign1d(align2d: Align2d): Align1d {
	const yComponent = string.sub(align2d, 1, 1);
	switch (yComponent) {
		case "t":
			return "start";
		case "m":
			return "mid";
		case "b":
			return "end";
	}
	throw `Align2d is has invalid y component "${yComponent}"`;
}

/**
 * Returns a derivable that converts the y component of an `Align2d` to an
 * `Align1d`.
 */
export function derivableYComponentToAlign1d(align2d: Derivable<Align2d>) {
	return dissolve((read) => yComponentToAlign1d(read(align2d)));
}

/** Converts an `Align2d` to a pair of `Align1d`s. */
export function align2dTo1ds(align2d: Align2d): LuaTuple<[x: Align1d, y: Align1d]> {
	return $tuple(xComponentToAlign1d(align2d), yComponentToAlign1d(align2d));
}

/** Returns a derivable that converts an `Align2d` to a pair of `Align1d`s. */
export function derivableAlign2dTo1ds(align2d: Derivable<Align2d>) {
	return $tuple(derivableXComponentToAlign1d(align2d), derivableYComponentToAlign1d(align2d));
}

// Align2d -> Alignment Enums

export function align2dToHorizontalAlignment(align2d: Align2d): Enum.HorizontalAlignment {
	switch (xComponentToAlign1d(align2d)) {
		case "start":
			return Enum.HorizontalAlignment.Left;
		case "mid":
			return Enum.HorizontalAlignment.Center;
		case "end":
			return Enum.HorizontalAlignment.Right;
	}
}

export function align2dToVerticalAlignment(align2d: Align2d): Enum.VerticalAlignment {
	switch (yComponentToAlign1d(align2d)) {
		case "start":
			return Enum.VerticalAlignment.Top;
		case "mid":
			return Enum.VerticalAlignment.Center;
		case "end":
			return Enum.VerticalAlignment.Bottom;
	}
}

export function align2dToAlignments(
	align2d: Align2d,
): LuaTuple<[x: Enum.HorizontalAlignment, y: Enum.VerticalAlignment]> {
	return $tuple(align2dToHorizontalAlignment(align2d), align2dToVerticalAlignment(align2d));
}

export function derivableAlign2dToHorizontalAlignment(align2d: Derivable<Align2d>) {
	return dissolve((read) => align2dToHorizontalAlignment(read(align2d)));
}

export function derivableAlign2dToVerticalAlignment(align2d: Derivable<Align2d>) {
	return dissolve((read) => align2dToVerticalAlignment(read(align2d)));
}

export function derivableAlign2dToAlignments(align2d: Derivable<Align2d>) {
	return $tuple(derivableAlign2dToHorizontalAlignment(align2d), derivableAlign2dToVerticalAlignment(align2d));
}

// Align2d -> TextAlignment

export function align2dToTextXAlignment(align2d: Align2d): Enum.TextXAlignment {
	switch (xComponentToAlign1d(align2d)) {
		case "start":
			return Enum.TextXAlignment.Left;
		case "mid":
			return Enum.TextXAlignment.Center;
		case "end":
			return Enum.TextXAlignment.Right;
	}
}

export function align2dToTextYAlignment(align2d: Align2d): Enum.TextYAlignment {
	switch (yComponentToAlign1d(align2d)) {
		case "start":
			return Enum.TextYAlignment.Top;
		case "mid":
			return Enum.TextYAlignment.Center;
		case "end":
			return Enum.TextYAlignment.Bottom;
	}
}

export function align2dToTextAlignments(align2d: Align2d) {
	return $tuple(align2dToTextXAlignment(align2d), align2dToTextYAlignment(align2d));
}

export function derivableAlign2dToTextXAlignment(align2d: Derivable<Align2d>) {
	return dissolve((read) => align2dToTextXAlignment(read(align2d)));
}

export function derivableAlign2dToTextYAlignment(align2d: Derivable<Align2d>) {
	return dissolve((read) => align2dToTextYAlignment(read(align2d)));
}

export function derivableAlign2dToTextAlignments(align2d: Derivable<Align2d>) {
	return $tuple(derivableAlign2dToTextXAlignment(align2d), derivableAlign2dToTextYAlignment(align2d));
}

// UILabs utilities

const READABLE_ALIGN_2DS = {
	["Top Left"]: "tl",
	["Top Middle"]: "tm",
	["Top Right"]: "tr",
	["Middle Left"]: "ml",
	["Middle"]: "mm",
	["Middle Right"]: "mr",
	["Bottom Left"]: "bl",
	["Bottom Middle"]: "bm",
	["Bottom Right"]: "br",
} as const satisfies Record<string, Align2d>;

const RAW_TO_READABLE = Object.fromEntries(
	Object.entries(READABLE_ALIGN_2DS).map(([readable, real]) => [real, readable] as const),
);

type ReadableAlign2d = keyof typeof READABLE_ALIGN_2DS;

export function uiLabsChooseAlign2d(choice: Align2d | ReadableAlign2d) {
	return choice in READABLE_ALIGN_2DS
		? EnumList(READABLE_ALIGN_2DS, choice)
		: EnumList(READABLE_ALIGN_2DS, RAW_TO_READABLE[choice as never]);
}
