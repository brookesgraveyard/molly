import { useMotion } from "@rbxts/pretty-vide-utils";
import Vide, { Derivable, derive, effect, read, source, spring } from "@rbxts/vide";
import { Icon } from "ui/components/icon";
import { Panel } from "ui/components/panel";
import { Padding } from "ui/components/styles/padding";
import { Round } from "ui/components/styles/round";
import { Text } from "ui/components/text";
import { rem, wrapRem, wrapRemUDim, wrapRemUdim2 } from "ui/rem";
import { Typography } from "ui/theme";
import { IconType } from "ui/types";

interface SegmentCardProps {
	i: number;

	title: Derivable<string>;
	color: Derivable<Color3>;
	transparency: Derivable<number>;
	icon?: Derivable<IconType>;

	onActivated?: () => void;
}

const APPEAR_DELAY = 0.08;

export function SegmentCard({ i, title, color, transparency, icon, onActivated }: SegmentCardProps) {
	const hover = source(false);
	const iconPos = spring(() => hover() ? -2 : 0, 0.2);

	const [appear, appearMotion] = useMotion(1);
	const [scale, scaleMotion] = useMotion(0.9);
	const [slider, sliderMotion] = useMotion(
		new Vector2((i - 1.5) * 4, new Random().NextNumber(4, 8)),
	);

	effect(() => {
		const thread = task.delay(i * APPEAR_DELAY, () => {
			appearMotion.tween(0, { time: APPEAR_DELAY });
			scaleMotion.spring(1);
			sliderMotion.spring(new Vector2(0, 0), {
				mass: 1,
				tension: 500,
				friction: 25,
				velocity: 0.3,
			});
		});
		return () => pcall(task.cancel, thread);
	});

	const cardTransparency = derive(() => appear() + (read(transparency) * (1 - appear())));
	const iconTransparency = derive(() => 0.8 + (cardTransparency() * 0.2));

	return (
		<frame
			Size={wrapRemUdim2(21, 40)}
			Name={title}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
		>
			<Round round={wrapRemUDim(1.1)} />
			<Panel
				size={UDim2.fromScale(1, 1)}
				color={color}
				transparency={cardTransparency}
				hideOverflow
				anchorPoint={new Vector2(0.5, 0.5)}
				position={() => new UDim2(0.5, rem(slider().X), 0.5, rem(slider().Y))}
				onActivated={onActivated}
				scale={scale}
				visible={() => appear() < 1}
			>
				<Round round={wrapRemUDim(1.1)} />
				<Text
					wrap
					text={title}
					font={Typography.header.font}
					textSize={wrapRem(Typography.header.remSize)}
					position={UDim2.fromScale(0, 0.15)}
					size={UDim2.fromScale(1, 0.85)}
					color={color}
					align="tm"
					automaticSize={Enum.AutomaticSize.None}
					transparency={cardTransparency}
				>
					<Padding padding={wrapRemUDim(2)} />
				</Text>
				{icon
					? (
						<Icon
							src={icon}
							transparency={iconTransparency}
							color={color}
							position={() => new UDim2(0.5, 0, 1, rem(iconPos()))}
							anchorPoint={new Vector2(0.5, 0.8)}
							size={UDim2.fromScale(1.35, 1.35)}
						/>
					)
					: undefined}
			</Panel>
		</frame>
	);
}
