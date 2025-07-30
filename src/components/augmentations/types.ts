import type { AugmentationsTypes } from "@gw2-ui/data/augmentations";

export interface CalculationResult {
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

export interface CalculatorInput {
  relics: number;
  pristines: number;
  matrices: number;
  augment: number;
  journals: number;
  pages: number;
  lonelyTower: boolean;
  silentSurf: boolean;
  sunquaPeak: boolean;
  shatteredObservatory: boolean;
  nightmare: boolean;
  kinfall: boolean;
  t4s: boolean;
  recs: boolean;
  weekly: boolean;
  convertPots: boolean;
  extraRelicsEnable: boolean;
  extraRelicsValue: number;
}
