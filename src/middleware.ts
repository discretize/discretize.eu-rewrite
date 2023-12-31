import { getImage } from "astro:assets";

/**
 * The input array might contain multiple urls with the same href, but different query params.
 * This function reduces the array to only contain one entry per url, with the highest w param.
 *
 * @param urls array of urls to reduce
 * @returns reduced array
 */
const reduceArray = (urls: string[]) =>
  urls.reduce<{ url: string; w: number; h: number }[]>((result, url) => {
    const urlWithoutParams = url.split("?")[0];
    const searchParams = new URLSearchParams(
      url.split("?")[1]?.replace(/&amp;/g, "&")
    );
    const wParam = searchParams.get("w");
    const hParam = searchParams.get("h");
    const w = wParam ? parseInt(wParam) : null; // default value should be large enough for most cases
    const h = hParam ? parseInt(hParam) : null; // default value should be large enough for most cases

    const existingEntry = result.find(
      (entry) => entry.url === urlWithoutParams
    );
    if (existingEntry) {
      if (w && (!existingEntry.w || w > existingEntry.w)) {
        existingEntry.w = w;
      }
      if (h && (!existingEntry.h || h > existingEntry.h)) {
        existingEntry.h = h;
      }
    } else {
      result.push({ url: urlWithoutParams, w, h });
    }

    return result;
  }, []);

async function onRequestProd({ locals, request }, next) {
  const response = await next();

  const html = await response.text();

  const regex =
    /https:\/\/render.guildwars2.com\/file\/[A-F0-9]{40}\/\d+\.png(\?[wh]=[0-9]*(&amp;[wh]=[0-9]*)?)?/g;
  const urls: string[] = html.match(regex);

  if (!urls || urls.length === 0) {
    return new Response(html, { status: 200, headers: response.headers });
  }

  // deduplicate urls and only keep the one with the highest w param
  const gw2RenderApi = reduceArray([...new Set(urls)]);

  if (gw2RenderApi.length === 0) {
    return new Response(html, { status: 200, headers: response.headers });
  }

  console.log("Found " + gw2RenderApi.length + " images");

  const fixedImages = await Promise.all(
    gw2RenderApi.map(async ({ url, w, h }) => {
      const width = w || h || 64;
      const height = h || w || 64;

      const optimized = await getImage({
        src: url,
        width,
        height,
        format: "webp",
        alt: "",
      });
      return { src: url, optimized: optimized.src };
    })
  );

  let newHtml = html;
  // replace all images with optimized ones
  // the params remain in the shipped html, but the browser will resolve the urls correctly
  fixedImages.forEach((image) => {
    // console.log(image.src.href + " -> " + image.optimized);
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
