// Google™ Icons™ Symbols™ API™
import { type CanvasRenderingContext2D, createCanvas, Image, loadImage } from "@napi-rs/canvas";
import sharp from "sharp";
import { createLogger } from "./lib/logger";
import { type TracedImage } from "./lib/trace-image";

const REMOTE_LOAD_PATH = "https://fonts.google.com/metadata/icons?incomplete=1&key=material_symbols";
const REMOTE_ICON_LOCATION_BASE =
	"https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web";
const ICON_PIXEL_SIZE = 48;

export type IconStyle = "outlined" | "rounded" | "sharp";
export type IconVariant = "filled" | "outlined";

interface GoogleResponse {
	icons: {
		name: string;
		unsupported_families: string[];
		sizes_px: number[];
	}[];
}

const logger = createLogger("symbols");

export async function listSymbols(): Promise<string[]> {
	logger.debug("fetching icons from **fonts.google.com**");
	const raw = await fetch(REMOTE_LOAD_PATH).then(x => x.text());
	const data = JSON.parse(raw.slice(5)) as GoogleResponse;

	const icons = data.icons.filter(x =>
		x.sizes_px.includes(ICON_PIXEL_SIZE) && !x.unsupported_families.some(y => y.toLowerCase().includes("symbols"))
	);
	logger.debug(`fetched **${icons.length}** icon(s)`);
	return icons.map(x => x.name);
}

export async function traceImage(image: Image): Promise<TracedImage> {
	return {
		img: image,
		src: `data:image/png;base64,${
			(await sharp(image.src).resize({ width: 24, height: 24 }).png().toBuffer()).toBase64()
		}`,
	};
}

export async function loadSymbol(
	icon: string,
	style: IconStyle,
	variant: IconVariant,
	raw: true,
): Promise<Buffer<ArrayBuffer>>;
// @ts-expect-error Quiet
export async function loadSymbol(
	icon: string,
	style: IconStyle,
	variant: IconVariant,
	raw?: false,
): Promise<TracedImage>;
export async function loadSymbol(
	icon: string,
	style: IconStyle,
	variant: IconVariant,
	raw: boolean,
) {
	const v = {
		filled: "_fill1",
		outlined: "",
	}[variant];

	const chunks = [
		REMOTE_ICON_LOCATION_BASE,
		icon,
		`materialsymbols${style}`,
		`${icon}${v}_${ICON_PIXEL_SIZE}px.svg`,
	];

	const sourcedtxt = await fetch(chunks.join("/"), {
		cache: "force-cache",
		headers: {
			"cache-control": "public, max-age=3600",
		},
	}).then(x => x.text());

	const buffer = Buffer.from(sourcedtxt.replace(/(<path )/g, "$1fill=\"#fff\" "));

	if (raw) return buffer;
	return await traceImage(await loadImage(buffer));
}
