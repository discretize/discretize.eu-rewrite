import { GEAR_SLOTS } from "discretize-gear-optimizer/src/utils/gw2-data";
import React from "react";
import AffixSelect from "./AffixSelect";
import ResultCharacter from "./ResultCharacter";

const testState = {
  optimizer: {
    userSettings: {
      expertMode: true,
      gameMode: "fractals",
    },
    control: {
      list: [],
      filteredList: [],
      saved: [],
      compareByPercent: false,
      tallTable: false,
      filterMode: "None",
      displayAttributes: [],
      progress: 0,
      selectedCharacter: null,
      selectedTemplate: "Quickness Condi Firebrand 49%",
      status: "RUNNING",
      profession: "Guardian",
      selectedSpecialization: "Firebrand",
      error: "",
    },
    form: {
      extras: {
        extras: {
          Sigil1: {
            bursting: {},
          },
          Sigil2: {
            smoldering: {},
          },
          Runes: {
            "firebrand-firebrand": {},
          },
          Nourishment: {
            "fishy-rice-bowl": {},
          },
          Enhancement: {
            "toxic-focusing-crystal": {},
            "magnanimous-tuning-crystal": {},
            "toxic-maintenance-oil": {},
          },
        },
        lifestealAmount: "",
      },
      distribution: {
        selectedDistribution: "Condi Quickbrand (Allies)",
        version: 2,
        values1: {},
        values2: {
          Power: 2183,
          Power2: 0,
          Burning: 14.89,
          Bleeding: 3.51,
          Poisoned: 0,
          Torment: 0,
          Confusion: 0,
        },
        textBoxes: {
          Power: 2183,
          Power2: 0,
          Burning: 14.89,
          Bleeding: 3.51,
          Poisoned: 0,
          Torment: 0,
          Confusion: 0,
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
        primaryInfusion: "",
        secondaryInfusion: "",
        primaryMaxInfusions: "",
        secondaryMaxInfusions: "",
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
        selectedLines: ["16", "46", "62"],
        selectedTraits: [
          [566, 567, 1686],
          [617, 587, 622],
          [2101, 2063, 2179],
        ],
        items: [
          {
            "right-hand-strength": {},
            "right-hand-strength-1h": {
              amount: "100",
            },
            "radiant-fire": {},
            retribution: {
              amount: "",
            },
            "radiant-power": {},
            "amplified-wrath": {},
            "righteous-instincts": {},
          },
          {
            "inspired-virtue": {
              amount: "",
            },
            "unscathed-contender": {
              amount: "",
            },
            "virtue-of-retribution": {},
            "inspiring-virtue": {
              amount: "",
            },
            "power-of-the-virtuous": {},
          },
          {
            "imbued-haste": {
              amount: "",
            },
          },
        ],
      },
      skills: {
        skills: {
          "mantra-of-flame": {},
        },
      },
      priorities: {
        optimizeFor: "Damage",
        weaponType: "Dual wield",
        minBoonDuration: 0,
        minHealingPower: "",
        minToughness: "",
        maxToughness: "",
        minHealth: "",
        minCritChance: "",
        minDamage: "",
        minHealing: "",
        minSurvivability: "",
        minOutgoingHealing: "",
        minQuicknessDuration: 48.8,
        affixes: ["Viper", "Ritualist"],
        exclusions: {
          enabled: false,
          data: {},
        },
        exotics: {
          enabled: false,
          data: {},
        },
        customAffix: {},
        customAffixTextBox: "",
        customAffixError: "",
      },
      extraModifiers: {
        error: "",
        extraModifiers: [],
        textBox: "",
      },
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
      boss: {
        attackRate: "0.4",
        movementUptime: "0",
      },
    },
  },
};

const Component = ({ templates }) => {
  const [result, setResult] = React.useState([]);
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
    let value,
      done = false;

    const { calculate } = await import(
      "discretize-gear-optimizer/src/state/optimizer/optimizer"
    );

    testState.optimizer.form.forcedSlots.slots = forcedSlots;
    const resultGenerator = calculate(testState);
    while (true) {
      ({ value, done } = resultGenerator.next());
      if (done) {
        break;
      }
    }
    setResult(value.list);
    console.log(value);
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
