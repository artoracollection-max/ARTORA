import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import opentype from "opentype.js";

const output = new URL("../public/assets/brand/proposals/", import.meta.url);
mkdirSync(output, { recursive: true });

const colors = {
  navy: "#14243A",
  deep: "#0D1828",
  paper: "#F7F8FA",
  gold: "#C5A45D",
};

const proposals = [
  {
    id: "a",
    title: "A · Moldura A",
    description: "Evolução do símbolo atual: o A geométrico integrado à moldura aberta da Artora.",
    geometry: `<path d="M39 8H8V56H56V25"/><path d="M20 43L32 18L45 43M25 32H39"/>`,
  },
  {
    id: "b",
    title: "B · Horizonte em tela",
    description: "Novo símbolo sem letras: uma tela com sol nascente e pincelada de horizonte.",
    geometry: `<path d="M13 49V20C13 15.6 16.6 12 21 12H43C47.4 12 51 15.6 51 20V49"/><path d="M17 40H47"/><path d="M23 40A9 9 0 0 1 41 40"/><path d="M19 49C27 45.5 37 45.5 45 49"/>`,
  },
];

const themes = [
  { id: "light", background: colors.paper, symbol: colors.navy, name: colors.navy, accent: colors.gold },
  { id: "dark", background: colors.navy, symbol: colors.gold, name: colors.paper, accent: colors.gold },
];

const fontBytes = readFileSync(new URL("../node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff", import.meta.url));
const typeface = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));
const wordmarkPath = (() => {
  const text = "ARTORA";
  const glyphs = [...text].map((character) => typeface.charToGlyph(character));
  const path = new opentype.Path();
  let x = 110;
  glyphs.forEach((glyph, index) => {
    path.extend(glyph.getPath(x, 52, 30));
    const kerning = glyphs[index + 1] ? typeface.getKerningValue(glyph, glyphs[index + 1]) : 0;
    x += ((glyph.advanceWidth ?? 0) + kerning) * 30 / typeface.unitsPerEm + 5;
  });
  return path.toPathData(3);
})();

function symbolSvg(proposal, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" role="img" aria-label="Símbolo Artora ${proposal.id.toUpperCase()}"><g stroke="${color}" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter">${proposal.geometry}</g></svg>`;
}

function lockupSvg(proposal, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 80" fill="none" role="img" aria-label="ARTORA, proposta ${proposal.id.toUpperCase()}"><g transform="translate(8 8) scale(1)" stroke="${theme.symbol}" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter">${proposal.geometry}</g><path d="M88 19V61" stroke="${theme.accent}" stroke-width="1.5"/><path fill="${theme.name}" d="${wordmarkPath}"/></svg>`;
}

const cards = [];
for (const proposal of proposals) {
  for (const theme of themes) {
    const symbol = symbolSvg(proposal, theme.symbol);
    const lockup = lockupSvg(proposal, theme);
    const prefix = `artora-concept-${proposal.id}`;
    const suffix = theme.id;
    writeFileSync(new URL(`${prefix}-symbol-${suffix}.svg`, output), `${symbol}\n`);
    writeFileSync(new URL(`${prefix}-logo-${suffix}.svg`, output), `${lockup}\n`);
    cards.push({ proposal, theme, symbol, lockup, prefix, suffix });
  }
}

const cardMarkup = cards.map(({ proposal, theme, symbol, lockup, prefix, suffix }) => `
  <article class="card ${suffix}" style="--bg:${theme.background};--symbol:${theme.symbol};--name:${theme.name};--accent:${theme.accent}">
    <div class="card-head"><span>${proposal.title}</span><small>${suffix === "light" ? "FUNDO CLARO" : "FUNDO ESCURO"}</small></div>
    <div class="samples">
      <div class="avatar"><img src="data:image/svg+xml,${encodeURIComponent(symbol)}" alt="Símbolo ${proposal.id.toUpperCase()} em avatar" /></div>
      <img class="lockup" src="data:image/svg+xml,${encodeURIComponent(lockup)}" alt="Logotipo Artora ${proposal.id.toUpperCase()}" />
    </div>
    <div class="sizes"><span>24 px ${symbol.replace("viewBox=\"0 0 64 64\"", "width=\"24\" height=\"24\" viewBox=\"0 0 64 64\"")}</span><span>48 px ${symbol.replace("viewBox=\"0 0 64 64\"", "width=\"48\" height=\"48\" viewBox=\"0 0 64 64\"")}</span><span>96 px ${symbol.replace("viewBox=\"0 0 64 64\"", "width=\"96\" height=\"96\" viewBox=\"0 0 64 64\"")}</span></div>
    <small class="note">SVG + PNG · ${prefix}-symbol-${suffix} · ${prefix}-logo-${suffix}</small>
  </article>`).join("");

const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Artora · propostas universais de logo</title><style>
*{box-sizing:border-box}body{margin:0;padding:42px;background:#e9edf2;color:#14243A;font:15px/1.5 "DM Sans",Arial,sans-serif}main{max-width:1180px;margin:auto}header{margin:0 0 28px}h1{font-size:28px;letter-spacing:.06em;margin:0 0 8px}header p{margin:0;color:#526174}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.card{min-width:0;background:var(--bg);border-radius:14px;padding:22px 24px 18px;box-shadow:0 8px 26px #14243a12}.card-head{display:flex;justify-content:space-between;align-items:center;color:var(--name);font-size:15px;font-weight:650}.card-head small,.note{font-size:10px;letter-spacing:.12em;color:var(--name);opacity:.65}.samples{height:180px;display:flex;align-items:center;gap:34px}.avatar{width:112px;height:112px;border:1px solid var(--accent);border-radius:50%;display:grid;place-items:center;flex:0 0 auto}.avatar img{width:77%;height:77%}.lockup{width:min(360px,calc(100% - 150px));height:auto}.sizes{display:flex;align-items:center;justify-content:space-between;border-top:1px solid color-mix(in srgb,var(--name) 16%,transparent);padding-top:12px;gap:10px}.sizes span{display:flex;align-items:center;gap:7px;color:var(--name);font-size:11px}.sizes svg{width:24px;height:24px;overflow:visible}.sizes span:nth-child(2) svg{width:30px;height:30px}.sizes span:nth-child(3) svg{width:38px;height:38px}.note{display:block;margin-top:12px;letter-spacing:.04em}@media(max-width:760px){body{padding:22px}.grid{grid-template-columns:1fr}.samples{gap:20px}.avatar{width:94px;height:94px}.lockup{width:calc(100% - 120px)}}
</style><main><header><h1>ARTORA · LOGOS UNIVERSAIS</h1><p>Duas direções, cada uma aplicada em fundo claro e escuro. O símbolo permanece independente do nome e da língua.</p></header><section class="grid">${cardMarkup}</section></main></html>`;
writeFileSync(new URL("index.html", output), html);

const systemBrowsers = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = systemBrowsers.find((path) => existsSync(path));
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
for (const { proposal, theme, symbol, lockup, prefix, suffix } of cards) {
  await page.setContent(`<html><body style="margin:0"><div id="stage" style="width:1024px;height:1024px;background:${theme.background};display:grid;place-items:center"><img src="data:image/svg+xml,${encodeURIComponent(symbol)}" style="width:768px;height:768px" /></div></body></html>`);
  await page.locator("#stage").screenshot({ path: fileURLToPath(new URL(`${prefix}-symbol-${suffix}.png`, output)) });
  await page.setContent(`<html><body style="margin:0"><div id="stage" style="width:1560px;height:320px;background:${theme.background};display:grid;place-items:center"><img src="data:image/svg+xml,${encodeURIComponent(lockup)}" style="width:1560px;height:320px" /></div></body></html>`);
  await page.locator("#stage").screenshot({ path: fileURLToPath(new URL(`${prefix}-logo-${suffix}.png`, output)) });
}
await browser.close();
console.log(`Created ${cards.length} SVG pairs, 8 PNGs and comparison sheet in ${fileURLToPath(output)}`);
