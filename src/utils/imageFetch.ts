export default function imageFetch(images: string[], pathname: string) {
  let headerImage;
  for (const image of images) {
    if (image.includes(pathname)) {
      headerImage = image;
      break;
    }
  }

  if (!headerImage) {
    console.warn(
      "No header image found for this content: " +
        " " +
        pathname +
        " " +
        JSON.stringify(images)
    );
  }
  return headerImage;
}
