import { Controller, OnStart } from "@flamework/core";
import { computed, effect } from "@rbxts/charm";
import { obbyProperties } from "shared/atoms";
import { DEFAULT_OBBY_PROPERTIES } from "shared/constants/obby";

import { BoundsController } from "./bounds";

@Controller()
export class ObbyPropertiesController implements OnStart {
	boundedProperties = computed(() => this.boundsController.isInBounds() ? obbyProperties() : DEFAULT_OBBY_PROPERTIES);

	constructor(private boundsController: BoundsController) {}

	onStart(): void {
		effect(() => {
			const boundedProperties = this.boundedProperties();
			// Lighting.Ambient = boundedProperties.ambient
			// Lighting.Brightness = boundedProperties.brightness
			// Lighting.ColorShift_Top = boundedProperties.colorShiftTop
			// Lighting.ColorShift_Bottom = boundedProperties.colorShiftBottom
			// Lighting.Ambient = boundedProperties.ambient
			// Lighting.Ambient = boundedProperties.ambient
			// Lighting.Ambient = boundedProperties.ambient
			// Lighting.Ambient = boundedProperties.ambient
		});
	}
}
