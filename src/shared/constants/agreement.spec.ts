import { expect, it } from "@rbxts/zest";

import { AGREEMENT } from "./agreement";

export = () => {
	it("gets the agreement", () => {
		expect(AGREEMENT).toInclude("OCPlace User Agreement and Terms of Service", true);
	});
};
