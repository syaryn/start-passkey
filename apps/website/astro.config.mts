import { defineConfig } from "astro/config";
import UnoCSS from "@unocss/astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  server: {
    port: 4321,
  },
  vite: {
    server: {
      strictPort: true,
    },
    preview: {
      strictPort: true,
    },
  },
  build: {
    format: "directory",
  },
  site: "https://example.com",
  integrations: [UnoCSS({ injectReset: false }), sitemap()],
});
