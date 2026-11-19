// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * GitHub Pages project site:
 * https://holdenhaile-max.github.io/party-rental-price-check/
 */
const site = "https://holdenhaile-max.github.io";
const base = "/party-rental-price-check";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [sitemap()],
});
