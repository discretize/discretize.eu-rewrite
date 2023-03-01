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
    let firstCharacter = false;

    visit(markdownAST, (node) => {
      const componentType = node.name;
      if (componentType === "Character" && firstCharacter) {
        firstCharacter = false;
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "isFirst",
          value: "true",
        });
      }

      if (componentType === "CharacterWithAr") {
        firstCharacter = true;
        // for every child node, check if its character
        // if it is, insert the title prop into a list of characters
        const characters = node.children
          .filter((child) => child.name === "Character")
          .map((child) => attrToProps(child.attributes))
          .map((child) => child.title);

        // then, insert the list of characters into the CharacterWithAr component as an attribute
        // then, insert the CharacterWithAr component into the AST

        const data = {
          estree: {
            type: "Program",
            body: [
              {
                type: "ExpressionStatement",
                expression: valueToEstree(characters),
              },
            ],
            sourceType: "module",
          },
        };
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "characters",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: JSON.stringify(characters),
            data,
          },
        });
      }
    });

    return markdownAST;
  };
};
