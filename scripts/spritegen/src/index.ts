import { loadImage } from "@napi-rs/canvas";
import { Resvg } from "@resvg/resvg-js";
import { parse } from "@std/toml";
import { exists, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path/posix";
import { drawSpritesheets, saveSpritesheets, type SpriteDescription, type SpritesheetRegistry } from "./canvas";
import { writeCode } from "./codegen";
import { createLogger } from "./lib/logger";
import type { TracedImage } from "./lib/trace-image";
import { type IconStyle, type IconVariant, listSymbols, loadSymbol, traceImage } from "./symbols";

interface MiconsFormat {
	normal: Record<string, IconVariant>;
	big: Record<string, IconVariant>;
}

const SOURCE_DIR = "./assets/";
const ASSETS_DIR = "./assets/game/spritesheets";
const OUTPUT_DIR = "./src/shared/generated";
const ICON_STYLE: IconStyle = "rounded";

const logger = createLogger("main");

// clean the directory
logger.info("Cleaning directory");
if (await exists(ASSETS_DIR)) await rm(ASSETS_DIR, { recursive: true, force: true });
await mkdir(ASSETS_DIR, { recursive: true });

// get symbols
logger.info("Getting list of icons");

const symbols = await listSymbols();
const micons = parse(await Bun.file("micons.toml").text()) as any as MiconsFormat;

// do normal icons first
const spritesheetRegistry: SpritesheetRegistry = {};

async function loadIcons<T extends string>(
	descriptions: SpriteDescription[],
	toLoad: string[],
	variants: Record<string, T> | T,
	load: (label: string, variant: T) => Promise<TracedImage> | TracedImage,
) {
	const simpleVariant = typeof variants === "string";
	for (let i = 0; i < toLoad.length; i++) {
		const label = toLoad[i]!;
		const variant = simpleVariant ? variants : variants[label]!;
		logger.info(`Loading **${label}** (${i + 1}/${toLoad.length})`);

		descriptions.push({
			image: await load(label, variant),
			label,
			variant,
		});
	}
}

async function doNormalIcons() {
	const fileformat = "icons[]";

	const customIconsDir = join(SOURCE_DIR, "icons");
	const toLoadRemote = Object.keys(micons.normal).filter(x => symbols.includes(x));
	const toLoadCustom = (await readdir(customIconsDir)).filter(x => x.endsWith(".png")).map(x =>
		x.split(".").slice(0, -1).join(".")
	);

	const normalIcons: SpriteDescription[] = [];
	logger.info("Going through **normal** icons");
	await loadIcons(normalIcons, toLoadRemote, micons.normal, (label, variant) => loadSymbol(label, ICON_STYLE, variant));

	logger.info("Going through **normal custom** icons");
	await loadIcons(normalIcons, toLoadCustom, "custom", async (label) => {
		const file = `${label}.png`;
		return await traceImage(await loadImage(join(customIconsDir, file)));
	});

	logger.info("Drawing spritesheets for **normal** icons");
	const { results, registry } = await drawSpritesheets(normalIcons);

	logger.info("Saving spritesheets for **normal** icons");
	await saveSpritesheets(ASSETS_DIR, results, fileformat);

	spritesheetRegistry.icons = {
		registry,
		fileformat,
	};
}
async function doBigIcons() {
	const fileformat = "bigicons[]";

	const toLoadRemote = Object.keys(micons.big).filter(x => symbols.includes(x));

	const bigIcons: SpriteDescription[] = [];
	logger.info("Going through **big** icons");
	await loadIcons(bigIcons, toLoadRemote, micons.big, async (label, variant) => {
		const buffer = await loadSymbol(label, ICON_STYLE, variant, true);
		const resvg = new Resvg(buffer.toString(), { fitTo: { mode: "width", value: 240 } });

		return await traceImage(await loadImage(resvg.render().asPng()));
	});

	logger.info("Drawing spritesheets for **big** icons");
	const { results, registry } = await drawSpritesheets(bigIcons);

	logger.info("Saving spritesheets for **big** icons");
	await saveSpritesheets(ASSETS_DIR, results, fileformat);

	spritesheetRegistry.bigicons = {
		registry,
		fileformat,
	};
}

await doNormalIcons();
await doBigIcons();

// finalize
logger.info("Generating code");
const code = writeCode(spritesheetRegistry);

// write code
logger.debug("writing **spritesheets.luau**");
await Bun.write(join(OUTPUT_DIR, "spritesheets.luau"), code.lua);
logger.debug("writing **spritesheets.d.ts**");
await Bun.write(join(OUTPUT_DIR, "spritesheets.d.ts"), code.dts);

logger.info("Finished!");
