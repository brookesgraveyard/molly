import { Controller, OnInit } from "@flamework/core";
import Make from "@rbxts/make";
import { Players, SoundService } from "@rbxts/services";
import Vide, { mount, source } from "@rbxts/vide";
import { Deathlist } from "client/generated/blink";
import assets from "shared/generated/assets";
// vv move this somewhere better later
import { DeathlistManager } from "shared/services/deathlist";
import { DEATHLIST_PANELS, DeathlistScroller } from "ui/views/deathlist";

// mayb put this in ReplicatedFirst (later .. !!! !! ! )

const LET_ME_KNOW_SPEED = 0.75;
const LET_ME_KNOW_LENGTH = 13.163 / LET_ME_KNOW_SPEED;

@Controller({ loadOrder: -math.huge })
export class DeathlistController extends DeathlistManager implements OnInit {
	onInit(): void | Promise<void> {
		const isDeathlisted = this.isInDeathlist(Players.LocalPlayer.UserId);
		if (isDeathlisted) {
			const index = source(1);
			const show = source(false);

			const letMeKnow = Make("Sound", {
				Parent: SoundService,
				Name: "Let Me Know",
				SoundId: assets.deathlist.letmeknow,
				PlaybackSpeed: LET_ME_KNOW_SPEED,
			});

			mount(() => {
				return (
					<screengui Name="Deathlist" ResetOnSpawn={false} IgnoreGuiInset>
						<DeathlistScroller
							show={show}
							index={index}
							username={Players.LocalPlayer.Name}
							thumbnail={`rbxthumb://type=Avatar&id=${Players.LocalPlayer.UserId}&w=420&h=420`}
						/>
					</screengui>
				);
			}, Players.LocalPlayer.PlayerGui);

			task.wait(5);

			letMeKnow.Ended.Connect(() => {
				task.wait(1);
				Deathlist.SelfBan.fire();
			});

			letMeKnow.Play();
			show(true);

			for (const currentIndex of $range(1, DEATHLIST_PANELS.size())) {
				index(currentIndex);
				task.wait(LET_ME_KNOW_LENGTH / DEATHLIST_PANELS.size());
			}

			// Don't ever return so no other controllers can run :)
			coroutine.yield();
		}
	}
}
