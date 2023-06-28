import snowblindImage from "../../assets/images/maps/snowblind.jpeg";
import SnowblindPathSVG from "./path-svg/Snowblind.astro";

export type Encounter = {
  xPercent: number;
  yPercent: number;
  isMajor: boolean;
  area: string;
};

const mapsData: Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    PathSVG: (props) => any;
    encounters: Encounter[];
  }
> = {
  snowblind: {
    src: snowblindImage,
    width: 500,
    height: 518,
    PathSVG: SnowblindPathSVG,
    encounters: [
      {
        xPercent: 25,
        yPercent: 30,
        isMajor: true,
        area: '<polygon class={CLASSES} points="66,98 235,98 235,194 66,194 66,98"></polygon>',
      },
      {
        xPercent: 65,
        yPercent: 20,
        isMajor: true,
        area: '<circle cx="123" cy="346" r="58"></circle>',
      },
      {
        xPercent: 50,
        yPercent: 52,
        isMajor: false,
        area: '<polygon points="227,450 369,452 373,157 255,165 257,334 227,450"></polygon>',
      },
      {
        xPercent: 50,
        yPercent: 80,
        isMajor: true,
        area: '<circle cx="425" cy="264" r="49"></circle>',
      },
    ],
  },
};

export const getMapData = (map: string) => mapsData[map];
