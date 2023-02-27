import { visit } from "unist-util-visit";
// import items from "../../../../gw2-api-extended/data/api-extended/items.json";
// import skills from "../../../../gw2-api-extended/data/api-extended/skills.json";
// import traits from "../../../../gw2-api-extended/data/api-extended/traits.json";
import { valueToEstree } from "estree-util-value-to-estree";
import fs from "fs";

// for some reason we cant import this or else we run out of memory
// I suspect some kind of abnormality of how mdx handles remark plugins and imports
const items = JSON.parse(
  fs.readFileSync("./gw2-api-extended/data/api-extended/items.json", "utf-8")
);
const skills = JSON.parse(
  fs.readFileSync("./gw2-api-extended/data/api-extended/skills.json", "utf-8")
);
const traits = JSON.parse(
  fs.readFileSync("./gw2-api-extended/data/api-extended/traits.json", "utf-8")
);
const specializations = JSON.parse(
  fs.readFileSync(
    "./gw2-api-extended/data/api-extended/specializations.json",
    "utf-8"
  )
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

const resolve = (array) => (sourceProp) =>
  array.find((item) => item.id == sourceProp);

const resolveTraitLine = (id) => {
  if (id === undefined) {
    return undefined;
  }

  const specData = resolve(specializations)(id);

  const dataTraits = [...specData.minor_traits, ...specData.major_traits]
    .map((trait) => resolve(traits)(trait))
    .reduce((result, trait) => {
      result[trait.id] = trait;
      return result;
    }, {});

  return { dataSpecialization: specData, dataTraits };
};

const COMPONENTS = [
  {
    type: "Item",
    resolvers: [
      {
        target_prop: "dataItem",
        resolve: (attr) => resolve(items)(attr.id),
      },
    ],
  },
  {
    type: "Skill",
    resolvers: [
      {
        target_prop: "data",
        resolve: (attr) => resolve(skills)(attr.id),
      },
    ],
  },
  {
    type: "Trait",
    resolvers: [
      {
        target_prop: "data",
        resolve: (attr) => resolve(traits)(attr.id),
      },
    ],
  },
  {
    type: "Traits",
    resolvers: [
      {
        target_prop: "traits1data",
        resolve: (attr) => resolveTraitLine(attr.traits1Id),
      },
      {
        target_prop: "traits2data",
        resolve: (attr) => resolveTraitLine(attr.traits2Id),
      },
      {
        target_prop: "traits3data",
        resolve: (attr) => resolveTraitLine(attr.traits3Id),
      },
    ],
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
        const result = COMPONENTS.find(
          (comp) => comp.type === componentType
        ).resolvers.map((resolver) => resolver.resolve(attr));

        // iterate over the results for each resolver function and put the into the MDast node
        for (let i = 0; i < result.length; i++) {
          const value = result[i];

          if (!value) {
            continue;
          }

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
                .resolvers[i].target_prop,
              value: {
                type: "mdxJsxAttributeValueExpression",
                value: JSON.stringify(value),
                data,
              },
            },
          ];
        }
      }
    });

    return markdownAST;
  };
};
