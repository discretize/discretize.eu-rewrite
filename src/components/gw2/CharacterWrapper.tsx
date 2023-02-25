import { Character } from "discretize-ui/react-discretize-components/src";

export default function CharacterWrapper(props) {
  const { imageData } = props;

  const Image = () => (
    <picture>
      {imageData.sources.map((source, index) => (
        <source srcSet={source.srcset} type={source.type} key={index} />
      ))}
      <img
        decoding="async"
        loading="lazy"
        style={{
          objectFit: "contain",
          height: "100%",
          width: "100%",
        }}
        src={imageData.image.src}
        alt={imageData.image.alt}
      />
    </picture>
  );

  return (
    <Character {...props} disableSwitch imageElement={imageData && <Image />} />
  );
}
