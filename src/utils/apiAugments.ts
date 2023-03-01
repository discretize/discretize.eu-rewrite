import { getImage } from "@astrojs/image";
import type { ItemCategoryName } from "@gw2-ui/builder/itemCategoryNames";
import ITEM_MODIFIERS, { ItemModifiers } from "@gw2-ui/builder/itemModifiers";
import { ItemStatName } from "@gw2-ui/builder/itemStatNames";
import itemStats from "@gw2-ui/builder/itemStats";
import type GW2ApiItem from "gw2-api-extended/types/items/item";

function addAffixToGw2ui(
  data: GW2ApiItem,
  type: ItemCategoryName,
  affix: ItemStatName
) {
  if (!data) return data;
  const { attributes: attributeModifiers }: ItemModifiers =
    ITEM_MODIFIERS[data.type][
      type.replace("ShortBow", "Short Bow").replace("LongBow", "Longbow")
    ]["Ascended"];

  const { type: statType, bonuses: statBonuses } = itemStats[affix];
  const statModifiers =
    attributeModifiers !== undefined ? attributeModifiers[statType] : undefined;

  if (!statModifiers) {
    throw new Error(`Invalid item stat`);
  }

  const attributes = statModifiers.flatMap((modifier, index) =>
    statBonuses[index].flatMap((attribute) => {
      return {
        attribute,
        modifier,
      };
    })
  );

  data.details.infix_upgrade = {
    attributes,
  };

  return data;
}

async function optimizeIcons(data: GW2ApiItem, size: number = 60) {
  if (!data) return data;

  if (data.icon) {
    // optimize icon
    const optimized = await getImage({
      src: data.icon,
      width: size,
      height: size,
      format: "webp",
      alt: "",
    });

    data.icon = optimized.src;
  }

  return data;
}

export { addAffixToGw2ui, optimizeIcons };
