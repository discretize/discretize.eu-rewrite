import { Placement } from "@floating-ui/react-dom";
import snowblindImage from "../../assets/images/maps/snowblind.jpeg";
import thaumnovaReactorIamge from "../../assets/images/maps/thaumanovaReactor.jpg";
import SnowblindPathSVG from "./path-svg/Snowblind.astro";
import ThaumanovaReactorSVG from "./path-svg/ThaumanovaReactor.astro";
import captainMaiTrinBossImage from "../../assets/images/maps/captainMaiTrinBoss.png";
import CaptainMaiTrinBossPathSVG from "./path-svg/CaptainMaiTrinBoss.astro";

export type Encounter = {
  xPercent: number;
  yPercent: number;
  isMajor: boolean;
  area: string;
  tooltipDirection?: Placement;
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
        area: '<polygon points="66,98 235,98 235,194 66,194 66,98"></polygon>',
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
  "thaumanova-reactor": {
    src: thaumnovaReactorIamge,
    width: 3352,
    height: 3348,
    PathSVG: ThaumanovaReactorSVG,
    encounters: [
      {
        xPercent: 65,
        yPercent: 68,
        isMajor: false,
        tooltipDirection: "bottom",
        area: '<rect height="43.07688" width="87.69221" y="1479.84276" x="1465.53477" />',
      },
      {
        xPercent: 75,
        yPercent: 50,
        isMajor: true,
        area: '<rect height="416.92263" width="603.07628" y="2799.84122" x="1293.22729" />',
      },
      {
        xPercent: 50,
        yPercent: 80,
        isMajor: true,
        tooltipDirection: "left",
        area: '<rect height="929.22984" width="378.46113" y="1141.38159" x="2556.30285" />',
      },
      {
        xPercent: 48.5,
        yPercent: 25,
        isMajor: true,
        tooltipDirection: "right",
        area: '<rect height="281.53816" width="749.22997" y="1601.38109" x="151.69004" />',
      },
      {
        xPercent: 18,
        yPercent: 66,
        isMajor: true,
        tooltipDirection: "bottom",
        area: '<ellipse ry="323.84583" rx="366.15344" id="svg_20" cy="408.30542" cx="2665.53352" />',
      },
      {
        xPercent: 35,
        yPercent: 48,
        isMajor: true,
        area: '<ellipse ry="153.846" rx="158.46136" id="svg_17" cy="1499.84274" cx="1745.53448" />',
      },
    ],
  },
  "captain-mai-trin-boss": {
    src: captainMaiTrinBossImage,
    width: 2004,
    height: 2264,
    PathSVG: CaptainMaiTrinBossPathSVG,
    encounters: [
      {
        xPercent: 25,
        yPercent: 52,
        isMajor: true,
        tooltipDirection: "right",
        area: '<ellipse ry="280.00001" rx="356.36364" cy="645.9862" cx="1124.84345" />',
      },
      {
        xPercent: 62,
        yPercent: 60,
        isMajor: true,
        tooltipDirection: "bottom",
        area: '<ellipse ry="365.45455" rx="512.72728"  cy="1460.53168" cx="1152.11618" />',
      },
    ],
  },
};

export const getMapData = (map: string) => mapsData[map];
