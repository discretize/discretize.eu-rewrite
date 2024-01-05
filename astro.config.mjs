import { defineConfig } from "astro/config";
import mdxgw2ui from "./src/utils/remark/remark-mdx-gw2ui/index";
import mdxInjectData from "./src/utils/remark/remark-inject-data/index";
import remarkInjectCharacterUi from "./src/utils/remark/remark-inject-character-ui";
import removeEmptyThead from "./src/utils/rehype/rehype-remove-empty-thead";
import remarkSlug from "remark-slug";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import { FontaineTransform } from "fontaine";

// https://astro.build/config
import react from "@astrojs/react";

import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";
import injectTabs from "./src/utils/remark/inject-tabs";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  cacheDir: ".cache",
  // vite: {
  //   ssr: {
  //     noExternal: ["@floating-ui/react-dom"],
  //   },
  // },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [
      yaml(),
      FontaineTransform.vite({
        fallbacks: ["Arial"],
        resolvePath: (id) => new URL(`./public${id}`, import.meta.url), // id is the font src value in the CSS
      }),
    ],
    // build: {
    //   rollupOptions: {
    //     external: ["@reduxjs/toolkit"],
    //   },
    // },
  },
  image: { domains: ["render.guildwars2.com"] },

  compressHTML: true,
  integrations: [
    react(),
    mdx({
      remarkPlugins: [
        mdxgw2ui,
        mdxInjectData,
        remarkInjectCharacterUi,
        injectTabs,
        remarkSlug,
      ],
      rehypePlugins: [removeEmptyThead],
      gfm: true,
      extendMarkdownConfig: {},
    }),
    prefetch(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    icon({
      include: {
        mdi: ["*"],
      },
    }),
  ],
});
