import { defineConfig } from "astro/config";
import mdxgw2ui from "./src/utils/remark/remark-mdx-gw2ui/index";
import mdxInjectData from "./src/utils/remark/remark-inject-data/index";
import remarkInjectCharacterUi from "./src/utils/remark/remark-inject-character-ui";
import removeEmptyThead from "./src/utils/rehype/rehype-remove-empty-thead";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import image from "@astrojs/image";
import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
import compress from "astro-compress";
import injectTabs from "./src/utils/remark/inject-tabs";

// https://astro.build/config
export default defineConfig({
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

  integrations: [
    react(),
    mdx({
      remarkPlugins: [
        mdxgw2ui,
        mdxInjectData,
        remarkInjectCharacterUi,
        injectTabs,
      ],
      rehypePlugins: [removeEmptyThead],
      gfm: true,
      extendMarkdownConfig: {},
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    prefetch(),
    compress({
      css: false,
      html: false,
      img: false,
      js: true,
      svg: true,
    }),
  ],
});
