import { getImage } from "@astrojs/image";

async function onRequestProd({ locals, request }, next) {
  console.log("Searching in " + request.url);
  const response = await next();

  const html = await response.text();

  const regex =
    /https:\/\/render.guildwars2.com\/file\/[A-F0-9]{40}\/\d+\.png/g;
  const matches: string[] = html.match(regex);
  const gw2RenderApi = [...new Set(matches)];
  console.log("Found " + gw2RenderApi.length + " images");
  if (gw2RenderApi.length === 0) {
    return new Response(html, { status: 200, headers: response.headers });
  }

  const fixedImages = await Promise.all(
    gw2RenderApi.map(async (url) => {
      const optimized = await getImage({
        src: url,
        width: 48,
        height: 48,
        format: "webp",
        alt: "",
      });
      return { src: url, optimized: optimized.src };
    })
  );

  let newHtml = html;
  // replace all images with optimized ones
  fixedImages.forEach((image) => {
    newHtml = newHtml.replaceAll(image.src, image.optimized);
  });

  return new Response(newHtml, { status: 200, headers: response.headers });
}

// only apply to production build
let onRequest;
if (process.env.NODE_ENV === "development") {
  onRequest = (_, next) => {
    return next();
  };
} else {
  onRequest = onRequestProd;
}
export { onRequest };
