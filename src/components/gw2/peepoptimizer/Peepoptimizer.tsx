import { GEAR_SLOTS } from "discretize-gear-optimizer/src/utils/gw2-data";
import React from "react";
import AffixSelect from "./AffixSelect";
import ResultCharacter from "./ResultCharacter";
import type { Character } from "discretize-gear-optimizer/src/state/optimizer/optimizerCore";

const testState: Parameters<typeof import('discretize-gear-optimizer/src/state/optimizer/optimizer').calculate>[0] = {
  optimizer: {
    userSettings: { expertMode: true, gameMode: "fractals" },
    control: {
      list: [],
      filteredLists: {
        Combinations: [],
        Sigils: [],
        Runes: [],
        Relics: [],
        Nourishment: [],
        Enhancement: [],
      },
      saved: [],
      compareByPercent: true,
      highlightDiffering: false,
      tallTable: false,
      savedHeader: false,
      filterMode: "None",
      displayAttributes: [],
      progress: 0,
      heuristicsProgress: undefined,
      selectedCharacter: null,
      selectedTemplate: "Condi Virtuoso Dueling",
      status: "WAITING",
      profession: "Mesmer",
      selectedSpecialization: "Virtuoso",
      jsHeuristicsEnabled: false,
      jsHeuristicsTarget: "",
      multicore: false,
      hwThreads: "",
      heuristics: false,
      error: "",
    },
    form: {
      extras: {
        extras: {
          Sigil1: { agony: {} },
          Sigil2: { earth: { amount: "4.3" } },
          Runes: { krait: {} },
          Relics: { "aristocracy-relic": {} },
          Nourishment: { "fancy-potato-and-leek-soup": {} },
          Enhancement: { "toxic-focusing-crystal": {} },
        },
        lifestealAmount: "",
      },
      distribution: {
        selectedDistribution: "Condi Virtuoso Dueling",
        version: 2,
        values1: {},
        values2: {
          Power: 3200,
          Power2: 930,
          Burning: 0,
          Bleeding: 0,
          Poisoned: 0,
          Torment: 8.98,
          Confusion: 3.39,
        },
        textBoxes: {
          Power: 3200,
          Power2: 930,
          Burning: 0,
          Bleeding: 0,
          Poisoned: 0,
          Torment: 8.98,
          Confusion: 3.39,
        },
      },
      buffs: {
        buffs: {
          might: true,
          fury: true,
          protection: true,
          vulnerability: true,
          bannerOfStrength: false,
          bannerOfDiscipline: false,
          bannerOfTactics: false,
          bannerOfDefense: false,
          empowerAllies: false,
          spotter: false,
          frostSpirit: false,
          pinpointDistribution: false,
          strengthInNumbers: false,
          "jade-bot-base": true,
          "jade-bot-per-tier": true,
          "reinforced-armor": true,
          baneSignet: false,
          signetOfJudgment: false,
          signetOfMercy: false,
          signetOfWrath: false,
          assassinsPresence: false,
          riteDwarf: false,
          exposed: false,
          lightArmor: false,
        },
        amounts: {},
      },
      infusions: {
        omnipotion: true,
        ar: "162",
        maxInfusions: "18",
        infusionOptions: [
          { type: "", count: "" },
          { type: "", count: "" },
        ],
        helperData: {
          enabled: false,
          slots: 18,
          impedence: 0,
          attunement: 0,
          singularity: false,
          tear: false,
          freeWvW: true,
          ownedMatrix: 0,
        },
      },
      traits: {
        showAll: false,
        selectedLines: ["24", "1", "66"],
        selectedTraits: [
          [721, 1690, 733],
          [701, 708, 692],
          [2202, 2205, 2223],
        ],
        items: [
          {
            "compounding-power": { amount: "" },
            "Phantasmal Force": { amount: "" },
          },
          {
            "fencers-finesse": { amount: "5.24" },
            "superiority-complex-base": {},
            "superiority-complex": { amount: "" },
            "sharper-images-phantasm": { amount: "1.8" },
            "phantasmal-fury-virtuoso": {},
          },
          {
            "mental-focus": { amount: "" },
            "deadly-blades": { amount: "100" },
            "sharpening-sorrow": {},
            "quiet-intensity": {},
            "quiet-intensity-fury": {},
            bloodsong: {},
            "jagged-mind": { amount: "6.04" },
          },
        ],
      },
      skills: {
        skills: { "signet-of-domination": {}, "signet-of-midnight": {} },
      },
      priorities: {
        optimizeFor: "Damage",
        weaponType: "Dual wield",
        minBoonDuration: "0",
        minHealingPower: "",
        minToughness: "",
        maxToughness: "",
        minHealth: "",
        minCritChance: "",
        minDamage: "",
        minHealing: "",
        minSurvivability: "",
        minOutgoingHealing: "",
        minQuicknessDuration: "0",
        affixes: ["Viper", "Sinister", "Rampager"],
        exclusions: { enabled: false, data: {} },
        exotics: { enabled: false, data: {} },
        customAffix: {},
        customAffixTextBox: "",
        customAffixError: "",
      },
      extraModifiers: { error: "", extraModifiers: [], textBox: "" },
      forcedSlots: {
        slots: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      boss: { attackRate: "0.4", movementUptime: "0" },
    },
    buildPage: {
      character: null,
      weapons: { mainhand1: "", offhand1: "", mainhand2: "", offhand2: "" },
      skills: {
        healId: "",
        utility1Id: "",
        utility2Id: "",
        utility3Id: "",
        eliteId: "",
      },
      traits: { lines: [], selected: [] },
      buffs: 0,
    },
  },
};

const Component = () => {
  const [result, setResult] = React.useState<Character[]>([]);
  const [forcedSlots, setForcedSlots] = React.useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  async function calc() {
    const { calculate } = await import(
      "discretize-gear-optimizer/src/state/optimizer/optimizer"
    );

    testState.optimizer.form.forcedSlots.slots = forcedSlots;
    const resultGenerator = calculate(testState, 1);

    let result: Character[] = [];

    for await (const { list } of resultGenerator) {
      if (list) {
        result = list;
      }
    }

    setResult(result);
  }

  const onClick = () => {
    console.log("clicked");
    console.log(forcedSlots);
    calc();
  };

  return (
    <>
      <h3>Create your own build in case you already own different gear.</h3>
      <h3>1. Select template</h3>

      <h3>2. Select gear you already own</h3>
      <div className="grid">
        {GEAR_SLOTS.map(({ name }, index) => (
          <div className="s12 m3" key={name}>
            <AffixSelect
              title={name}
              onChange={(e) => {
                const newForcedSlots = [...forcedSlots];
                newForcedSlots[index] = e.target.value;
                setForcedSlots(newForcedSlots);
              }}
            />
          </div>
        ))}
      </div>
      <button onClick={onClick}>Calculate</button>

      {result.length > 0 && (
        <ResultCharacter character={result[0]} assumedBuffs={[]} />
      )}
    </>
  );
};

export default Component;
