// react functional component
import { TextDivider } from "@discretize/react-discretize-components";
import { AugmentationsTypes } from "@gw2-ui/data/augmentations";
import React, { useEffect, useState } from "react";
import initialState from "./initialState.json";
import { Matrix, MIST_ATTUNEMENTS, Page, Pristine, Relic } from "./RelicsData";
import ResultTable from "./ResultTable";
import confetti from "canvas-confetti";
import RelicsCalculatorImport from "./Import";

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
  const [showImport, setShowImport] = useState(false);

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
      <RelicsCalculatorImport
        onImport={({
          augment: importedAugment,
          relics: importedRelics,
          pristines: importedPristines,
          matrices: importedMatrices,
          journals: importedJournals,
          pages: importedPages,
        }) => {
          setState({
            ...state,
            augment: importedAugment,
            relics: importedRelics,
            pristines: importedPristines,
            matrices: importedMatrices,
            journals: importedJournals,
            pages: importedPages,
          });
        }}
      />

      <div className="grid grid-cols-12 gap-8 mt-8">
        <div className="row-auto col-end-auto sm:col-span-12 md:col-span-3">
          <div className={""}>
            <h2>Account values</h2>

            <div className={`form-control w-full`}>
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

          <div className={"mt-8"}>
            <h4>Your daily routine</h4>
            <ul className={`m-0 p-0 list-none`}>
              {inputs
                .filter((augInput) => typeof augInput.value === "boolean")
                .map((input) => (
                  <li key={input.stateName} className="mt-3">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">{input.label}</span>

                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={input.value as boolean}
                          onChange={(e) =>
                            setState({
                              ...state,
                              [input.stateName]: e.target.checked,
                            })
                          }
                        />
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="row-auto col-end-auto sm:col-span-12 md:col-span-9 ml-16">
          <h2>Results</h2>
          <div className="flex space-between flex-col gap-10">
            <div
              className={`alert shadow-lg mb-4 ${
                result?.mistAttunements.length ? "alert-info" : "alert-success"
              }`}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  {result?.mistAttunements.length === 0 ? (
                    <>🎉 You already are a Fractal God! 🎉</>
                  ) : (
                    <>
                      You will be a Fractal God in{" "}
                      {Math.ceil(result?.mistAttunements[0].days)} days 🎉
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Daily earnings</h2>
                <p>
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
              </div>
            </div>

            {result?.mistAttunements.length > 0 && (
              <ResultTable result={result} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
