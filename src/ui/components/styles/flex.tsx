import Vide, { Derivable } from "@rbxts/vide";

export interface PresetFlexProps {
	name?: Derivable<string>;
}

export interface FlexProps extends PresetFlexProps {
	mode?: Derivable<Enum.UIFlexMode>;
}

export function Flex({ name = "Flex", mode }: FlexProps) {
	return <uiflexitem Name={name} FlexMode={mode} />;
}

export function FlexFill(props: PresetFlexProps) {
	return <Flex name="FlexFill" mode={Enum.UIFlexMode.Fill} {...props} />;
}

export function FlexGrow(props: PresetFlexProps) {
	return <Flex name="FlexGrow" mode={Enum.UIFlexMode.Grow} {...props} />;
}

export function FlexShrink(props: PresetFlexProps) {
	return <Flex name="FlexShrink" mode={Enum.UIFlexMode.Shrink} {...props} />;
}
