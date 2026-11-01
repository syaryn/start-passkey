import { defineConfig } from "astro/config";
import UnoCSS from "@unocss/astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  site: "https://example.com",
  integrations: [UnoCSS({ injectReset: false }), sitemap()],
});
