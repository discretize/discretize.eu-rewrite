import Advanced from "./Advanced.astro";
import Beginner from "./Beginner.astro";
import Card from "./Card.astro";
import CharacterWithAr from "./gw2/CharacterWithAr.astro";
import Grid from "./Grid.astro";
import GridItem from "./GridItem.astro";
import Attribute from "./gw2-ui/Attribute.astro";
import Boon from "./gw2-ui/Boon.astro";
import CommonEffect from "./gw2-ui/CommonEffect.astro";
import Condition from "./gw2-ui/Condition.astro";
import ControlEffect from "./gw2-ui/ControlEffect.astro";
import Item from "./gw2-ui/Item.astro";
import MistlockInstability from "./gw2-ui/MistlockInstability.astro";
import Profession from "./gw2-ui/Profession.astro";
import Skill from "./gw2-ui/Skill.astro";
import Trait from "./gw2-ui/Trait.astro";
import Traits from "./gw2-ui/Traits.astro";
import Character from "./gw2/Character.astro";
import hr from "./hr.astro";
import Information from "./Information.astro";
import TextDivider from "./TextDivider.astro";
import Video from "./Video.astro";
import Warning from "./Warning.astro";

export const components = {
  hr,
  Advanced,
  Attribute,
  Beginner,
  BuildLink: () => undefined,
  Boon,
  Boss: () => undefined,
  Card,
  Character,
  CharacterWithAr,
  Composition: () => undefined,
  Condition,
  Control: ControlEffect,
  Divider: TextDivider,
  Effect: CommonEffect,
  Grid,
  GridItem,
  Information,
  Instability: MistlockInstability,
  Item,
  Label: () => undefined,
  Skill,
  Skills: () => undefined,
  SpecialActionKey: () => undefined,
  Specialization: Profession,
  Tab: () => undefined,
  Tabs: () => undefined,
  Trait,
  Traits,
  Uncategorized: () => undefined,
  Video,
  Warning,
  Weapons: () => undefined,
};
