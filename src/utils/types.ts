import GW2ApiItem from "gw2-api-extended/types/items/item";

export type GenericGw2Component = {
  size?: string;
};

export type ItemUpgrades = [GW2ApiItem, number][];
