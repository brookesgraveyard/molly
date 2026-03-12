import { OnStart, Service } from "@flamework/core";

// DocumentService automatically bakes backups and stuff (i think)
// also supports migrations and stuff

let _temp_id = 0;
function _temp_makeobj(kind: string, pos: Vector3): EditorObject {
	return {
		id: tostring(_temp_id++),
		kind,
		position: pos,
	};
}

interface EditorObject {
	id: string;
	kind: string;
	position: Vector3;
}

interface EditorData {
	objects: EditorObject[];
}

const RealDataStore = new Map<string, unknown>();
RealDataStore.set("editor-data", {
	objects: [
		_temp_makeobj("Part", new Vector3(50, 50, 50)),
		_temp_makeobj("Part", new Vector3(50, 52, 52)),
		_temp_makeobj("Part", new Vector3(50, 54, 54)),
		_temp_makeobj("Part", new Vector3(50, 56, 56)),
	],
});
RealDataStore.set("editor-contributors", []);

@Service()
export class EditorService implements OnStart {
	private data: EditorData = { objects: [] };

	private serialize(data: EditorData) {
		return data;
	}
	private deserialize(data: EditorData) {
		return data;
	}

	onStart(): void {
		const editorData = (RealDataStore.get("editor-data") as EditorData) ?? { objects: [] };
		this.data = this.deserialize(editorData);
		this.drawInitial();
	}

	drawInitial() {}
	drawChanges(...changes: EditorObject[]) {}
}
