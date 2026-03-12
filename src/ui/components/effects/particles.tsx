import { useEventListener, useInterval, useLifetime, useMotion } from "@rbxts/pretty-vide-utils";
import { RunService } from "@rbxts/services";
import Vide, { Derivable, effect, For, read, source } from "@rbxts/vide";
import { LayoutProps } from "ui/types";

interface Particle {
	startX: number;
	startY: number;
	startRotation: number;
	speed: UDim2;
	rotationSpeed: number;
	lifetime: number;
	createdAt: number;
}

export interface ParticlesProps extends LayoutProps {
	name?: Derivable<string>;

	particleSpeed?: Derivable<UDim2>;
	particleMinSpeed?: Derivable<UDim2>;
	particleMaxSpeed?: Derivable<UDim2>;

	particleRotationSpeed?: Derivable<number>;
	particleMinRotationSpeed?: Derivable<number>;
	particleMaxRotationSpeed?: Derivable<number>;

	particleRotation?: Derivable<number>;
	particleMinRotation?: Derivable<number>;
	particleMaxRotation?: Derivable<number>;

	particleLifetimeSeconds?: Derivable<number>;
	particleMinLifetimeSeconds?: Derivable<number>;
	particleMaxLifetimeSeconds?: Derivable<number>;

	particleAcceleration?: Derivable<UDim2>;
	particleDirectionDegrees?: Derivable<number>;
	particleSpread?: Derivable<UDim2>;

	particleColor?: Derivable<ColorSequence | Color3>;
	particleRatePerSecond?: Derivable<number>;
	// TODO: Sequence<UDim2> type
	particleSize?: Derivable<UDim2>;
	particleSquash?: Derivable<NumberSequence | number>;
	particleTransparency?: Derivable<NumberSequence | number>;
	particleImage?: Derivable<string>;

	particleEnabled?: Derivable<boolean>;

	particleSeed?: number;
}

const DEFAULT_SIZE = UDim2.fromScale(1, 1);
const DEFAULT_PARTICLE_COLOR = new Color3(1, 1, 1);
const ZERO_UDIM2 = new UDim2();
const BLACK = new Color3();

function keypointFromSequence<T extends NumberSequence | ColorSequence>(
	sequence: T,
	value: number,
): (T extends NumberSequence ? number : Color3) | undefined {
	if (value === 0) return sequence.Keypoints[0].Value as never;
	if (value === 1) return sequence.Keypoints[sequence.Keypoints.size()].Value as never;

	// <3 roblox-ts emits
	for (let i = 1; i <= sequence.Keypoints.size() - 1; i++) {
		const currentKeypoint = sequence.Keypoints[i - 1];
		const nextKeypoint = sequence.Keypoints[i];

		assert(currentKeypoint, `currentKeypoint not found ${i}`);
		assert(nextKeypoint, `nextKeypoint not found ${i}`);
		if (value >= currentKeypoint.Time && value < nextKeypoint.Time) {
			const alpha = (value - currentKeypoint.Time) / (nextKeypoint.Time - currentKeypoint.Time);

			// HACK (jesus christ)
			return ((currentKeypoint.Value as never)
				+ ((nextKeypoint.Value as never) - (currentKeypoint as { Value: number }).Value) * alpha) as never;
		}
	}
}

// TODO: use matter here??
export function Particles({
	name = "Particles",

	particleSpeed = ZERO_UDIM2,
	particleMinSpeed,
	particleMaxSpeed,

	particleRotationSpeed = 0,
	particleMinRotationSpeed,
	particleMaxRotationSpeed,

	particleRotation = 0,
	particleMinRotation,
	particleMaxRotation,

	particleLifetimeSeconds = 5,
	particleMinLifetimeSeconds = 5,
	particleMaxLifetimeSeconds = 10,

	particleAcceleration = ZERO_UDIM2,
	particleDirectionDegrees = 0,
	particleSpread = ZERO_UDIM2,

	particleColor = DEFAULT_PARTICLE_COLOR,
	particleRatePerSecond = 20,
	particleSize,
	particleImage,
	particleSquash = 0,
	particleTransparency = 0,

	particleEnabled = true,
	particleSeed,

	position,
	anchorPoint,
	size = DEFAULT_SIZE,
	automaticSize,
	layoutOrder,
	zIndex,
	visible = true,
	hideOverflow,
}: ParticlesProps) {
	const minSpeed = () => read(particleMinSpeed) ?? read(particleSpeed) ?? ZERO_UDIM2;
	const maxSpeed = () => read(particleMaxSpeed) ?? read(particleSpeed) ?? ZERO_UDIM2;
	const minRotSpeed = () => read(particleMinRotationSpeed) ?? read(particleRotationSpeed) ?? 0;
	const maxRotSpeed = () => read(particleMaxRotationSpeed) ?? read(particleRotationSpeed) ?? 0;
	const minRotation = () => read(particleMinRotation) ?? read(particleRotation) ?? 0;
	const maxRotation = () => read(particleMaxRotation) ?? read(particleRotation) ?? 0;
	const minLifetime = () => read(particleMinLifetimeSeconds) ?? read(particleLifetimeSeconds) ?? 5;
	const maxLiftetime = () => read(particleMaxLifetimeSeconds) ?? read(particleLifetimeSeconds) ?? 10;

	const emit = source<Particle[]>([]);
	const lifetime = useLifetime();
	const random = new Random(particleSeed ?? os.clock());

	function Particle(): Particle {
		const createdAt = lifetime();
		return {
			startX: random.NextNumber(),
			startY: random.NextNumber(),
			startRotation: random.NextNumber(minRotation(), maxRotation()),
			speed: new UDim2(
				random.NextNumber(minSpeed().X.Scale, maxSpeed().X.Scale),
				random.NextNumber(minSpeed().X.Offset, maxSpeed().X.Offset),
				random.NextNumber(minSpeed().Y.Scale, maxSpeed().Y.Scale),
				random.NextNumber(minSpeed().Y.Offset, maxSpeed().Y.Offset),
			),
			rotationSpeed: random.NextNumber(minRotSpeed(), maxRotSpeed()),
			lifetime: random.NextNumber(minLifetime(), maxLiftetime()),
			createdAt: createdAt,
		};
	}

	useInterval(
		() => {
			if (!particleEnabled) return;
			emit().push(Particle());
			emit(emit());
		},
		1 / read(particleRatePerSecond),
	);

	useEventListener(RunService.PreRender, () => {
		const aliveParticles: Particle[] = [];

		for (const p of emit()) {
			const isAlive = p.createdAt + p.lifetime > lifetime();
			if (isAlive) aliveParticles.push(p);
		}

		emit(aliveParticles);
	});

	return (
		<frame
			BackgroundTransparency={1}
			Name={name}
			Position={position}
			AnchorPoint={anchorPoint}
			Size={size}
			AutomaticSize={automaticSize}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			Visible={visible}
			ClipsDescendants={hideOverflow}
		>
			<For
				each={emit}
				children={(p, i) => {
					const progress = () => (lifetime() - p.createdAt) / p.lifetime;

					const [position, positionMotion] = useMotion(UDim2.fromScale(p.startX, p.startY));
					effect(() =>
						positionMotion.spring(
							UDim2.fromScale(p.startX, p.startY).add(
								new UDim2(
									p.speed.X.Scale * progress(),
									p.speed.X.Offset * progress(),
									p.speed.Y.Scale * progress(),
									p.speed.Y.Offset * progress(),
								),
							),
						)
					);

					const rotation = p.startRotation;

					return (
						<imagelabel
							Name={`Emit_${i()}`}
							Size={particleSize}
							Rotation={rotation}
							Position={position}
							BackgroundTransparency={1}
							Image={particleImage}
							ImageColor3={(): Color3 =>
								typeIs(read(particleColor), "ColorSequence")
									? (keypointFromSequence(read(particleColor as ColorSequence), progress()) ?? BLACK)
									: (read(particleColor) as Color3)}
							ImageTransparency={(): number =>
								typeIs(read(particleTransparency), "NumberSequence")
									? (keypointFromSequence(read(particleTransparency as NumberSequence), progress())
										?? 0)
									: (read(particleTransparency) as number)}
						/>
					);
				}}
			/>
		</frame>
	);
}
