import { Derivable, read } from "@rbxts/vide";

/**
 * Dissolves a source into a constant value if it has no `read` dependencies.
 */
export function dissolve<T>(source: (read: <T>(value: Derivable<T>) => T) => T): Derivable<T> {
	let readsDependency = false;

	function mockRead(value: unknown) {
		if (typeIs(value, "function")) {
			readsDependency = true;
			throw "used dependency";
		}
		return value;
	}

	const [initialSuccess, dissolvedOrError] = pcall(source, mockRead as never);

	if (initialSuccess) return dissolvedOrError;

	if (readsDependency) {
		return () => {
			return source(read as never);
		};
	}

	throw `Dissolving source threw an error: ${dissolvedOrError}`;
}
