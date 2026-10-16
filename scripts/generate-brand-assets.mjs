import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import opentype from "opentype.js";
import { brand, brandSymbol } from "../src/data/brand.ts";

const destination = new URL("../public/assets/brand/", import.meta.url);
mkdirSync(destination, { recursive: true });
const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[character]);
const save = (filename, content) => writeFileSync(new URL(filename, destination), `${content}\n`);
const font = (weight) => {
  const bytes = readFileSync(new URL(`../node_modules/@fontsource/dm-sans/files/dm-sans-latin-${weight}-normal.woff`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
// This Latin wordmark needs direct glyph outlines, not contextual substitutions.
const textPath = (text, typeface, baseline, size, tracking) => {
  const path = new opentype.Path();
  const glyphs = [...text].map((character) => typeface.charToGlyph(character));
  let x = 72;
  glyphs.forEach((glyph, index) => {
    path.extend(glyph.getPath(x, baseline, size));
    const kerning = glyphs[index + 1] ? typeface.getKerningValue(glyph, glyphs[index + 1]) : 0;
    x += ((glyph.advanceWidth ?? 0) + kerning) * size / typeface.unitsPerEm + tracking * size;
  });
  return path;
};
const namePath = textPath(brand.name, font(600), 31, 22.8, 0.16);
const taglinePath = textPath(brand.tagline, font(400), 49, 12, 0.035);
const width = Math.ceil(Math.max(namePath.getBoundingBox().x2, taglinePath.getBoundingBox().x2) + 12);
const symbol = (color) => `<g fill="none" stroke="${color}" stroke-linecap="square" stroke-linejoin="miter"><path d="${brandSymbol.frame}" stroke-width="2.5"/><path d="${brandSymbol.monogram}" stroke-width="3"/></g>`;
const svg = (viewBox, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>${body}</svg>`;

for (const [suffix, mark, name, tagline] of [
  ["", "#C5A45D", "#F7F8FA", "#B8C1CE"],
  ["-navy", "#14243A", "#14243A", "#14243A"],
  ["-white", "#F7F8FA", "#F7F8FA", "#F7F8FA"],
]) {
  save(`artora-symbol${suffix}.svg`, svg(brandSymbol.viewBox, brand.name, symbol(mark)));
  save(`artora-logo${suffix}.svg`, svg(`0 0 ${width} 64`, `${brand.name} — ${brand.tagline}`,
    `<g transform="translate(8 8)">${symbol(mark)}</g><path fill="${name}" d="${namePath.toPathData(3)}"/><path fill="${tagline}" d="${taglinePath.toPathData(3)}"/>`));
}
save("artora-favicon.svg", svg(brandSymbol.viewBox, brand.name,
  `<style>:root{color:#14243A}@media(prefers-color-scheme:dark){:root{color:#C5A45D}}</style>${symbol("currentColor")}`));
copyFileSync(new URL("../node_modules/@fontsource/dm-sans/LICENSE", import.meta.url), new URL("DM-Sans-LICENSE.txt", destination));
console.log("ARTORA: 3 logos, 3 symbols and adaptive favicon generated.");
