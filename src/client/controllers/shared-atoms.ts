import { Controller, OnStart } from "@flamework/core";
import { Atom } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";
import Iris from "@rbxts/iris";
import Object from "@rbxts/object-utils";
import { Charm } from "client/generated/blink";
import * as atoms from "shared/atoms";
import { OnBlink } from "shared/decorators";

import { DevPanelDropdown } from "./devpanel";

@Controller()
export class SharedAtomsController implements OnStart, DevPanelDropdown {
	syncer = CharmSync.client({ atoms });

	onStart(): void {
		Charm.RequestState.fire();
	}

	@OnBlink(Charm.SyncState)
	syncState(...payload: unknown[]) {
		this.syncer.sync(...payload as never[]);
	}

	private atomsSorted = Object.entries(atoms as Record<string, Atom<unknown>>).sort(([lhs], [rhs]) => lhs < rhs);
	renderDevPanelDropdown() {
		Iris.Table([2]);

		for (const [key, atom] of this.atomsSorted) {
			Iris.Text([key]);
			Iris.NextColumn();
			Iris.Text([tostring(atom())]);
			Iris.NextColumn();
		}

		Iris.End();
	}
}
