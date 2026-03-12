import { ReplicatedStorage } from "@rbxts/services";

const value = ReplicatedStorage.WaitForChild("AGREEMENT");
assert(value.IsA("StringValue"), "AGREEMENT should be a StringValue");
export const AGREEMENT = value.Value;
