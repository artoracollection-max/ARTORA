const name = "ARTORA";
const tagline = "Art for your screen";

export const brand = {
  name,
  tagline,
  homeLabel: `${name} — ${tagline}. Home`,
  collectionLabel: `${name} COLLECTION`,
  pageTitle: `${name} — ${tagline}`,
  description: `${name}: an oil-painting wallpaper collection that turns your screens into little galleries.`,
  themeColor: "#14243A",
  symbolSrc: "/assets/brand/artora-symbol.svg",
  faviconSrc: "/assets/brand/artora-favicon.svg",
} as const;

// Shared geometry for the exported SVGs; a frame open at the upper right.
export const brandSymbol = {
  viewBox: "0 0 48 48",
  frame: "M29 5H5V43H43V19",
  monogram: "M14 33L24 13L34 33M18 25H30",
} as const;
