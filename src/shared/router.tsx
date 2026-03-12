import Vide, { Component, derive, source } from "@rbxts/vide";

const currentRoute = source<string | undefined>(undefined);
export function navigate(path: string) {
	currentRoute(path);
}

interface Route {
	path: string;
	component: Component;
}

interface FallbackProps {
	message?: string;
}

interface RouterProps {
	defaultPath: string;
	routes: Route[];
	fallback?: Component<FallbackProps>;
}

export function Router({ defaultPath, routes, fallback: Fallback }: RouterProps) {
	if (!currentRoute()) currentRoute(defaultPath);

	return derive(() => {
		const current = currentRoute();
		const route = routes.find((x) => x.path === current);

		// ok so we're still in a reactive scope.. i dont think it really matters but i think that caused issues last time
		if (route) return <route.component />;
		else if (Fallback) return <Fallback message={`route ${current} does not exist`} />;
		else return undefined;
	});
}
