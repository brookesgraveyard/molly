import Vide, { Derivable, PropsWithChildren } from "@rbxts/vide";
import { remUdim } from "ui/rem";

import { ListY } from "../styles/list";
import { Padding } from "../styles/padding";

interface PageProps extends PropsWithChildren {
	padding?: Derivable<UDim>;
}

export function Page({ padding, children }: PageProps) {
	return (
		<>
			<ListY align="tl" padding={remUdim(3 / 4)} />
			<Padding paddingX={padding} />
			{children}
		</>
	);
}
