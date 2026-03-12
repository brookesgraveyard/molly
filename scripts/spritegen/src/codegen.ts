import type { SpritesheetRegistry } from "./canvas";
import { createLogger } from "./lib/logger";

const BASE_LUA = "--!nonstrict\nlocal assets = require(script.Parent.assets)";
const THE_VARIABLE = `spritesheets`;

const START_LUA = `local ${THE_VARIABLE} = {`;
const START_DTS = `declare const ${THE_VARIABLE}: {`;

const OBJ_LUA = " = {";
const OBJ_DTS = ": {";

const OBJ_END_LUA = "}";
const OBJ_END_DTS = "};";

const EXPORT_LUA = `return ${THE_VARIABLE}`;
const EXPORT_DTS = `export = ${THE_VARIABLE}`;

export function writeCode(registry: SpritesheetRegistry): { lua: string; dts: string } {
	const luaCode: string[] = [BASE_LUA];
	const dtsCode: string[] = [];

	const luaChunk = [START_LUA];
	const dtsChunk = [START_DTS];
	for (const sheet of Object.keys(registry)) {
		const variants = registry[sheet]!;

		luaChunk.push(`\t${sheet}${OBJ_LUA}`);
		dtsChunk.push(`\t${sheet}${OBJ_DTS}`);
		for (const variant of Object.keys(variants.registry)) {
			const icons = variants.registry[variant]!;

			luaChunk.push(`\t\t${variant}${OBJ_LUA}`);
			dtsChunk.push(`\t\t${variant}${OBJ_DTS}`);
			for (const icon of Object.values(icons)) {
				luaChunk.push(
					`\t\t\t${icon.label} = { img = assets.spritesheets.${
						variants.fileformat.replace("[]", icon.sheet.toString())
					}, x = ${icon.x}, y = ${icon.y}, w = ${icon.w}, h = ${icon.h} },`,
				);
				if (icon.image.src) dtsChunk.push(`\t\t\t/** ![${icon.label}](${icon.image.src}) */`);
				dtsChunk.push(`\t\t\t${icon.label}: Sprite;`);
			}
			luaChunk.push(`\t\t${OBJ_END_LUA},`);
			dtsChunk.push(`\t\t${OBJ_END_DTS}`);
		}
		luaChunk.push(`\t${OBJ_END_LUA},`);
		dtsChunk.push(`\t${OBJ_END_DTS}`);
	}
	luaChunk.push(OBJ_END_LUA);
	dtsChunk.push(OBJ_END_DTS);

	luaCode.push(luaChunk.join("\n"));
	dtsCode.push(dtsChunk.join("\n"));

	luaCode.push(EXPORT_LUA);
	dtsCode.push(EXPORT_DTS);

	return {
		lua: luaCode.join("\n\n") + "\n",
		dts: dtsCode.join("\n\n") + "\n",
	};
}
