export default async function imageFetch(pathname: string) {
  // ignore image from frontmatter and force header.jpg
  const images = import.meta.glob(
    `../../../discretize-guides/*/*/images/header.jpg`,
    { import: "default" }
  );
  console.log(images);
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
