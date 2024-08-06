import SPECIALIZATIONS from "@gw2-ui/data/specializations";
import items from "@gw2api/items.json";
import skills from "@gw2api/skills.json";
import traits from "@gw2api/traits.json";

const BOONS = [
  "Aegis",
  "Alacrity",
  "Fury",
  "Might",
  "Protection",
  "Quickness",
  "Regeneration",
  "Resistance",
  "Resolution",
  "Stability",
  "Swiftness",
  "Vigor",
];

const CONDITIONS = [
  "Bleeding",
  "Blinded",
  "Burning",
  "Chilled",
  "Confusion",
  "Crippled",
  "Fear",
  "Immobile",
  "Poisoned",
  "Slow",
  "Taunt",
  "Torment",
  "Vulnerability",
  "Weakness",
];
const CONTROL = [
  "Daze",
  "Float",
  "Knockback",
  "Knockdown",
  "Launch",
  "Pull",
  "Sink",
  "Stun",
];

const COMMON_EFFECT = [
  "Agony",
  "Barrier",
  "Blight",
  "Exposed",
  "Invulnerability",
  "Revealed",
  "Rigorous Certainty",
  "Stealth",
  "Stun Break",
  "Superspeed",
  "Unblockable",
];

const ATTRIBUTES = [
  "Power",
  "Precision",
  "Toughness",
  "Vitality",
  "Concentration",
  "Condition Damage",
  "Expertise",
  "Ferocity",
  "Healing Power",
  "Armor",
  "Boon Duration",
  "Critical Chance",
  "Critical Damage",
  "Condition Duration",
  "Health",
  "Agony Resistance",
  "Gold Find",
  "Karma Gain",
  "Magic Find",
  "XP Gain",
];

const UNCATEGORIZED = [
  "kallasfervor",
  "chargedleap",
  "tidalbargain",
  "attackofopportunity",
  "battlescars",
];

const SPECIAL_ACTION_KEY = ["hypernovalaunch", "lightofdeldrimor"];

const duplicateSkills = skills.filter(
  (skill, index) =>
    skills.indexOf(skills.find((sk) => sk.name === skill.name)) !== index
);

export const AUTO_COMPLETIONS = [
  ...skills.map((skill) => {
    const hasDuplicate = duplicateSkills.includes(skill);
    const professionAddition = hasDuplicate && skill.profession
      ? ` profession="${skill.profession}"`
      : "";
    return {
      label: skill.name,
      type: "Skill",
      name: `<Skill name="${skill.name}"${professionAddition} />`,
      description: `${skill?.profession?.slice(0, 4) ||  "generic"}-${skill.id}`,
    };
  }),
  ...traits.map((trait) => ({
    label: trait.name,
    type: "Trait",
    name: `<Trait name="${trait.name}" />`,
    description: `${trait?.profession?.slice(0, 4) || "generic"}-${trait.id}`,
  })),
  // ...items.map((item) => ({
  //   label: item.name,
  //   type: "Item",
  //   name: `<Item name="${item.name}" />`,
  //   description: item.d,
  // })),
  ...Object.entries(SPECIALIZATIONS)
    .concat([...new Set(Object.values(SPECIALIZATIONS))].map((a) => [a, a]))
    .map(([spec, prof]) => ({
      label: spec,
      type: "Specialization",
      name: `<Specialization name="${spec}" />`,
      description: prof,
    })),
  ...BOONS.map((boon) => ({
    label: boon,
    type: "Boon",
    name: `<Boon name="${boon}" />`,
  })),
  ...CONDITIONS.map((condi) => ({
    label: condi,
    type: "Condition",
    name: `<Condition name="${condi}" />`,
  })),
  ...CONTROL.map((value) => ({
    label: value,
    type: "Control",
    name: `<Control name="${value}" />`,
  })),
  ...COMMON_EFFECT.map((value) => ({
    label: value,
    type: "Effect",
    name: `<Effect name="${value}" />`,
  })),
  ...ATTRIBUTES.map((value) => ({
    label: value,
    type: "Attribute",
    name: `<Attribute name="${value}" />`,
  })),
  ...UNCATEGORIZED.map((value) => ({
    label: value,
    type: "Uncategorized",
    name: `<Uncategorized name="${value}" />`,
  })),
  ...SPECIAL_ACTION_KEY.map((value) => ({
    label: value,
    type: "SpecialActionKey",
    name: `<SpecialActionKey name="${value}" />`,
  })),
  // general components
  {
    label: "Card",
    type: "Card",
    name: `<Card>\n\n</Card>`,
  },
  {
    label: "Grid",
    type: "Grid",
    name: `<Grid>\n<GridItem>\n\n</GridItem>\n</Grid>`,
  },
  {
    label: "GridItem",
    type: "GridItem",
    name: `<GridItem>\n\n</GridItem>`,
  },
  {
    label: "BuildLink",
    type: "BuildLink",
    name: `<BuildLink build="Power Weaver" specialization="Weaver"/>`,
  },
  {
    label: "Warning",
    type: "Warning",
    name: `<Warning>\n\n\n</Warning>`,
  },
  {
    label: "Information",
    type: "Information",
    name: `<Information>\n\n\n</Information>`,
  },
  {
    label: "Divider",
    type: "Divider",
    name: `<Divider text="" />`,
  },
].map(({ name, type, label, description }) => ({
  caption: `${type}: ${label} ${description ? `(${description})` : ""}`,
  value: name,
  meta: "local",
}));

