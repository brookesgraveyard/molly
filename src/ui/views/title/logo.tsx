import Vide from "@rbxts/vide";
import { wrapRemUdim2 } from "ui/rem";

export const PLACEHOLDER = "rbxassetid://121212267160037";

export function Logo() {
	return <imagelabel Name="Logo" Image={PLACEHOLDER} Size={wrapRemUdim2(21, 21)} />;
}
