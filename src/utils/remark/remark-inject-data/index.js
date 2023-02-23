import { visit } from "unist-util-visit";
//import items from "../../../../gw2-api-extended/data/api-extended/items.json";
import skills from "../../../../gw2-api-extended/data/api-extended/skills.json";
import traits from "../../../../gw2-api-extended/data/api-extended/traits.json";
import { valueToEstree } from "estree-util-value-to-estree";
import fs from "fs";

// for some reason we cant import this or else we run out of memory
// I suspect some kind of abnormality of how mdx handles remark plugins and imports
const items = JSON.parse(
  fs.readFileSync("./gw2-api-extended/data/api-extended/items.json", "utf-8")
);

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

//const items = [];

const COMPONENTS = [
  {
    type: "Skill",
    prop_name: "data",
    resolve_methods: [(attr) => resolve(skills, attr)],
  },
  {
    type: "Trait",
    prop_name: "data",
    resolve_methods: [(attr) => resolve(traits, attr)],
  },
  {
    type: "Item",
    prop_name: "dataItem",
    resolve_methods: [(attr) => resolve(items, attr)],
  },
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
            name: COMPONENTS.find((comp) => comp.type === componentType)
              .prop_name,
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
