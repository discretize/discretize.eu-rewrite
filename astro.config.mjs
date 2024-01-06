import { defineConfig } from "astro/config";
import mdxgw2ui from "./src/utils/remark/remark-mdx-gw2ui/index";
import mdxInjectData from "./src/utils/remark/remark-inject-data/index";
import remarkInjectCharacterUi from "./src/utils/remark/remark-inject-character-ui";
import removeEmptyThead from "./src/utils/rehype/rehype-remove-empty-thead";
import remarkSlug from "remark-slug";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import fontaine from "astro-fontaine";

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
      rollupOptions: {
        onwarn: (warning, warn) => {
          if (
            warning.code === "PLUGIN_WARNING" &&
            warning.plugin === "vite:reporter"
          ) {
            // dont warn about dynamic and static imports
            return;
          } else if (
            warning.code === "PLUGIN_WARNING" &&
            warning.plugin === "vite:resolve"
          ) {
            // dont warn about  'Module "events" has been externalized for browser compatibility, imported by "/home/alex/repos/discretize.eu-rewrite/node_modules/sharp/lib/utility.js". See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.',
            return;
          }
          warn(warning);
        },
      },
      assetsInlineLimit: 0,
    },
    plugins: [yaml()],
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
    fontaine({
      fonts: [{ family: "Raleway", fallbacks: ["Georgia", "sans-serif"] }],
    }),
  ],
});
