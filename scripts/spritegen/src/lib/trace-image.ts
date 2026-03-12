import { Image } from "@napi-rs/canvas";

export interface TracedImage {
	img: Image;
	src?: string;
}
