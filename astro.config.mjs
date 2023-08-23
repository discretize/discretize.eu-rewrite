import { defineConfig } from "astro/config";
import mdxgw2ui from "./src/utils/remark/remark-mdx-gw2ui/index";
import mdxInjectData from "./src/utils/remark/remark-inject-data/index";
import remarkInjectCharacterUi from "./src/utils/remark/remark-inject-character-ui";
import removeEmptyThead from "./src/utils/rehype/rehype-remove-empty-thead";
import remarkSlug from "remark-slug";
import remarkSlugAnchor from "remark-slug-anchor";
import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import image from "@astrojs/image";
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
    plugins: [yaml()],
    // build: {
    //   rollupOptions: {
    //     external: ["@reduxjs/toolkit"],
    //   },
    // },
  },

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
        [remarkSlugAnchor, { color: "#0cc" }],
      ],
      rehypePlugins: [removeEmptyThead],
      gfm: true,
      extendMarkdownConfig: {},
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
      cacheDir: ".cache",
    }),
    prefetch(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
  ],
});
