import React from "react";
import Input from "./Input";
import { Item, Profession, Spinner } from "@gw2-ui/components";
import Checkbox from "./Checkbox";

export default function ApplyForm() {
  const [inputs, setInputs] = React.useState({
    /** ingame account name (name.XXXX) */
    accName: "",
    /** discord name (name#XXXX) */
    discordName: "",
    /** current main guild of applicant */
    mainGuild: "",
    /** applicant's api key to check whether requirements are fulfilled * */
    apiKey: "",
    /** voluntary: killproof.me link DEPRECATED (uses account name now) */
    kpLink: "", //
    /** confirmation of age and valid answers */
    requirements: "",
    /** list of applicant's power builds (for 98/99CM) */
    powerBuilds: "",
    /** list of applicant's condi builds (for 100CM) */
    condiBuilds: "",
    /** non-static only: logs of all cm bosses */
    soloLogs: "",
    /** non-static only: when the applicant can play with us  */
    soloTimes: "",
    /** non-static only: how the applicant usually fills their groups */
    soloFindMember: "",
    /** previous experience with fractals */
    experience: "",
    /** why they would like to join the guild */
    whyJoin: "",
  });

  const [valid, setValid] = React.useState({
    logs: false,
    boringInputs: false,
  });

  const [status, setStatus] = React.useState("idle");

  React.useEffect(() => {
    const boringInputs =
      inputs.accName.length > 0 &&
      inputs.discordName.length > 0 &&
      inputs.mainGuild.length > 0 &&
      inputs.apiKey.length > 0 &&
      inputs.kpLink.length > 0 &&
      inputs.requirements &&
      inputs.powerBuilds.length > 0 &&
      inputs.condiBuilds.length > 0 &&
      inputs.soloTimes.length > 0 &&
      inputs.experience.length > 0 &&
      inputs.whyJoin.length > 0;

    setValid({ ...valid, logs: validateLogs(inputs.soloLogs), boringInputs });
  }, [inputs]);

  function validateLogs(logs: string) {
    // count number of builds
    const totalBuilds =
      inputs.powerBuilds.split(",").length +
      inputs.condiBuilds.split(",").length -
      2;
    return logs.split("https://dps.report/").length >= 10 * totalBuilds;
  }

  function doSubmit() {
    const formData = Object.keys(inputs).map((key) => inputs[key]);

    setStatus("submitting");
    fetch("https://discretize-serverless-apply.princeps.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    });
  }
  return (
    <>
      <div>
        <section className="mb-8">
          <h3>General</h3>
          <Input
            label="What is your account name?"
            placeholder="Account Name"
            onChange={(e) => setInputs({ ...inputs, accName: e.target.value })}
            value={inputs.accName}
          />

          <Input
            label="What is your discord tag?"
            placeholder="Discord Tag"
            onChange={(e) =>
              setInputs({ ...inputs, discordName: e.target.value })
            }
            value={inputs.discordName}
          />

          <Input
            label="What is your main guild?"
            placeholder="Main Guild"
            onChange={(e) =>
              setInputs({ ...inputs, mainGuild: e.target.value })
            }
            value={inputs.mainGuild}
          />
        </section>
        <section className="mb-8">
          <h3>Requirements</h3>
          <Input
            label="What is your API key?"
            placeholder="API Key"
            onChange={(e) => setInputs({ ...inputs, apiKey: e.target.value })}
            value={inputs.apiKey}
            altLabel={
              <>
                Create an API Key at{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href="https://account.arena.net/applications"
                  target="_blank"
                  rel="noreferrer"
                >
                  ArenaNet
                </a>{" "}
                (required permissions: Account, characters, progression, builds,
                wallet and inventories). The key is required to validate our
                requirements.
              </>
            }
          />

          <Input
            label="What is your killproof.me link?"
            placeholder="Killproof.me Link"
            onChange={(e) => setInputs({ ...inputs, kpLink: e.target.value })}
            value={inputs.kpLink}
          />
        </section>
        <section className="mb-8">
          <h3>Power builds</h3>
          <p>
            It is highly recommended to only apply with one role unless you feel
            confident to be able to provide high-end gameplay on more builds.
          </p>
          <div className="form-control">
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Renegade"
              profession="Renegade"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Scrapper"
              profession="Scrapper"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Soulbeast"
              profession="Soulbeast"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Dragonhunter"
              profession="Dragonhunter"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Bladesworn"
              profession="Bladesworn"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Weaver"
              profession="Weaver"
            />
            <Checkbox
              inputs={inputs}
              attribute="powerBuilds"
              setInputs={setInputs}
              name="Power Reaper"
              profession="Reaper"
            />
          </div>
        </section>

        <section className="mb-8">
          <h3>Condi builds</h3>
          <p>
            It is highly recommended to only apply with one role unless you feel
            confident to be able to provide high-end gameplay on more builds.
          </p>
          <div className="form-control text-base">
            <Checkbox
              inputs={inputs}
              attribute="condiBuilds"
              setInputs={setInputs}
              name="Condi Specter"
              profession="Specter"
            />
            <Checkbox
              inputs={inputs}
              attribute="condiBuilds"
              setInputs={setInputs}
              name="Hybrid Soulbeast"
              profession="Soulbeast"
            />
            <Checkbox
              inputs={inputs}
              attribute="condiBuilds"
              setInputs={setInputs}
              name="Condi Holosmith"
              profession="Holosmith"
            />
            <Checkbox
              inputs={inputs}
              attribute="condiBuilds"
              setInputs={setInputs}
              name="Condi Harbinger"
              profession="Harbinger"
            />
          </div>
        </section>

        <section className="mb-8">
          <h3>Logs</h3>
          <p>
            Please post for every CM boss your best log for each build you apply
            with. Example: you apply with one power build and one condi build;
            you are expected to post 2x9 logs (6x old CMs, 2x Ai, 1x Silent
            Surf).
          </p>
          <textarea
            className="textarea textarea-bordered w-96"
            placeholder="Logs"
            onChange={(e) => setInputs({ ...inputs, soloLogs: e.target.value })}
            value={inputs.soloLogs}
          ></textarea>

          {validateLogs(inputs.soloLogs) ? (
            <p className="text-green-500">Log count valid</p>
          ) : (
            <p className="text-red-500">Log count invalid</p>
          )}
        </section>

        <section className="mb-8">
          <h3>Additional information</h3>

          <Input
            label="When are you playing usually?"
            placeholder="When are you playing usually?"
            onChange={(e) =>
              setInputs({ ...inputs, soloTimes: e.target.value })
            }
            value={inputs.soloTimes}
          />

          <Input
            label="Selfassessment: Previous fractal speedclearing experience?"
            placeholder="Selfassessment: Experience"
            onChange={(e) =>
              setInputs({ ...inputs, experience: e.target.value })
            }
            value={inputs.experience}
          />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Why do you want to join us?</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-80"
              placeholder="Why do you want to join us?"
              onChange={(e) =>
                setInputs({ ...inputs, whyJoin: e.target.value })
              }
              value={inputs.whyJoin}
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                I have read the apply page and answered all questions
                truthfully. I am over 18 years old.
              </span>
              <input
                type="checkbox"
                checked={inputs.requirements}
                className="checkbox"
                onChange={(e) =>
                  setInputs({ ...inputs, requirements: e.target.checked })
                }
              />
            </label>
          </div>
        </section>

        {!Object.values(valid).every((v) => v) && (
          <p className="text-red-500">
            Please fill out all required fields and make sure your logs are
            valid.
          </p>
        )}
        <button
          className={
            "btn btn-primary" +
            (status === "success" ? " btn-success" : "") +
            (status === "error" ? " btn-error" : "")
          }
          disabled={!Object.values(valid).every((v) => v)}
          onClick={doSubmit}
        >
          {status === "idle" && "Submit"}
          {status === "submitting" && <Spinner />}
          {status === "success" && "Success!"}
        </button>
      </div>
    </>
  );
}
