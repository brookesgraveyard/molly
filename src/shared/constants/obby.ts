import { t } from "@rbxts/t";
import { Obby } from "client/generated/blink";
import { IntoInterfaceDefinitions, strictPartialInterface } from "shared/utils/t";

/** Obby Creator's obby/global properties. */
// NOTE: we omit donations so we can add our own. Capitalism $$$
export interface ObbyProperties {
	// advanced properties
	gravity: number;
	musicId?: number;

	jumpLimit: number;

	timeEnabled: boolean;
	clockTime: number;

	fogDistance: number;
	fogColor: Color3;

	depthOfFieldEnabled: boolean;
	depthOfFieldDistance: number;

	colorCorrectionBrightness: number;
	colorCorrectionContrast: number;
	colorCorrectionSaturation: number;

	floorCanCollide: boolean;
	floorColor: Color3;
	floorMaterial: Enum.Material;
	floorReflectance: number;
	floorTransparency: number;

	// skybox: ????
	celestialBodiesEnabled: boolean;

	cloudsEnabled: boolean;
	cloudsColor: Color3;
	cloudsCover: number;
	cloudsDensity: number;

	// avatar
	walkspeed: number;
	jumpPower: number;
	healingEnabled: boolean;
	maxHealth: number;

	// camera
	maxZoom: number;
	minZoom: number;

	// lighting
	ambient: Color3;
	brightness: number;
	shadowSoftness: number;
	globalShadows: boolean;
	colorShiftTop: Color3;
	colorShiftBottom: Color3;
	outdoorAmbient: Color3;
}

export const ObbyPropertiesDef: IntoInterfaceDefinitions<ObbyProperties> = {
	gravity: t.numberConstrained(5, 200),
	musicId: (t.number),

	jumpLimit: t.numberConstrained(1, 10),

	timeEnabled: t.boolean,
	clockTime: t.numberConstrained(0, 24),

	fogDistance: t.numberConstrained(5, 50000),
	fogColor: t.Color3,

	depthOfFieldEnabled: t.boolean,
	depthOfFieldDistance: t.numberConstrained(10, 500),

	colorCorrectionBrightness: t.numberConstrained(-0.5, 0.5),
	colorCorrectionContrast: t.numberConstrained(-0.5, 1),
	colorCorrectionSaturation: t.numberConstrained(-1, 1),

	floorCanCollide: t.boolean,
	floorColor: t.Color3,
	floorMaterial: t.enum(Enum.Material),
	floorReflectance: t.numberConstrained(0, 1),
	floorTransparency: t.numberConstrained(0, 1),

	celestialBodiesEnabled: t.boolean,

	cloudsEnabled: t.boolean,
	cloudsColor: t.Color3,
	cloudsCover: t.numberConstrained(0, 1),
	cloudsDensity: t.numberConstrained(0, 1),

	walkspeed: t.numberConstrained(8, 64),
	jumpPower: t.numberConstrained(0, 200),
	healingEnabled: t.boolean,
	maxHealth: t.numberConstrained(1, 1000),

	maxZoom: t.numberConstrained(20, 300),
	minZoom: t.numberConstrained(0.5, 30),

	ambient: t.Color3,
	brightness: t.numberConstrained(0, 1),
	shadowSoftness: t.numberConstrained(0, 1),
	globalShadows: t.boolean,
	colorShiftTop: t.Color3,
	colorShiftBottom: t.Color3,
	outdoorAmbient: t.Color3,
};
export const ObbyProperties = strictPartialInterface(ObbyPropertiesDef);

export const DEFAULT_OBBY_PROPERTIES: ObbyProperties = {
	gravity: 100,
	musicId: undefined,

	jumpLimit: 1,

	timeEnabled: false,
	clockTime: 10,

	fogDistance: 5000,
	fogColor: new Color3(1, 1, 1),

	depthOfFieldEnabled: false,
	depthOfFieldDistance: 500,

	colorCorrectionBrightness: 0,
	colorCorrectionContrast: 0,
	colorCorrectionSaturation: 0,

	floorCanCollide: false,
	floorColor: new Color3(1, 1, 1),
	floorMaterial: Enum.Material.Plastic,
	floorReflectance: 0,
	floorTransparency: 1,

	celestialBodiesEnabled: true,

	cloudsEnabled: false,
	cloudsColor: new Color3(1, 1, 1),
	cloudsCover: 0.5,
	cloudsDensity: 0.7,

	walkspeed: 16,
	jumpPower: 100,
	healingEnabled: false,
	maxHealth: 100,

	maxZoom: 300,
	minZoom: 0.5,

	ambient: Color3.fromRGB(50, 50, 50),
	brightness: 1.75,
	shadowSoftness: 0.2,
	globalShadows: true,
	colorShiftTop: new Color3(1, 1, 1),
	colorShiftBottom: new Color3(),
	outdoorAmbient: Color3.fromRGB(168, 181, 200),
};

/**
 * Shared properties for all Obby Creator parts. Note that Shape is to be
 * implemented on a case-by-case basis.
 */
export interface BasePartProps {
	canCollide: boolean;
	castShadow: boolean;
	color: Color3;
	material: Enum.Material;
	reflectance: number;
	surface: Obby.PartSurface;
	transparency: number;
	shape: Enum.PartType;

	transform: CFrame;
	size: Vector3;
	slipperiness: number;
	water: boolean;
}

export const BasePartPropsDef: IntoInterfaceDefinitions<BasePartProps> = {
	canCollide: t.boolean,
	castShadow: t.boolean,
	color: t.Color3,
	material: t.enum(Enum.Material),
	reflectance: t.numberConstrained(0, 1),
	surface: t.literal("Glue", "Inlet", "Smooth", "Studs", "Universal"),
	transparency: t.numberConstrained(0, 1),
	shape: t.enum(Enum.PartType),

	transform: t.CFrame,
	size: t.Vector3,
	slipperiness: t.numberConstrained(0, 200),
	water: t.boolean,
};
export const BasePartProps = strictPartialInterface(BasePartPropsDef);

export const DEFAULT_BASE_PART_PROPS: Required<BasePartProps> = {
	canCollide: true,
	castShadow: true,
	color: new BrickColor("Light grey metallic").Color,
	material: Enum.Material.Plastic,
	reflectance: 0,
	surface: "Smooth",
	transparency: 0,
	shape: Enum.PartType.Block,

	transform: CFrame.identity,
	size: new Vector3(4, 1, 2),
	slipperiness: 0,
	water: false,
};

export const PART_TAG = "OCPlacePart";
