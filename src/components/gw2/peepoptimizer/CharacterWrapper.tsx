import type { ImageMetadata } from "astro";
import { Character } from "discretize-ui/react-discretize-components/src";
import type { CharacterProps } from "discretize-ui/react-discretize-components/src/character/Character/Character";

export default function CharacterWrapper(
  props: CharacterProps & { imageData: ImageMetadata },
) {
  const { imageData } = props;

  // TODO implement more elaborate <picture> element
  const Image = () => (
    <img
      src={imageData.src}
      width={imageData.width}
      height={imageData.height}
    />
  );

  return (
    <Character {...props} disableSwitch imageElement={imageData && <Image />} />
  );
}
