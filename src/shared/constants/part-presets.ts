import * as parts from "shared/ecs/components/parts";

import { BasePartProps } from "./obby";

type PartName = Exclude<keyof typeof parts, `part${string}`>;

export const PART_PRESETS = {
	Lava: {
		color: new Color3(1, 0, 0),
	},
} satisfies Partial<Record<PartName, Partial<BasePartProps>>>;
