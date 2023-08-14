import { IconWithTextProps } from "@gw2-ui/components/IconWithText/IconWithText";
import GW2ApiItem from "gw2-api-extended/types/items/item";

export interface GenericGw2Component extends IconWithTextProps {
  size?: string;
  disableLink?: boolean;
  disableTooltip?: boolean;
}

export type ItemUpgrades = [GW2ApiItem, number][];
