import snowblindImage from "../../assets/images/maps/snowblind.jpeg";
import SnowblindSVG from "./svg/Snowblind.astro";

export type Encounter = {
  xPercent: number;
  yPercent: number;
  isMajor: boolean;
};

const mapImages: Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    SVG: (props) => any;
    encounters: Encounter[];
  }
> = {
  snowblind: {
    src: snowblindImage,
    width: 500,
    height: 518,
    SVG: SnowblindSVG,
    encounters: [
      {
        xPercent: 25,
        yPercent: 30,
        isMajor: true,
      },
      {
        xPercent: 65,
        yPercent: 20,
        isMajor: true,
      },
      {
        xPercent: 50,
        yPercent: 52,
        isMajor: false,
      },
      {
        xPercent: 50,
        yPercent: 80,
        isMajor: true,
      },
    ],
  },
};

export const getMapImage = (map: string) => mapImages[map];
