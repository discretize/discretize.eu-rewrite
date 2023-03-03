import { Item } from "@gw2-ui/components";
import React from "react";

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

export const Relic = (props) => <Item id={38022} {...props} />;
export const Pristine = (props) => <Item id={39078} {...props} />;
export const Matrix = (props) => <Item id={79230} {...props} />;
export const Journal = (props) => <Item id={75439} {...props} />;
export const Page = (props) => <Item id={73834} {...props} />;
