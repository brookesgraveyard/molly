import { atom } from "@rbxts/charm";

// affects the camera's FieldOfView
export const FOV_MODIFIERS = atom(new Set<NumberValue>());

// uses weird camera skewing magic
export const ZOOM_MODIFIERS = atom(new Set<NumberValue>());
