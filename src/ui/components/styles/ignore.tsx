import Vide, { Derivable, PropsWithChildren } from "@rbxts/vide";

export interface IgnoreProps extends PropsWithChildren {
	name?: Derivable<string>;
}

/** Wraps children in a Folder to ignore UI layouts. */
export function Ignore({ name = "Ignore", children }: IgnoreProps) {
	return <folder Name={name}>{children}</folder>;
}
