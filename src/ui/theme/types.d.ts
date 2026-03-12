export interface ThemeDefinition {
	name: string;

	typography: {
		header: ThemeFontDefinition;
		subheader: ThemeFontDefinition;
		windowHeader: ThemeFontDefinition;
		body: ThemeFontDefinition;
		subtext: ThemeFontDefinition;
		button: ThemeFontDefinition;
		input: ThemeFontDefinition;
	};

	colors: {
		base: Color3;
		inverted: Color3;
		body: Color3;
		floating: Color3;

		red: Color3;
		yellow: Color3;
		green: Color3;
		blue: Color3;
		purple: Color3;
	};
}

export interface ThemeFontDefinition {
	font: Font;
	remSize: number;
}
