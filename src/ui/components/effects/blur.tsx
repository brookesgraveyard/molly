import { Lighting } from "@rbxts/services";
import Vide, { action, cleanup } from "@rbxts/vide";
import { Derivable } from "@rbxts/vide";

interface BlurProps {
	name: string;
	size?: Derivable<number>;
}

function portal(name: string) {
	return {
		[1]: action((i: NumberValue) => {
			const cl = new Instance("BlurEffect");
			cl.Archivable = false;
			cl.Name = name;
			cl.Size = i.Value;
			cl.Parent = Lighting;

			i.GetPropertyChangedSignal("Value").Connect(() => cl.Size = i.Value);
			cleanup(() => cl.Destroy());
		}),
	};
}

export function Blur({
	name = "Blur",
	size = 0,
}: BlurProps) {
	return (
		<numbervalue
			Name={name + "_portal"}
			Value={size}
			{...portal(name)}
		/>
	);
}
