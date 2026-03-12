import { bold, gray, hex } from "ansis";

interface Logger {
	debug(...messages: any[]): void;
	info(...messages: any[]): void;
	warn(...messages: any[]): void;
	error(...messages: any[]): void;
}

function simpleBold(x: string) {
	return x.replace(/\*\*(.*?)\*\*/g, (_, v) => bold(v));
}

export function createLogger(scope: string): Logger {
	const message = (level: keyof typeof console, tag: string, clr: string, ...messages: any[]) => {
		const rn = new Date();
		(console[level] as any)(
			gray`${rn.getHours().toString().padStart(2, "0")}:${rn.getMinutes().toString().padStart(2, "0")}:${
				rn.getSeconds().toString().padStart(2, "0")
			}`,
			hex(clr).bold(tag),
			"",
			gray(scope),
			"",
			...messages.map(x => typeof x === "string" ? simpleBold(x) : x),
		);
	};

	// colors STOLEN from https://github.com/charmbracelet/log
	return {
		debug: (...messages) => message("debug", "DEBUG", "#4e2edb", ...messages),
		info: (...messages) => message("info", "INFO ", "#68f2a6", ...messages),
		warn: (...messages) => message("warn", "WARN ", "#f0ac37", ...messages),
		error: (...messages) => message("error", "ERROR", "#e84233", ...messages),
	};
}
