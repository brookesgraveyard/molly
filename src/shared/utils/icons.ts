import Object from "@rbxts/object-utils";
import { icons } from "shared/generated/spritesheets";

type Icons = typeof icons;
type Icon = {
	[K in keyof Icons]: keyof Icons[K] extends string ? `${keyof Icons[K]} ${K}` : never;
}[keyof Icons];

export function listIcons(): Icon[] {
	const flat = [];

	for (const style of Object.keys(icons)) {
		for (const icon of Object.keys(icons[style])) {
			flat.push(`${icon} ${style}`);
		}
	}

	return flat.sort() as Icon[];
}
export function getIcon(icon: Icon) {
	const [name, style] = icon.split(" ");
	return icons[style as keyof Icons][name as keyof Icons[keyof Icons]];
}
