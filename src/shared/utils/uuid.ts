// https://gist.github.com/gaymeowing/7a3e22168b2d39573a5e7601c0d44f92

const UUID_FORMAT = "%x%x%x%x%x%x%x%x-%x%x%x%x-4%x%x%x-%x%x%x%x-%x%x%x%x%x%x%x%x%x%x%x%x";
const WRAP_IN_CURLY_BRACES_FORMAT = "{%*}";
const Y_HEX = 0xB;
const X_HEX = 0xF;
const X_MIN = 0;
const Y_MIN = 8;

// what the actual fuck
export function uuid(wrapInCurlyBraces = true) {
	math.randomseed(DateTime.now().UnixTimestampMillis);
	const uuid = string.format(
		UUID_FORMAT,
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(Y_MIN, Y_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
		math.random(X_MIN, X_HEX),
	);
	return wrapInCurlyBraces ? string.format(WRAP_IN_CURLY_BRACES_FORMAT, uuid) : uuid;
}
