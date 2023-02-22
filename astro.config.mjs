import { defineConfig } from "astro/config";
import mdxgw2ui from "./src/utils/remark/remark-mdx-gw2ui/index";
import mdxInjectData from "./src/utils/remark/remark-inject-data/index";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  // vite: {
  //   ssr: {
  //     noExternal: ["@floating-ui/react-dom"],
  //   },
  // },

  integrations: [
    react(),
    mdx({
      remarkPlugins: [mdxgw2ui, mdxInjectData],
      gfm: true,
      extendMarkdownConfig: {},
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
  ],
});
