import { type Canvas, type CanvasRenderingContext2D, createCanvas, type Image } from "@napi-rs/canvas";
import { join } from "node:path";
import sharp from "sharp";
import { createLogger } from "./lib/logger";
import type { TracedImage } from "./lib/trace-image";

const MAX_CANVAS_SIZE = 1024;

type FileFormat = `${string}[]` | `[]${string}` | `${string}[]${string}`;

export interface SpriteDescription {
	image: TracedImage;
	label: string;
	variant: string;
}

export interface SpriteInformation {
	label: string;
	image: TracedImage;
	x: number;
	y: number;
	w: number;
	h: number;
	sheet: number;
}

export type SpriteRegistry = Record<string, SpriteInformation[]>;
export type SpritesheetRegistry = Record<string, {
	fileformat: FileFormat;
	registry: SpriteRegistry;
}>;

const logger = createLogger("canvas");

export function doFileFormat(fileformat: FileFormat, i: number) {
	return fileformat.replaceAll("[]", i.toString());
}

export async function saveSpritesheets(path: string, spritesheets: Buffer[], fileformat: FileFormat) {
	for (let i = 0; i < spritesheets.length; i++) {
		const filename = doFileFormat(fileformat, i);

		logger.debug(`saved ${filename}.png`);
		await Bun.write(join(path, filename + ".png"), spritesheets[i]!);
	}
}

export async function drawSpritesheets(
	images: SpriteDescription[],
): Promise<{ results: Buffer[]; registry: SpriteRegistry }> {
	let x = 0, y = 0;
	let canvas = createCanvas(MAX_CANVAS_SIZE, MAX_CANVAS_SIZE);
	let ctx = canvas.getContext("2d");
	const results = [{
		canvas,
		w: 0,
		h: 0,
	}];

	const registry: SpriteRegistry = {};

	logger.debug("generating spritesheet **0**");

	const MAX_PER_ROW = Math.ceil(Math.sqrt(images.length));

	let i = -1;
	for (const sprite of images) {
		i++;
		let r = results.find(x => x.canvas === canvas)!;
		const w = sprite.image.img.width, h = sprite.image.img.height;

		if (w > MAX_CANVAS_SIZE) throw new Error(`cannot draw sprite of width ${w} (max is ${MAX_CANVAS_SIZE})`);
		if (h > MAX_CANVAS_SIZE) throw new Error(`cannot draw sprite of height ${h} (max is ${MAX_CANVAS_SIZE})`);

		if ((x + w) > MAX_CANVAS_SIZE || i >= MAX_PER_ROW) {
			y = r.h;
			x = 0, i = 0;
		}
		if ((x + h) > MAX_CANVAS_SIZE) {
			canvas = createCanvas(MAX_CANVAS_SIZE, MAX_CANVAS_SIZE);
			ctx = canvas.getContext("2d");
			r = { canvas, w: 0, h: 0 };
			results.push(r);

			logger.debug(`generating spritesheet **${results.length - 1}**`);

			x = 0, y = 0;
		}

		// drawing!!!
		logger.debug(`drew ${sprite.label} at x${x} y${y}`);
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(sprite.image.img, x, y, w, h);

		x += w;
		r.w = Math.max(r.w, x);
		r.h = Math.max(r.h, y + h);

		registry[sprite.variant] ??= [];
		registry[sprite.variant]!.push({
			label: sprite.label,
			image: sprite.image,
			x: x - w,
			y: y + 0,
			w: w,
			h: h,
			sheet: results.length - 1,
		});
	}

	return {
		results: await Promise.all(
			results.map(x =>
				sharp(x.canvas.toBuffer("image/png")).extract({ left: 0, top: 0, width: x.w, height: x.h }).png().toBuffer()
			),
		),
		registry,
	};
}
