import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const source = new URL("../public/assets/brand/proposals/artora-concept-a-symbol-dark.svg", import.meta.url);
const destination = new URL("../public/assets/brand/social/artora-profile-a.png", import.meta.url);
const symbol = readFileSync(source).toString("base64");
const html = `<html><body style="margin:0"><div id="stage" style="width:1024px;height:1024px;background:#14243A;display:grid;place-items:center"><img src="data:image/svg+xml;base64,${symbol}" style="width:840px;height:840px" /></div></body></html>`;
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } });
await page.setContent(html);
await page.locator("#stage").screenshot({ path: fileURLToPath(destination) });
await browser.close();
console.log(`Created ${fileURLToPath(destination)} (1024×1024)`);
