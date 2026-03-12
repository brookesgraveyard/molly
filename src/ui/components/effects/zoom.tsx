import { Set } from "@rbxts/sift";
import Vide from "@rbxts/vide";
import { action, cleanup, Derivable } from "@rbxts/vide";
import { ZOOM_MODIFIERS } from "client/controllers/camera/exports";

interface ZoomModProps {
	name?: Derivable<string>;
	scale?: Derivable<number>;
}

const zoom = () => ({
	[1]: action((v: NumberValue) => {
		ZOOM_MODIFIERS((x) => Set.add(x, v));
		cleanup(() => ZOOM_MODIFIERS((x) => Set.delete(x, v)));
	}),
});

export function ZoomMod({
	name = "ZoomMod",
	scale = 1,
}: ZoomModProps) {
	return <numbervalue Name={name} Value={scale} {...zoom()} />;
}
