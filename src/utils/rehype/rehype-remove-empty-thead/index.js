import { visit } from "unist-util-visit";

export default function rehypePlugin() {
  return function transformer(tree) {
    visit(tree, { tagName: "thead" }, (node, index, parent) => {
      let hasText = false;
      visit(node, { tagName: "th" }, (thNode) => {
        if (thNode.children.some((c) => c.value?.trim() !== "")) {
          hasText = true;
          return visit.EXIT;
        }
      });

      if (!hasText) {
        parent.children.splice(index, 1);
      }
    });
  };
}
