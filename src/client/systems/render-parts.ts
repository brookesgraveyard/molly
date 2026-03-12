import Make from "@rbxts/make";
import { Component, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { translateToObby } from "shared/constants/bounds";
import type { BasePartProps as BasePartPropsType } from "shared/constants/obby";
import { PART_TAG } from "shared/constants/obby";
import { BasePartProps, PartModel, PreviewDelete } from "shared/ecs/components";
import { System } from "shared/ecs/types";

const Obby = Workspace.WaitForChild("Obby");

function apply<T extends Instance, P extends { [K in keyof T]?: T[K] }>(instance: T, props: P) {
	for (const [property, value] of pairs(props)) {
		instance[property as keyof T] = value as T[keyof T];
	}
}

interface ApplyState {
	deleting: boolean;
}

function applyProps(instance: BasePart, props: Component<BasePartPropsType>, state: ApplyState) {
	// TODO: water, slipperiness
	const surface = Enum.SurfaceType.FromName(props.surface);
	apply(instance, {
		CanCollide: props.canCollide,
		CastShadow: props.castShadow,
		Color: props.color,
		Material: props.material,
		Reflectance: props.reflectance,
		Transparency: props.transparency,
		Shape: props.shape,

		CFrame: translateToObby(props.transform),
		Size: props.size,

		LeftSurface: surface,
		RightSurface: surface,
		FrontSurface: surface,
		BackSurface: surface,
		TopSurface: surface,
		BottomSurface: surface,
	});

	// TODO add a special effect when part is deleting
	if (state.deleting) {
		apply(instance, {
			Transparency: 0.5,
		});
	}
}

function renderParts(world: World) {
	for (const [id, props] of world.query(BasePartProps).without(PartModel)) {
		const part = Make("Part", {
			Anchored: true,
			Parent: Obby,
		});

		const previewDelete = world.get(id, PreviewDelete);
		applyProps(part, props, {
			deleting: !!previewDelete,
		});

		part.AddTag(PART_TAG);
		part.SetAttribute("clientEntityId", id);

		world.insert(id, PartModel({ part }));
	}

	for (const [id, partProps] of world.queryChanged(BasePartProps)) {
		const props = partProps.new;
		if (props) {
			const [partModel, previewDelete] = world.get(id, PartModel, PreviewDelete);
			if (partModel?.part) {
				applyProps(partModel.part, props, {
					deleting: !!previewDelete,
				});
			}
		}
	}
}

export = renderParts satisfies System;
