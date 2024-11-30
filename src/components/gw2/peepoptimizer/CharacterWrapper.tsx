import { Character } from "discretize-ui/react-discretize-components/src";
import type { CharacterProps } from "discretize-ui/react-discretize-components/src/character/Character/Character";

export default function CharacterWrapper(
  props: CharacterProps & { imageData: any },
) {
  const { imageData } = props;

  const Image = () => (
    <picture>
      {imageData.sources.map((img) =>
        img.srcset.split(",").map((srcset, index) => {
          const src = srcset.split(" ")[0];
          // dont add a media query for the last source
          // media query should be offset by 1 in the array of imageData.sources[i]
          const width = img.srcset
            .split(",")
            [index + 1]?.split(" ")[1]
            .replace("w", "");

          let media = `(max-width: ${width}px)`;
          if (index === img.srcset.split(",").length - 1) {
            media = null;
          }
          return (
            <source key={index} media={media} srcSet={src} type={img.type} />
          );
        }),
      )}

      <img
        decoding="async"
        loading="lazy"
        src={imageData.image.src}
        alt={imageData.image.alt}
      />
    </picture>
  );

  return (
    <Character {...props} disableSwitch imageElement={imageData && <Image />} />
  );
}
