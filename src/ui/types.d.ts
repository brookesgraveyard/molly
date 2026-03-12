import { Derivable } from "@rbxts/vide";

// If Celina didn't make me insane, this will -Fire
export type PrefixProps<K extends string, Props> = {
	[K0 in `${K}${Capitalize<Extract<keyof Props, string>>}`]?: K0 extends `${K}${infer K1}`
		? Uncapitalize<K1> extends `${infer K2}` ? K2 extends keyof Props ? Props[K2]
			: never
		: never
		: never;
};

export type IconType = string | Sprite;

export type Align1d = "start" | "mid" | "end";

export interface LayoutProps {
	position?: Derivable<UDim2>;
	anchorPoint?: Derivable<Vector2>;
	automaticSize?: Derivable<Enum.AutomaticSize>;
	size?: Derivable<UDim2>;
	layoutOrder?: Derivable<number>;
	zIndex?: Derivable<number>;
	visible?: Derivable<boolean>;
	hideOverflow?: Derivable<boolean>;
}
