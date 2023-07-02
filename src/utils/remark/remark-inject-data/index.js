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
        resolve: (attr) => resolve(skills)(attr.id) || {},
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
  {
    type: "Character",
    resolvers: [
      {
        target_prop: "data",
        resolve: (attr) => {
          const parsed = JSON.parse(attr.gear);
          const armor = {
            helm: resolve(items)(parsed.armor.helmId),
            shoulders: resolve(items)(parsed.armor.shouldersId),
            coat: resolve(items)(parsed.armor.coatId),
            gloves: resolve(items)(parsed.armor.glovesId),
            leggings: resolve(items)(parsed.armor.leggingsId),
            boots: resolve(items)(parsed.armor.bootsId),
          };

          const upgrades = {
            runes: [
              ...new Set([
                resolve(items)(parsed.armor.helmRuneId),
                resolve(items)(parsed.armor.shouldersRuneId),
                resolve(items)(parsed.armor.coatRuneId),
                resolve(items)(parsed.armor.glovesRuneId),
                resolve(items)(parsed.armor.leggingsRuneId),
                resolve(items)(parsed.armor.bootsRuneId),
              ]),
            ].filter((rune) => !!rune),
            infusions: [
              ...new Set([
                resolve(items)(parsed.armor.helmInfusionId),
                resolve(items)(parsed.armor.shouldersInfusionId),
                resolve(items)(parsed.armor.coatInfusionId),
                resolve(items)(parsed.armor.glovesInfusionId),
                resolve(items)(parsed.armor.leggingsInfusionId),
                resolve(items)(parsed.armor.bootsInfusionId),
                resolve(items)(parsed.weapon.weapon1MainInfusion1Id),
                resolve(items)(parsed.weapon.weapon1MainInfusion2Id),
                resolve(items)(parsed.weapon.weapon1OffInfusionId),
                resolve(items)(parsed.weapon.weapon2MainInfusion1Id),
                resolve(items)(parsed.weapon.weapon2MainInfusion2Id),
                resolve(items)(parsed.weapon.weapon2OffInfusionId),
                resolve(items)(parsed.backAndTrinket.backItemInfusion1Id),
                resolve(items)(parsed.backAndTrinket.backItemInfusion2Id),
                resolve(items)(parsed.backAndTrinket.accessory1InfusionId),
                resolve(items)(parsed.backAndTrinket.accessory2InfusionId),
                resolve(items)(parsed.backAndTrinket.ring1Infusion1Id),
                resolve(items)(parsed.backAndTrinket.ring1Infusion2Id),
                resolve(items)(parsed.backAndTrinket.ring1Infusion3Id),
                resolve(items)(parsed.backAndTrinket.ring2Infusion1Id),
                resolve(items)(parsed.backAndTrinket.ring2Infusion2Id),
                resolve(items)(parsed.backAndTrinket.ring2Infusion3Id),
              ]),
            ].filter((infusion) => !!infusion),
            sigils: [
              ...new Set([
                resolve(items)(parsed.weapon.weapon1MainSigil1Id),
                resolve(items)(parsed.weapon.weapon1MainSigil2Id),
                resolve(items)(parsed.weapon.weapon1OffSigilId),
                resolve(items)(parsed.weapon.weapon2MainSigil1Id),
                resolve(items)(parsed.weapon.weapon2MainSigil2Id),
                resolve(items)(parsed.weapon.weapon2OffSigilId),
              ]),
            ].filter((sigil) => !!sigil),
          };

          const weapon = {
            weapon1MainData: resolve(items)(parsed.weapon.weapon1MainId),
            weapon1OffData: resolve(items)(parsed.weapon.weapon1OffId),
            weapon2MainData: resolve(items)(parsed.weapon.weapon2MainId),
            weapon2OffData: resolve(items)(parsed.weapon.weapon2OffId),
          };

          const resolved_skills = {
            healData: resolve(skills)(parsed.skills.healId),
            utility1Data: resolve(skills)(parsed.skills.utility1Id),
            utility2Data: resolve(skills)(parsed.skills.utility2Id),
            utility3Data: resolve(skills)(parsed.skills.utility3Id),
            eliteData: resolve(skills)(parsed.skills.eliteId),
          };

          const backAndTrinket = {
            backItemData: resolve(items)(parsed.backAndTrinket.backItemId),
            accessory1Data: resolve(items)(parsed.backAndTrinket.accessory1Id),
            accessory2Data: resolve(items)(parsed.backAndTrinket.accessory2Id),
            ring1Data: resolve(items)(parsed.backAndTrinket.ring1Id),
            ring2Data: resolve(items)(parsed.backAndTrinket.ring2Id),
            amuletData: resolve(items)(parsed.backAndTrinket.amuletId),
          };

          const consumables = {
            foodData: resolve(items)(parsed.consumables.foodId),
            utilityData: resolve(items)(parsed.consumables.utilityId),
            infusionData: resolve(items)(parsed.consumables.infusionId),
          };

          return {
            armor,
            upgrades,
            weapon,
            skills: resolved_skills,
            backAndTrinket,
            consumables,
          };
        },
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
