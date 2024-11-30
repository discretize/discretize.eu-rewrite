import type { APIContext } from "astro";
import { getImage } from "astro:assets";

type SearchImage = { url: string; urlFull: string; w: number; h: number };

const extractParams = (urls: string[]): SearchImage[] =>
  urls.reduce<SearchImage[]>((result, url) => {
    const urlWithoutParams = url.split("?")[0];
    const searchParams = new URLSearchParams(
      url.split("?")[1]?.replace(/&amp;/g, "&"),
    );
    const wParam = searchParams.get("w");
    const hParam = searchParams.get("h");
    const w = wParam ? parseInt(wParam) : null;
    const h = hParam ? parseInt(hParam) : null;
    result.push({ url: urlWithoutParams, urlFull: url, w, h });

    return result;
  }, []);

const sortByQueryParamsCount = (a: SearchImage, b: SearchImage) => {
  const aParams = a.urlFull.split("?")[1]?.split("&");
  const bParams = b.urlFull.split("?")[1]?.split("&");

  if (!aParams) {
    return 1;
  }
  if (!bParams) {
    return -1;
  }

  return aParams.length - bParams.length;
};

async function onRequestProd(
  _context: APIContext,
  next: () => Promise<Response>,
): Promise<Response> {
  const response = await next();

  const html = await response.text();

  const regex =
    /https:\/\/render.guildwars2.com\/file\/[A-F0-9]{40}\/\d+\.png(?:\?[wh]=[0-9]*(?:&amp;[wh]=[0-9]*)?)?/g;
  const urls: string[] = html.match(regex);

  if (!urls || urls.length === 0) {
    return new Response(html, { status: 200, headers: response.headers });
  }

  // deduplicate urls and sort by query params count; otherwise the replace later on will not work correctly.
  const gw2RenderApi = extractParams([...new Set(urls)]).sort(
    sortByQueryParamsCount,
  );

  if (gw2RenderApi.length === 0) {
    return new Response(html, { status: 200, headers: response.headers });
  }

  console.log("Found " + gw2RenderApi.length + " images");

  const fixedImages = await Promise.all(
    gw2RenderApi.map(async ({ url, urlFull, w, h }) => {
      const width = w || h || 64;
      const height = h || w || 64;
      const webp = await getImage({
        src: url,
        width,
        height,
        format: "webp",
      });

      const avif = await getImage({
        src: url,
        width,
        height,
        format: "avif",
      });

      return { src: urlFull, images: [avif, webp] };
    }),
  );

  let newHtml = html;
  // replace all images with optimized ones
  // the params remain in the shipped html, but the browser will resolve the urls correctly
  fixedImages.forEach((image) => {
    const imgset = `image-set(${image.images.map(
      (i) => `url('${i.src}') type('image/${i.options.format}')`,
    )})`;

    const defaultImg = image.images[1].src;

    // console.log(image.src + " -> " + defaultImg);

    // leave fallback image in place
    newHtml = newHtml.replaceAll(image.src, defaultImg);
    // insert image-set behind the fallback img
    newHtml = newHtml.replaceAll(
      `${defaultImg}&#x27;)`,
      `${defaultImg}&#x27;);background-image:` + imgset + ``,
    );
  });

  return new Response(newHtml, { status: 200, headers: response.headers });
}

// only apply to production build
let onRequest: (
  context: APIContext,
  next: () => Promise<Response>,
) => Promise<Response>;
if (process.env.NODE_ENV === "development") {
  onRequest = (_, next) => {
    return next();
  };
} else {
  onRequest = onRequestProd;
}
export { onRequest };
