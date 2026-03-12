export interface AddTab {
	kind: "tab";
	title: string;
	items: AddTabItem[];
}

export interface AddDivider {
	kind: "divider";
	label: string;
}

export interface AddGroup {
	kind: "group";
	items: string[];
}

export interface AddText {
	kind: "text";
	text: string;
}

export type AddTabItem = AddDivider | AddGroup;

export type AddSection = AddTab | AddText;

function tab(title: string, items: AddTabItem[]): AddTab {
	return { kind: "tab", title, items };
}

function divider(label: string): AddDivider {
	return { kind: "divider", label };
}

function group(items: string[]): AddGroup {
	return { kind: "group", items };
}

function text(text: string): AddText {
	return { kind: "text", text };
}

export const ADD_MENU_SECTIONS = identity<AddSection[]>([
	tab("Basic Parts", [
		divider("Simple"),
		group([]),
		divider("Custom"),
		group([]),
		divider("Variants"),
		group([]),
		divider("Meshes"),
	]),
	tab("Advanced Parts", [
		group([]),
	]),
	tab("Moving Parts", [
		divider("Push Blocks"),
		group([]),
		divider("Moving Parts"),
		group([]),
		divider("Spinning Parts"),
		group([]),
	]),
	tab("Specials", [
		group([]),
	]),
	text(
		"Many part types, such as those that add more than one part, have been omitted to make OCPlace more interesting. See Menu → Info for more information.",
	),
]);
