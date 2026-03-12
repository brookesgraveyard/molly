declare interface ControlModule {
	GetMoveVector(): Vector3;
}

declare const PlayerModule: {
	GetCameras(): unknown;
	GetControls(): ControlModule;
	GetClickToMoveController(): unknown;
};

export = PlayerModule;
export as namespace PlayerModule;
