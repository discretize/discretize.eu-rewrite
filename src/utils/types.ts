import GW2ApiItem from "gw2-api-extended/types/items/item";

export type GenericGw2Component = {
  size?: string;
  text?: string;
  className?: string;
};

export type ItemUpgrades = [GW2ApiItem, number][];
