import { BasePartProps } from "./obby";

export enum SelectionMode {
	Selection,
	Delete,
	Clone,
	Teleport,
	Move,
	Scale,
	Rotate,
}

export enum BuildMode {
	Build,
	Fly,
	Freecam,
}

export enum CommitMode {
	AddPart,
	EditPart,
	EditObbyProperties,
	DeletePart,
}

interface CommitAddPart {
	mode: CommitMode.AddPart;
}

interface CommitEditPart {
	mode: CommitMode.EditPart;
	id: string;
	properties: BasePartProps;
}

interface CommitDeletePart {
	mode: CommitMode.DeletePart;
	id: string;
}

interface CommitEditObbyProperties {
	mode: CommitMode.EditObbyProperties;
}

export type Commit = CommitAddPart | CommitEditPart | CommitDeletePart | CommitEditObbyProperties;
