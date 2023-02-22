import { visit } from "unist-util-visit";
import items from "./mapping/items.json";
import skills from "./mapping/skills.json";
import traits from "./mapping/traits.json";
import { valueToEstree } from "estree-util-value-to-estree";

function attrToProps(attr) {
  const props = {};
  if (attr) {
    attr.forEach((attribute) => {
      props[attribute.name] = attribute.value;
    });
  }
  return props;
}

function resolve(array, attr) {
  return array.filter((item) => item.id == attr.id)[0];
}

const COMPONENTS = [
  {
    type: "Skill",
    resolve_methods: [(attr) => resolve(skills, attr)],
  },
  { type: "Trait", resolve_methods: [(attr) => resolve(traits, attr)] },
  //{ type: "Item", resolve_methods: [(attr) => resolve("Item", attr)] },
];

export default () => {
  return (markdownAST) => {
    visit(markdownAST, (node) => {
      const componentType = node.name;

      if (COMPONENTS.map((comp) => comp.type).includes(componentType)) {
        // attributes of the component formatted as json object, **not** as MDast expression
        const attr = attrToProps(node.attributes);

        // apply all resolver functions
        const value = COMPONENTS.find(
          (comp) => comp.type === componentType
        ).resolve_methods.map((mapFunc) => mapFunc(attr))[0];

        const data = {
          estree: {
            type: "Program",
            body: [
              {
                type: "ExpressionStatement",
                expression: valueToEstree(value),
              },
            ],
            sourceType: "module",
          },
        };

        // append all resolved props, that contain "id" back to the MDast node
        // eslint-disable-next-line no-param-reassign
        node.attributes = [
          ...node.attributes,
          {
            type: "mdxJsxAttribute",
            name: "data",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: JSON.stringify(value),
              data,
            },
          },
        ];
      }
    });

    return markdownAST;
  };
};
