import { ItemInternal } from "@gw2-ui/components";
import GW2ApiItem from "gw2-api-extended/types/items/item";
import component_data from "./component-data.json";

export const MIST_ATTUNEMENTS = [
  {
    id: 299,
    name: "Mist Attunement 1",
    title: "Fractal Savant",
    relics: 25000,
    pristines: 0,
    matrices: 75,
    journals: 8,
  },
  {
    id: 297,
    name: "Mist Attunement 2",
    title: "Fractal Prodigy",
    relics: 35000,
    pristines: 1200,
    matrices: 150,
  },
  {
    id: 296,
    name: "Mist Attunement 3",
    title: "Fractal Champion",
    relics: 45000,
    pristines: 0,
    matrices: 225,
    journals: 16,
  },
  {
    id: 298,
    name: "Mist Attunement 4",
    title: "Fractal God",
    relics: 55000,
    pristines: 2000,
    matrices: 300,
  },
];

export const Relic = (props) => (
  <ItemInternal dataItem={component_data["38022"] as GW2ApiItem} {...props} />
);
export const Pristine = (props) => (
  <ItemInternal dataItem={component_data["69862"] as GW2ApiItem} {...props} />
);
export const Matrix = (props) => (
  <ItemInternal dataItem={component_data["79230"] as GW2ApiItem} {...props} />
);
export const Page = (props) => (
  <ItemInternal dataItem={component_data["73834"] as GW2ApiItem} {...props} />
);
export const Journal = (props) => (
  <ItemInternal dataItem={component_data["75439"] as GW2ApiItem} {...props} />
);
