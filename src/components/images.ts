import warrior from "../assets/images/professions/warrior.png";
import berserker from "../assets/images/professions/berserker.png";
import spellbreaker from "../assets/images/professions/spellbreaker.png";
import bladesworn from "../assets/images/professions/bladesworn.png";
import guardian from "../assets/images/professions/guardian.png";
import dragonhunter from "../assets/images/professions/dragonhunter.png";
import firebrand from "../assets/images/professions/firebrand.png";
import revenant from "../assets/images/professions/revenant.png";
import herald from "../assets/images/professions/herald.png";
import renegade from "../assets/images/professions/renegade.png";
import ranger from "../assets/images/professions/ranger.png";
import druid from "../assets/images/professions/druid.png";
import soulbeast from "../assets/images/professions/soulbeast.png";
import thief from "../assets/images/professions/thief.png";
import daredevil from "../assets/images/professions/daredevil.png";
import deadeye from "../assets/images/professions/deadeye.png";
import engineer from "../assets/images/professions/engineer.png";
import scrapper from "../assets/images/professions/scrapper.png";
import holosmith from "../assets/images/professions/holosmith.png";
import elementalist from "../assets/images/professions/elementalist.png";
import tempest from "../assets/images/professions/tempest.png";
import weaver from "../assets/images/professions/weaver.png";
import mesmer from "../assets/images/professions/mesmer.png";
import chronomancer from "../assets/images/professions/chronomancer.png";
import mirage from "../assets/images/professions/mirage.png";
import necromancer from "../assets/images/professions/necromancer.png";
import reaper from "../assets/images/professions/reaper.png";
import scourge from "../assets/images/professions/scourge.png";
import willbender from "../assets/images/professions/willbender.png";
import vindicator from "../assets/images/professions/vindicator.png";
import mechanist from "../assets/images/professions/mechanist.png";
import untamed from "../assets/images/professions/untamed.png";
import specter from "../assets/images/professions/specter.png";
import catalyst from "../assets/images/professions/catalyst.png";
import virtuoso from "../assets/images/professions/virtuoso.png";
import harbinger from "../assets/images/professions/harbinger.png";
import type { EliteSpecTypes } from "@gw2-ui/data/professions";
import { getImage } from "astro:assets";
import type { ImageOutputFormat } from "astro";

export async function getOptimizedImage(
  specialization: EliteSpecTypes,
  options = {
    width: 100,
    height: 100,
    alt: "Profession",
    format: "webp" as ImageOutputFormat,
  }
) {
  const image = specializationImages[specialization.toLowerCase()];
  const optimzed = await getImage({ src: image, ...options });

  return optimzed;
}

const specializationImages = {
  warrior,
  berserker,
  spellbreaker,
  bladesworn,
  guardian,
  dragonhunter,
  firebrand,
  revenant,
  herald,
  renegade,
  ranger,
  druid,
  soulbeast,
  thief,
  daredevil,
  deadeye,
  engineer,
  scrapper,
  holosmith,
  elementalist,
  tempest,
  weaver,
  mesmer,
  chronomancer,
  mirage,
  necromancer,
  reaper,
  scourge,
  willbender,
  vindicator,
  mechanist,
  untamed,
  specter,
  catalyst,
  virtuoso,
  harbinger,
};

export default specializationImages;
