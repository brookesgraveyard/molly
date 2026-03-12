import { read, source } from "@rbxts/vide";
import { expect, it } from "@rbxts/zest";

import { dissolve } from "./dissolve";

export = () => {
	it("dissolves no read dependencies", () => {
		const constant = {};
		const dissolved = dissolve(() => constant);
		expect(dissolved).toNeverBeA("function");
		expect(dissolved).toBeA("table");
		expect(dissolved).toBe(constant);
	});

	it("dissolves constants", () => {
		const constant = {};
		const dissolved = dissolve((read) => read(constant));
		expect(dissolved).toNeverBeA("function");
		expect(dissolved).toBeA("table");
		expect(dissolved).toBe(constant);
	});

	it("keeps read dependencies", () => {
		const constant = {};
		const derivable = source(constant);
		const dissolved = dissolve((read) => read(derivable));
		expect(dissolved).toNeverBeA("table");
		expect(dissolved).toBeA("function");
		expect(read(dissolved)).toBe(constant);
	});
};
