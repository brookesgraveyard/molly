import { OnInit, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { Charm } from "server/generated/blink";
import * as atoms from "shared/atoms";

@Service()
export class SharedAtomsService implements OnInit {
	syncer = CharmSync.server({
		atoms,
		// conflicts with blink serialization
		autoSerialize: false,
	});

	onInit(): void {
		this.syncer.connect((player, ...payloads) => Charm.SyncState.fire(player, payloads));
		Charm.RequestState.on((player) => this.syncer.hydrate(player));
	}
}
