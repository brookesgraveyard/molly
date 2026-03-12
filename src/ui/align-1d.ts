import { Align1d } from "./types";

export function align1dToTextAlignmentX() {}

export function align1dToTextAlignmentY() {}

/**
 * Represents an Align1d as a `number` from 0 to 1
 */
export function positionFromAlign1d(align1d: Align1d) {
	switch (align1d) {
		case "start":
			return 0;
		case "mid":
			return 0.5;
		case "end":
			return 1;
	}
}
