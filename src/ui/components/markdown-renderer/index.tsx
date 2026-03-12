import { MarkdownNode, parse } from "@rbxts/markdown-ast";
import { Derivable } from "@rbxts/vide";
import { dissolve } from "shared/utils/vide/dissolve";
import { values } from "shared/utils/vide/primitives";

export interface MarkdownRendererProps {
	content?: Derivable<string | MarkdownNode[]>;
}

export function MarkdownRenderer({ content = [] }: MarkdownRendererProps) {
	return dissolve((read) => {
		const readContent = read(content);
		let ast: MarkdownNode[] = readContent as never;
		if (typeIs(readContent, "string")) ast = parse(readContent);

		return values(ast, (node) => {
			switch (node.type) {
			}
		});
	});
}
