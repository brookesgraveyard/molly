import Object from "@rbxts/object-utils";
import { ContextActionService, UserInputService } from "@rbxts/services";

const keys = {
	left: [Enum.KeyCode.A, Enum.KeyCode.Left, Enum.KeyCode.DPadLeft],
	backwards: [Enum.KeyCode.S, Enum.KeyCode.Down],
	forwards: [Enum.KeyCode.W, Enum.KeyCode.Up],
	right: [Enum.KeyCode.D, Enum.KeyCode.Right, Enum.KeyCode.DPadRight],
	up: [Enum.KeyCode.E, Enum.KeyCode.Space, Enum.KeyCode.DPadUp],
	down: [Enum.KeyCode.Q, Enum.KeyCode.LeftControl, Enum.KeyCode.RightControl, Enum.KeyCode.DPadDown],
	slow: [Enum.KeyCode.LeftShift, Enum.KeyCode.RightShift],
};

export const ALL_MOVEMENT_KEYS: Enum.KeyCode[] = [];
for (const keycodes of Object.values(keys)) for (const key of keycodes) ALL_MOVEMENT_KEYS.push(key);

const captureKey = "MOVEMENT_CAPTURE";
const capturingMovement = new Set<string>();

function refreshCapture() {
	if (capturingMovement.size() >= 1) {
		ContextActionService.BindAction(
			captureKey,
			(_, __, input) => {
				updateJoystickPosition(input);
				return Enum.ContextActionResult.Sink;
			},
			false,
			Enum.KeyCode.Thumbstick1,
			...ALL_MOVEMENT_KEYS,
		);
	} else {
		ContextActionService.UnbindAction(captureKey);
	}
}

export function beginCapturingMovement(key: string) {
	capturingMovement.add(key);
	refreshCapture();
}
export function stopCapturingMovement(key: string) {
	capturingMovement.delete(key);
	refreshCapture();
}

function isHolding(keys: Enum.KeyCode[]) {
	return keys.some(x => UserInputService.IsKeyDown(x));
}

let joystickPosition = new Vector3();
function updateJoystickPosition(input: InputObject) {
	if (input.KeyCode === Enum.KeyCode.Thumbstick1) {
		joystickPosition = new Vector3(input.Position.X, 0, -input.Position.Y);
	}
}

export function getMovementVector() {
	let slow = false;
	let x = 0, y = 0, z = 0;

	if (!UserInputService.GetFocusedTextBox()) {
		slow = isHolding(keys.slow);

		if (isHolding(keys.left)) x -= 1;
		if (isHolding(keys.right)) x += 1;
		if (isHolding(keys.forwards)) z -= 1;
		if (isHolding(keys.backwards)) z += 1;
		if (isHolding(keys.down)) y -= 1;
		if (isHolding(keys.up)) y += 1;
	}

	let vector = new Vector3(x, y, z);
	if (vector.Magnitude > 0) vector = vector.Unit;
	if (joystickPosition.Magnitude > 0) vector = joystickPosition.Unit;

	return $tuple(vector, slow);
}
