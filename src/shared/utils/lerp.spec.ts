import { describe, expect, it } from "@rbxts/zest";

import { lerp, lerpVector, lerpVector2, lerpVector3 } from "./lerp";

function describeWithUnknownLerp<T>(
	describeLabel: string,
	lerpFn: (a: T, b: T, t: number) => T,
	lerpFnLabel: string,
	a: T,
	b: T,
	t: number,
	inner: (real: T) => void,
) {
	describe(describeLabel, () => {
		it(lerpFnLabel, () => {
			inner(lerpFn(a, b, t));
		});

		it("unknown lerp", () => {
			inner(lerp(a, b, t));
		});
	});
}

export = () => {
	it("number", () => {
		expect(lerp(0, 1, 0.5)).toBeNear(0.5, 5);
		expect(lerp(5, 10, 0.5)).toBeNear(7.5, 5);
	});

	describeWithUnknownLerp(
		"vector",
		lerpVector,
		"lerpVector",
		vector.create(1, 2, 3),
		vector.create(2, 4, 6),
		0.5,
		(real) => {
			// roblox typeof returns Vector3 for native vectors...
			// expect(real).toBeA("vector");
			expect(real).toBeA("Vector3");
			expect(real.x).toBeNear(1.5, 5);
			expect(real.y).toBeNear(3, 5);
			expect(real.z).toBeNear(4.5, 5);
		},
	);

	describeWithUnknownLerp("Vector2", lerpVector2, "lerpVector2", new Vector2(1, 2), new Vector2(2, 4), 0.5, (real) => {
		expect(real).toBeA("Vector2");
		expect(real.X).toBeNear(1.5, 5);
		expect(real.Y).toBeNear(3, 5);
	});

	describeWithUnknownLerp(
		"Vector3",
		lerpVector3,
		"lerpVector3",
		new Vector3(1, 2, 3),
		new Vector3(2, 4, 6),
		0.5,
		(real) => {
			expect(real).toBeA("Vector3");
			expect(real.X).toBeNear(1.5, 5);
			expect(real.Y).toBeNear(3, 5);
			expect(real.Z).toBeNear(4.5, 5);
		},
	);
};
