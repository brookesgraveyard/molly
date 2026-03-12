import { useMotion } from "@rbxts/pretty-vide-utils";
import Ripple from "@rbxts/ripple";
import { HttpService } from "@rbxts/services";
import Vide, { action, cleanup, derive, effect, Source, source } from "@rbxts/vide";
import { WindowIDProps } from "client/controllers/windows";
import { ADD_MENU_SECTIONS, AddTab } from "shared/constants/add-parts";
import { icons } from "shared/generated/spritesheets";
import { Inline } from "ui/components/layouts/inline";
import { Page } from "ui/components/layouts/page";
import { FlexShrink } from "ui/components/styles/flex";
import { ListY } from "ui/components/styles/list";
import { Padding } from "ui/components/styles/padding";
import { Text } from "ui/components/text";
import { Window } from "ui/components/window";
import { rem, wrapRem, wrapRemUDim } from "ui/rem";
import { Colors, Typography } from "ui/theme";

const firstTabSection = ADD_MENU_SECTIONS.findIndex((x) => x.kind === "tab");

const tabSpring: Ripple.SpringOptions = {
	tension: 350,
	friction: 25,
};

interface HighlightProps {
	position: Source<UDim2>;
	size: Source<UDim2>;
	scale: Source<number>;
	transparency: Source<number>;
}

function Highlight(
	{ position, size, scale, transparency }: HighlightProps,
) {
	return (
		<frame
			Name="Highlight"
			BackgroundColor3={Colors.body}
			BackgroundTransparency={transparency}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={() => {
				const pos = position(), siz = size();
				return new UDim2(
					new UDim(
						pos.X.Scale + siz.X.Scale / 2,
						pos.X.Offset + siz.X.Offset / 2,
					),
					pos.Y,
				);
			}}
			Size={size}
		>
			<uiscale Scale={scale} />
			<uicorner CornerRadius={wrapRemUDim(1)} />
		</frame>
	);
}

interface TabsProps {
	motion: Ripple.Motion<number>;
	transparency: Source<number>;
	selected: Source<number>;
}

export function Tabs({ motion, transparency, selected }: TabsProps) {
	const start = source<number>(0);

	function starter(i: number) {
		if (i !== 0) return {};

		return {
			[2]: action((x: GuiObject) => {
				start(x.AbsolutePosition.Y);

				const ev = x.GetPropertyChangedSignal("AbsolutePosition").Connect(() => start(x.AbsolutePosition.Y));
				cleanup(() => ev.Disconnect());
			}),
		};
	}

	function Tab({ tab, i }: { tab: AddTab; i: number }) {
		const pos = source(0), size = source(0);
		effect(() => {
			if (selected() !== i) return;

			// idk
			const realSize = size();
			const center = (pos() - start() + (realSize / 2)) / rem(1);
			motion.spring(center, tabSpring);
		});

		return (
			<imagebutton
				Name={tab.title}
				BackgroundTransparency={1}
				AutomaticSize={Enum.AutomaticSize.Y}
				Size={UDim2.fromScale(1)}
				Activated={() => {
					selected(i);
				}}
				LayoutOrder={i * 10}
				AbsolutePositionChanged={(v) => pos(v.Y)}
				AbsoluteSizeChanged={(v) => size(v.Y)}
				{...starter(i)}
			>
				<Text
					text={tab.title}
					size={UDim2.fromScale(1)}
					transparency={transparency}
					align="ml"
				/>
			</imagebutton>
		);
	}

	return ADD_MENU_SECTIONS.map((x, i) => {
		let content = undefined;
		if (x.kind === "tab") {
			content = <Tab tab={x} i={i} />;
		} else if (x.kind === "text") {
			content = (
				<Text
					name={x.text}
					text={x.text}
					textSize={wrapRem(Typography.subtext.remSize)}
					size={UDim2.fromScale(1)}
					automaticSize={Enum.AutomaticSize.Y}
					transparency={() => 1 - ((1 - transparency()) * 0.5)}
					wrap
					layoutOrder={i * 10}
					{...starter(i)}
				/>
			);
		}

		const last = ADD_MENU_SECTIONS[i - 1];
		const addPadding = last && last?.kind !== x.kind;
		return (
			<>
				{addPadding
					? <frame Name="Splitter" BackgroundTransparency={1} Size={new UDim2()} LayoutOrder={i * 10 - 1} />
					: undefined}
				{content}
			</>
		);
	});
}

export function AddPartWindow({ show }: WindowIDProps) {
	const crust = Colors.blendCrust(Colors.inverted);

	const tabSquish = source(1);
	const [tabIndex, tabIndexMotion] = useMotion(0);
	effect(() => cleanup(tabIndexMotion.onStep(() => tabSquish(1 - math.abs(tabIndexMotion.getVelocity() * 5)))));

	const selected = source(firstTabSection);
	const tab = derive(() => ADD_MENU_SECTIONS[selected()]);

	const tabListPadding = 0.35;
	return (
		<Window title="Add Part" icon={icons.custom.add_part} show={show}>
			{(transparency) => (
				<Page>
					<Inline padding={wrapRemUDim(1)}>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromScale(0.25, 1)}
						>
							<Highlight
								position={() => UDim2.fromOffset(0, rem(tabIndex() + tabListPadding))}
								size={() => new UDim2(1, 0, 0, rem(2.5))}
								transparency={() => 1 - ((1 - transparency()) * 0.15)}
								scale={tabSquish}
							/>
							<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
								<ListY align="tm" padding={wrapRemUDim(tabListPadding * 2)} sort={Enum.SortOrder.LayoutOrder} />
								<Padding paddingX={wrapRemUDim(tabListPadding * 2)} paddingTop={wrapRemUDim(tabListPadding)} />
								<Tabs motion={tabIndexMotion} transparency={transparency} selected={selected} />
							</frame>
						</frame>
						<frame
							BackgroundColor3={Colors.blendBase(crust)}
							BackgroundTransparency={transparency}
							Size={UDim2.fromScale(1, 1)}
						>
							<FlexShrink />
							<Text
								text={() => HttpService.JSONEncode(tab())}
								textSize={wrapRem(Typography.subtext.remSize)}
								color={Colors.body}
								wrap
							/>
							<uicorner CornerRadius={wrapRemUDim(1.5)} />
						</frame>
					</Inline>
				</Page>
			)}
		</Window>
	);
}
