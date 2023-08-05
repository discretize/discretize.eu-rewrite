import { Profession } from "@gw2-ui/components";
import { EliteSpecTypes, ProfessionTypes } from "@gw2-ui/data/professions";

export default function Checkbox({
  inputs,
  attribute,
  setInputs,
  name,
  profession,
}: {
  inputs: any;
  attribute: string;
  setInputs: any;
  name: string;
  profession: EliteSpecTypes;
}) {
  return (
    <label className="label cursor-pointer">
      <span className="">
        <Profession name={profession} text={name} />
      </span>
      <input
        type="checkbox"
        className="checkbox"
        checked={inputs[attribute].split(",").includes(name)}
        onChange={(e) => {
          if (e.target.checked) {
            setInputs({
              ...inputs,
              [attribute]: inputs[attribute] + name + ",",
            });
          } else {
            setInputs({
              ...inputs,
              [attribute]: inputs[attribute].replace(name + ",", ""),
            });
          }
        }}
      />
    </label>
  );
}
