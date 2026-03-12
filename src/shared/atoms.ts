import { atom } from "@rbxts/charm";

import { DEFAULT_OBBY_PROPERTIES } from "./constants/obby";
import { PlaceStatus } from "./constants/place";

export const placeStatus = atom(PlaceStatus.Pending);
export const obbyProperties = atom(DEFAULT_OBBY_PROPERTIES);
export const partCount = atom(0);
