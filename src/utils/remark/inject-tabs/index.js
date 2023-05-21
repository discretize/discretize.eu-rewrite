import { valueToEstree } from "estree-util-value-to-estree";
import { visit } from "unist-util-visit";

function attrToProps(attr) {
  const props = {};
  if (attr) {
    attr.forEach((attribute) => {
      props[attribute.name] = attribute.value;
    });
  }
  return props;
}

export default () => {
  return (markdownAST) => {
    let firstTab = false;

    visit(markdownAST, (node) => {
      const componentType = node.name;

      if (componentType === "Tab" && firstTab) {
        firstTab = false;
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "isFirst",
          value: "true",
        });
      }

      if (componentType === "Tabs") {
        firstTab = true;
        uid += 1;
        // for every child node, check if its character
        // if it is, insert the title prop into a list of characters
        const tabs = node.children
          .filter((child) => child.name === "Tab")
          .map((child) => attrToProps(child.attributes))
          .map(({ title, specialization }) => ({ title, specialization }));

        // then, insert the list of characters into the CharacterWithAr component as an attribute
        // then, insert the CharacterWithAr component into the AST

        const data = {
          estree: {
            type: "Program",
            body: [
              {
                type: "ExpressionStatement",
                expression: valueToEstree(tabs),
              },
            ],
            sourceType: "module",
          },
        };
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "tabs",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: JSON.stringify(tabs),
            data,
          },
        });
      }
    });

    return markdownAST;
  };
};
