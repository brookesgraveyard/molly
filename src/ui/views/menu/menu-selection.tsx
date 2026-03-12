import Vide, { Derivable } from "@rbxts/vide";
import { bigicons } from "shared/generated/spritesheets";
import { HorizontalCollapsingNav } from "ui/components/layouts/horizontal-collapsing-nav";
import { ListX } from "ui/components/styles/list";
import { wrapRemUDim } from "ui/rem";
import { Colors } from "ui/theme";

import { SegmentCard } from "./segment-card";

export interface MenuSelectionProps {
	enabled?: Derivable<boolean>;

	onInfo: () => void;
	onDonate: () => void;
	onStats: () => void;
	onSettings: () => void;
}

export function MenuSelection({
	enabled,
	onInfo,
	onDonate,
	onStats,
	onSettings,
}: MenuSelectionProps) {
	return (
		<HorizontalCollapsingNav
			name="MenuSelection"
			enabled={enabled}
			align="mm"
			hideWhenInvisible
			render={(transparency) => (
				<>
					<ListX padding={wrapRemUDim(2)} align="mm" />

					<SegmentCard
						i={0}
						title="Info"
						color={Colors.purple}
						icon={bigicons.outlined.info}
						transparency={transparency}
						onActivated={onInfo}
					/>
					<SegmentCard
						i={1}
						title="Donate"
						color={Colors.green}
						icon={bigicons.outlined.local_atm}
						transparency={transparency}
						onActivated={onDonate}
					/>
					<SegmentCard
						i={2}
						title="Stats"
						color={Colors.yellow}
						icon={bigicons.outlined.query_stats}
						transparency={transparency}
						onActivated={onStats}
					/>
					<SegmentCard
						i={3}
						title="Settings"
						color={Colors.blue}
						icon={bigicons.outlined.settings}
						transparency={transparency}
						onActivated={onSettings}
					/>
				</>
			)}
		/>
	);
}
