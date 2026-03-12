import { component } from "@rbxts/matter";
import Object from "@rbxts/object-utils";
import { BasePartProps as BasePartPropsType } from "shared/constants/obby";

import { partComponents } from "./parts";

export const Model = component<{ instance: Instance }>("Model");
export const Attributes = component<{ Angular: boolean }>("Attributes");

export const Part = component<{
	id: string;
	creator: number;
	editors: number[];
}>("Part");
// export const PartCreator = component<{ creator: number }>("PartCreator");
// export const PartEditors = component<{ editors: number[] }>("PartEditors");
export const PartModel = component<{ part: BasePart }>("PartModel");
export const BasePartProps = component<BasePartPropsType>("BasePartProps");

export const Shape = component<{ shape: Enum.PartType }>("Shape");
export const Water = component("Water");

export const PreviewDelete = component("PreviewDelete");
export const PreviewBasePartProps = component<BasePartPropsType>("PreviewBasePartProps");

export const LobbyConveyorSegment = component("LobbyConveyorSegment");

export const REPLICATED_COMPONENTS = Object.assign(
	{ Part, BasePartProps, Shape },
	partComponents,
);
