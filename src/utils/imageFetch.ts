export default async function imageFetch(pathname: string) {
  // ignore image from frontmatter and force header.jpg
  const fractalImages = import.meta.glob(
    `../../../discretize-guides/fractals/*/images/header.jpg`,
    { import: "default" }
  );
  const guideImages = import.meta.glob(
    `../../../discretize-guides/guides/*/images/header.jpg`,
    { import: "default" }
  );
  const images = { ...fractalImages, ...guideImages };
  let headerImage;
  for (const image of Object.keys(images)) {
    if (image.includes(pathname)) {
      headerImage = image;
      break;
    }
  }

  if (!headerImage) {
    throw new Error(
      "No header image found for this content: " +
        " " +
        pathname +
        " " +
        JSON.stringify(images)
    );
  }
  return headerImage;
}
