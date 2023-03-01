import { visit } from "unist-util-visit";
import resolve from "./map-gw2-ids";

function attrToProps(attr) {
  const props = {};
  if (attr) {
    attr.forEach((attribute) => {
      props[attribute.name] = attribute.value;
    });
  }
  return props;
}

const COMPONENTS = [
  { type: "Skill", resolve_methods: [(attr) => resolve("Skill", attr)] },
  { type: "Trait", resolve_methods: [(attr) => resolve("Trait", attr)] },
  { type: "Item", resolve_methods: [(attr) => resolve("Item", attr)] },
  {
    type: "Boss",
    resolve_methods: [
      (attr) => resolve("Weapons", attr),
      (attr) => resolve("Skills", attr),
    ],
  },
  {
    type: "Weapons",
    resolve_methods: [(attr) => resolve("Weapons", attr)],
  },
  {
    type: "Skills",
    resolve_methods: [(attr) => resolve("Skills", attr)],
  },
  {
    type: "Character",
    resolve_methods: [
      (attr) => {
        const gear = JSON.parse(attr.gear);
        return {
          ...attr,
          gear: JSON.stringify({
            ...gear,
            armor: resolve("Armor", gear.armor),
            weapon: resolve("Weapons", gear.weapon),
            skills: resolve("Skills", gear.skills),
            backAndTrinket: resolve("BackAndTrinkets", gear.backAndTrinket),
            consumables: resolve("Consumables", gear.consumables),
          }),
        };
      },
    ],
  },
  {
    type: "Traits",
    resolve_methods: [
      (attr) => {
        const props = {};
        Object.keys(attr).forEach((key) => {
          props[key] = key.includes("Selected")
            ? attr[key].split(",")
            : attr[key];
        });
        const resolvedProps = resolve("Traits", props);
        return {
          ...resolvedProps,
          traits1SelectedIds: resolvedProps.traits1SelectedIds?.join(","),
          traits2SelectedIds: resolvedProps.traits2SelectedIds?.join(","),
          traits3SelectedIds: resolvedProps.traits3SelectedIds?.join(","),
        };
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
        const resolvedProps = COMPONENTS.find(
          (comp) => comp.type === componentType
        ).resolve_methods.map((mapFunc) => mapFunc(attr));

        // merge the list of objects into one object
        const newProps = Object.assign(...resolvedProps);

        // append all resolved props, that contain "id" back to the MDast node
        // eslint-disable-next-line no-param-reassign
        node.attributes = [
          ...node.attributes,
          ...Object.keys(newProps)
            .filter(
              (key) =>
                (newProps[key] && key && key.toLowerCase().includes("id")) ||
                key === "gear"
            )
            .map((key) => ({
              type: "mdxJsxAttribute",
              name: key,
              value: newProps[key],
            })),
        ];
      }
    });

    return markdownAST;
  };
};
