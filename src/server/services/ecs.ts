import { OnInit, Service } from "@flamework/core";
import { World } from "@rbxts/matter";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { translateFromObby } from "shared/constants/bounds";
import { DEFAULT_BASE_PART_PROPS } from "shared/constants/obby";
import { BasePartProps, Part } from "shared/ecs/components";
import { start } from "shared/ecs/start";
import { State } from "shared/ecs/types";
import { UserId } from "shared/users";
import { uuid } from "shared/utils/uuid";

@Service({ loadOrder: -1 })
export class EcsService implements OnInit {
	world!: World;
	state!: State;

	onInit() {
		const [world, state] = start([
			ServerScriptService.WaitForChild("Server").WaitForChild("systems"),
			ReplicatedStorage.WaitForChild("Shared").WaitForChild("systems"),
		]);

		this.world = world;
		this.state = state;

		// setupTags(world, "serverEntityId", {
		// 	LobbyConveyorSegment,
		// });

		// temp
		world.spawn(
			Part({
				id: uuid(),
				creator: UserId.GABA8,
				editors: [],
			}),
			BasePartProps({
				...DEFAULT_BASE_PART_PROPS,
				transform: translateFromObby(new CFrame(15.5, 26, -50.5).mul(CFrame.fromEulerAnglesYXZ(15.5, 26, -50.5))),
				size: new Vector3(25, 37, 31),
				transparency: 0.5,
				castShadow: false,
				color: Color3.fromHex("#ff00ff"),
				material: Enum.Material.Neon,
			}),
		);
		world.spawn(
			Part({
				id: uuid(),
				creator: UserId.ImNotFireMan123,
				editors: [],
			}),
			BasePartProps({
				...DEFAULT_BASE_PART_PROPS,
				transform: new CFrame(10, 10, 10),
			}),
		);
		world.spawn(
			Part({
				id: uuid(),
				creator: UserId.GABA8,
				editors: [],
			}),
			BasePartProps({
				...DEFAULT_BASE_PART_PROPS,
				color: new Color3(1, 0, 0),
				transform: new CFrame(-10, 5, 5),
			}),
		);
		world.spawn(
			Part({
				id: uuid(),
				creator: UserId.GABA8,
				editors: [UserId.ImNotFireMan123],
			}),
			BasePartProps({
				...DEFAULT_BASE_PART_PROPS,
				size: Vector3.one.mul(10),
				transform: new CFrame(0, 10, 0),
			}),
		);
	}
}
