import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { brand } from "./src/data/brand";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

export default defineConfig({
  plugins: [
    react(), tailwindcss(), tsconfigPaths(),
    {
      name: "artora-brand-metadata",
      transformIndexHtml: (html) => html
        .replaceAll("__BRAND_THEME_COLOR__", escapeHtml(brand.themeColor))
        .replaceAll("__BRAND_DESCRIPTION__", escapeHtml(brand.description))
        .replaceAll("__BRAND_FAVICON__", escapeHtml(brand.faviconSrc))
        .replaceAll("__BRAND_TITLE__", escapeHtml(brand.pageTitle)),
    },
  ],
});
