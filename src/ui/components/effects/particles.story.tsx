import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

import { Particles } from "./particles";

export = CreateVideStory(
	{
		vide: Vide,
		controls: {
			// particleSpeed = ZERO_UDIM2,
			// particleMinSpeed,
			// particleMaxSpeed,
			// particleRotationSpeed = 0,
			// particleMinRotationSpeed,
			// particleMaxRotationSpeed,
			// particleRotation = 0,
			// particleMinRotation,
			// particleMaxRotation,
			// particleLifetimeSeconds = 5,
			// particleMinLifetimeSeconds = 5,
			// particleMaxLifetimeSeconds = 10,
			// particleAcceleration = ZERO_UDIM2,
			// particleDirectionDegrees = 0,
			// particleSpread = ZERO_UDIM2,
			// particleColor = DEFAULT_PARTICLE_COLOR,
			// particleRatePerSecond = 20,
			// particleSize,
			// particleImage,
			// particleSquash = 0,
			// particleTransparency = 0,
			// particleEnabled = true,
			// particleSeed,
		},
	},
	({ controls }) => {
		return <Particles />;
	},
);
