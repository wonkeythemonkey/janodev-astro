import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

import robotsTxt from "astro-robots-txt";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  integrations: [tailwind({
    applyBaseStyles: false,
  }), react(), sitemap(), robotsTxt(), expressiveCode()],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    esbuild: {
      exclude: ["obsidian"],
    },
  },
  scopedStyleStrategy: "where",
});