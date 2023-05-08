export default async function imageFetch(
  pathname: string,
  type: "fractals" | "guides"
) {
  // ignore image from frontmatter and force header.jpg
  const images = import.meta.glob(
    `../../../discretize-guides/*/*/images/header.jpg`,
    { import: "default" }
  );

  let headerImage;
  for (const image of Object.keys(images)) {
    if (image.includes(`/${type}/`) && image.includes(pathname)) {
      headerImage = image;
      break;
    }
  }

  if (!headerImage) {
    throw new Error(
      "No header image found for this fractal " +
        type +
        " " +
        pathname +
        " " +
        JSON.stringify(images)
    );
  }
  return headerImage;
}
