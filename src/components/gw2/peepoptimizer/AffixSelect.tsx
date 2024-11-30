import { Affix } from "discretize-gear-optimizer/src/utils/gw2-data";
const AFFIXES = ["None", ...Object.keys(Affix).slice(1)];

interface AffixSelectProps {
  title: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AffixSelect({ title, onChange }: AffixSelectProps) {
  return (
    <div className="field suffix border">
      <select onChange={onChange}>
        {AFFIXES.map((affix) => (
          <option key={`${title}_${affix}`}>{affix}</option>
        ))}
      </select>
      <i>arrow_drop_down</i>
      <span className="helper">{title}</span>
    </div>
  );
}
