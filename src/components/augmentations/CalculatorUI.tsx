// react functional component
import { TextDivider } from "@discretize/react-discretize-components";
import { AugmentationsTypes } from "@gw2-ui/data/augmentations";
import React, { useEffect, useState } from "react";
import initialState from "./initialState.json";
import { Matrix, MIST_ATTUNEMENTS, Page, Pristine, Relic } from "./RelicsData";
import ResultTable from "./ResultTable";
import confetti from "canvas-confetti";

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
    name: AugmentationsTypes;
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
  const [result, setResult] = useState<CalculationResult>(
    initialState as CalculationResult
  );

  useEffect(() => {
    const myWorker = new Worker("/workers/augmentations/augcalc.worker.js");
    setWebworker(myWorker);

    myWorker.onmessage = (e) => {
      console.log(e.data);
      if (e.data.mistAttunements.length === 0) {
        for (let index = 0; index < 30; index++) {
          confetti({
            particleCount: 10,
            startVelocity: 20,
            spread: 360,
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2,
            },
          });
        }
      }

      setResult(e.data);
    };

    return () => {
      myWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (webworker) calculate();
  }, [state]);

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
      <div className="grid grid-cols-12 gap-4">
        <div className="row-auto col-end-auto sm:col-span-12 md:col-span-6">
          <div className={"m-2 sm:m-4 sm:p-8 xl:m-16 xl:p-8 rounded"}>
            <h4>Current account values</h4>
            <div className={`mt-5 mb-0 form-control w-full`}>
              <label className="label">
                <span className="label-text">Mist Attunement Tier</span>
              </label>

              <select
                className="select select-bordered"
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
            </div>

            {inputs
              .filter((augInput) => typeof augInput.value !== "boolean")
              .map((input) => (
                <div key={input.stateName} className={`form-control w-full`}>
                  <label className="label">
                    <span className="label-text">{input.label}</span>
                  </label>
                  <input
                    name={input.stateName}
                    type="text"
                    value={input.value as number}
                    onChange={onInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="row-auto col-end-auto sm:col-span-12 md:col-span-6">
          <div className={"m-2 sm:m-4 sm:p-8 xl:m-16 xl:p-8 rounded"}>
            <h4>Dailies</h4>
            <ul className={`m-0 p-0 list-none`}>
              {inputs
                .filter((augInput) => typeof augInput.value === "boolean")
                .map((input) => (
                  <li key={input.stateName} className="mt-3">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-accent"
                          checked={input.value as boolean}
                          onChange={(e) =>
                            setState({
                              ...state,
                              [input.stateName]: e.target.checked,
                            })
                          }
                        />
                        <span className="label-text">{input.label}</span>
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <TextDivider text="Results" />

      {result?.mistAttunements.length === 0 ? (
        <article className={`max-w-md m-auto text-center`}>
          <h5 className="mb-0 text-blue-500">
            🎉 You already are a Fractal God! 🎉
          </h5>
        </article>
      ) : (
        <>
          <article className={`max-w-md m-auto`}>
            <h5 className="mb-0 text-blue-500">
              You will be a Fractal God in{" "}
              {Math.ceil(result?.mistAttunements[0].days)} days 🎉
            </h5>
            <p>
              Daily earnings:
              <ul style={{ marginBottom: 0 }}>
                <li>
                  {Math.ceil(result?.daily.relics)} <Relic />
                </li>
                <li>
                  {Math.ceil(result?.daily.pristines)} <Pristine />
                </li>
                <li>
                  {Math.ceil(result?.daily.matrices)} <Matrix />
                </li>
                <li>
                  {Math.ceil(result?.daily.pages)} <Page />
                </li>
              </ul>
            </p>
          </article>
          <div style={{ marginBottom: "2rem" }}></div>
          <ResultTable result={result} />
        </>
      )}
    </>
  );
}
