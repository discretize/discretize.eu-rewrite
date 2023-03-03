// react functional component
import React, { useEffect, useState } from "react";
import classes from "./CalculatorUI.module.css";
import { MIST_ATTUNEMENTS } from "./RelicsData";
import initialState from "./initialState.json";

interface Props {}

interface CalculationResult {
  daily: {
    relics: number;
    pristines: number;
    matrices: number;
    pages: number;
  };
  mistAttunements: Array<{
    id: number;
    name: string;
    title: string;
    days: number;
    matrices: number;
    pristines: number;
    relics: number;
    journals?: number;
    convert: {
      pristinesToRelics: number;
      relicsToMatrices: number;
      pagesToJournals: number;
    };
    standard: {
      daysForRelics: number;
      daysForPristines: number;
      daysForMatrices: number;
      daysForJournals: number;
    };
    total: {
      relics: number;
      pristines: number;
      matrices: number;
      journals: number;
    };
  }>;
}

export function CalculatorUI(props: Props): React.ReactElement {
  const [state, setState] = useState({
    relics: 0,
    pristines: 0,
    matrices: 0,
    augment: 0,
    journals: 0,
    pages: 0,
    cm100: true,
    cm99: true,
    cm98: true,
    t4s: true,
    recs: true,
    weekly: true,
    convertPots: true,
    extraRelicsEnable: false,
    extraRelicsValue: 0,
  });
  const [webworker, setWebworker] = useState<Worker | null>(null);
  const [result, setResult] = useState<CalculationResult>(initialState);

  useEffect(() => {
    const myWorker = new Worker("src/workers/augmentations/augcalc");
    setWebworker(myWorker);

    myWorker.onmessage = (e) => {
      console.log(e.data);
      setResult(e.data);
    };

    return () => {
      myWorker.terminate();
    };
  }, []);

  const inputs = [
    {
      label: "Fractal Relics",
      value: state.relics,
      stateName: "relics",
    },
    {
      label: "Pristine Fractal Relics",
      value: state.pristines,
      stateName: "pristines",
    },
    {
      label: "Integrated Fractal Matrices",
      value: state.matrices,
      stateName: "matrices",
    },
    {
      label: "Fractal Journals",
      value: state.journals,
      stateName: "journals",
    },
    {
      label: "Fractal Research Pages",
      value: state.pages,
      stateName: "pages",
    },

    {
      label: "Sunqua Peak CM",
      value: state.cm100,
      stateName: "cm100",
    },
    {
      label: "Shattered Observatory CM",
      value: state.cm99,
      stateName: "cm99",
    },
    {
      label: "Nightmare CM",
      value: state.cm98,
      stateName: "cm98",
    },
    {
      label: "Daily T4 Fractals",
      value: state.t4s,
      stateName: "t4s",
    },
    {
      label: "Daily Recommended Fractals",
      value: state.recs,
      stateName: "recs",
    },
    {
      label: "Weekly T4s",
      value: state.weekly,
      stateName: "weekly",
    },
    {
      label: "Convert Potions",
      value: state.convertPots,
      stateName: "convertPots",
    },
  ];

  function calculate() {
    // do calculations
    console.log(state);
    webworker.postMessage(state);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // only allow numerical inputs
    const parsedValue = parseInt(e.target.value || "0", 10);
    if (isNaN(parsedValue)) return;
    setState({
      ...state,
      [e.target.name]: parsedValue,
    });
  }

  return (
    <>
      <div className="grid large-space">
        <div className="s12 m6">
          <div className={classes.augCalcInputContainer}>
            <h4>Current account values</h4>
            <div
              className={`field label suffix border ${classes.augCalcTextInput}`}
            >
              <select
                onChange={(e) =>
                  setState({ ...state, augment: parseInt(e.target.value, 10) })
                }
              >
                <option value={0}>None</option>
                {MIST_ATTUNEMENTS.map((attunement, index) => (
                  <option key={attunement.id} value={index + 1}>
                    {attunement.name} - {attunement.title}
                  </option>
                ))}
              </select>
              <label className="active">Label</label>
              <i>arrow_drop_down</i>
            </div>

            {inputs
              .filter((augInput) => typeof augInput.value !== "boolean")
              .map((input) => (
                <div
                  key={input.stateName}
                  className={`field label border ${classes.augCalcTextInput}`}
                >
                  <input
                    name={input.stateName}
                    type="text"
                    value={input.value as number}
                    onChange={onInputChange}
                  />
                  <label>{input.label}</label>
                </div>
              ))}
          </div>
        </div>

        <div className="s12 m6">
          <div className={classes.augCalcInputContainer}>
            <h4>Dailies</h4>
            <div className={`field ${classes.augSettingButtons}`}>
              {inputs
                .filter((augInput) => typeof augInput.value === "boolean")
                .map((input) => (
                  <label key={input.stateName} className="checkbox">
                    <input
                      type="checkbox"
                      checked={input.value as boolean}
                      onChange={(e) =>
                        setState({
                          ...state,
                          [input.stateName]: e.target.checked,
                        })
                      }
                    />
                    <span>{input.label}</span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={calculate}>Calculate</button>

      {result?.mistAttunements.map((result) => (
        <div key={result.id}>
          <h4>{result.name}</h4>
          <p>{result.title}</p>
          <p>{result.days}</p>
        </div>
      ))}
    </>
  );
}
