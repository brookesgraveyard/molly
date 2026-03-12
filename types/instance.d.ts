interface Instance {
	WaitForChild<K extends ExtractKeys<this, Instance> = ExtractKeys<this, Instance>>(childName: K): this[K];
	WaitForChild<K extends ExtractKeys<this, Instance> = ExtractKeys<this, Instance>>(
		childName: K,
		timeout: number,
	): Maybe<this[K]>;
	WaitForChild<T extends Instance = Instance>(childName: string): T;
	WaitForChild<T extends Instance = Instance>(childName: string, timeout: number): Maybe<T>;
	FindFirstChild<K extends ExtractKeys<this, Instance> = ExtractKeys<this, Instance>>(
		childName: K,
		recursive?: boolean,
	): this[K];
	FindFirstChild<T extends Instance = Instance>(childName: string | number, recursive?: boolean): Maybe<T>;
	FindFirstAncestor<T extends Instance = Instance>(name: string | number): Maybe<T>;
	FindFirstDescendant<T extends Instance = Instance>(name: string | number): Maybe<T>;
	GetAttribute<T extends AttributeValue = AttributeValue>(attribute: string): Maybe<T>;
}

interface InstanceConstructor {
	new<T extends keyof CreatableInstances>(className: T): CreatableInstances[T];
	/** @deprecated dont set parent immediately as it costs a bit more, always do properties -> children -> set parent/ancestor stuff -> observing the instance */
	new<T extends keyof CreatableInstances>(className: T, parent: Instance): CreatableInstances[T];
	fromExisting: <T extends Instance>(existingInstance: T) => T;
}

interface Player {
	PlayerGui: StarterGui;
	Backpack: Backpack;
}

interface Workspace {
	Obby: Folder;
}
