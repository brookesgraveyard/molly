import { t } from "@rbxts/t";

export type IntoInterfaceDefinitions<T> = { [K in keyof T]: t.check<T[K]> };
export type InterfaceDefinitions = Record<string, t.check<unknown>>;
export type DissolveInterfaceDefinitions<T extends InterfaceDefinitions> = { [K in keyof T]: t.static<T[K]> };

export function partialInterface<T extends InterfaceDefinitions>(
	definitions: T,
): t.check<Partial<DissolveInterfaceDefinitions<T>>> {
	definitions = table.clone(definitions);
	for (const [key, guard] of pairs(definitions)) {
		definitions[key as keyof T] = t.optional(guard as t.check<unknown>) as never;
	}
	return t.interface(definitions);
}

export function strictPartialInterface<T extends InterfaceDefinitions>(
	definitions: T,
): t.check<Partial<DissolveInterfaceDefinitions<T>>> {
	definitions = table.clone(definitions);
	for (const [key, guard] of pairs(definitions)) {
		definitions[key as keyof T] = t.optional(guard as t.check<unknown>) as never;
	}
	return t.strictInterface(definitions);
}
