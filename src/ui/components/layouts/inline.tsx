import Vide, { Derivable, PropsWithChildren } from "@rbxts/vide";

import { ListX } from "../styles/list";

interface InlineProps extends PropsWithChildren {
	flex?: Derivable<Enum.UIFlexAlignment>;
	padding?: Derivable<UDim>;
}

export function Inline({ flex, padding, children }: InlineProps) {
	return (
		<frame Size={UDim2.fromScale(1)} AutomaticSize={Enum.AutomaticSize.Y} BackgroundTransparency={1}>
			<ListX align="ml" flexX={flex} padding={padding} />
			{children}
		</frame>
	);
}
