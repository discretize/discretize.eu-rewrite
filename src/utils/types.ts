import type GW2ApiItem from "gw2-api-extended/types/items/item";

export interface GenericWebsiteComponent {
  size?: string;
}

export type ItemUpgrades = [GW2ApiItem, number][];
