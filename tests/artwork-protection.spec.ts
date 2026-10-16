import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { expect, test } from "@playwright/test";

async function listFilesRecursively(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFilesRecursively(path) : [path];
  }));
  return nested.flat();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("artora-language")) localStorage.setItem("artora-language", "pt-BR");
  });
  await page.goto("/");
});

test("detects Portuguese browser language when no preference is saved", async ({ browser }) => {
  const context = await browser.newContext({ locale: "pt-BR" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("tela vazia");
  await expect(page.locator(".plan-price")).toContainText("12,99");
  await expect(page.locator(".plan-reference-price")).toHaveText("R$ 39,90");
  await context.close();
});

test("switches between Portuguese and European English and remembers the choice", async ({ page }) => {
  const englishButton = page.getByRole("button", { name: "Inglês" });
  await englishButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("ARTORA — Art for your screen");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("empty screen");
  await expect(page.getByText("WHAT YOU GET", { exact: true })).toBeVisible();
  await expect(page.locator(".plan-price")).toContainText("€9.99");
  await expect(page.locator(".plan-reference-price")).toHaveText("€29.99");
  await expect(page.locator(".plan-safe")).toContainText("Stripe checkout is being prepared");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /collection of oil-painting wallpapers/);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Brazilian Portuguese" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator(".plan-price")).toContainText("12,99");
});

test("shows one localized offer and keeps Stripe checkout disabled until configured", async ({ page }) => {
  const offer = page.getByTestId("single-offer");
  await expect(page.locator(".plan-card")).toHaveCount(1);
  await expect(offer).toContainText("A COLEÇÃO ARTORA");
  await expect(offer).toContainText("Artes exclusivas para PC e celular");
  await expect(offer).toContainText("Wallpapers para PC em 4K");
  await expect(offer).toContainText("Telas de bloqueio para celular");
  const portugueseBenefits = (await offer.locator("li").allTextContents()).join(" ");
  expect(portugueseBenefits).not.toMatch(/\b(?:300|186|114)\b/);
  await expect(offer.getByRole("button", { name: "Acesso Imediato" })).toBeDisabled();
  await expect(offer.getByText("Prévia visual · confirme os meios disponíveis no checkout")).toBeVisible();
  await expect(offer.getByText("Apple Pay")).toBeVisible();
  await expect(offer.getByText("Google Pay")).toBeVisible();
  await expect(offer.getByText("Visa", { exact: true })).toBeVisible();
  await expect(offer.getByText("Mastercard", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Inglês" }).click();
  await expect(page.locator(".plan-card")).toHaveCount(1);
  await expect(offer).toContainText("THE ARTORA COLLECTION");
  await expect(offer).toContainText("Exclusive artwork for desktop and mobile");
  const englishBenefits = (await offer.locator("li").allTextContents()).join(" ");
  expect(englishBenefits).not.toMatch(/\b(?:300|186|114)\b/);
  await expect(offer.locator(".plan-price")).toContainText("€9.99");
  await expect(offer.locator(".plan-reference-price")).toHaveText("€29.99");
  await expect(offer.getByRole("button", { name: "Get Instant Access" })).toBeDisabled();
});

test("keeps the mobile hero artwork inside the viewport and clear of the copy", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 720 });
    await page.evaluate(() => window.scrollTo(0, 0));

    const layout = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>(".hero-stage")!;
      const copy = document.querySelector<HTMLElement>(".hero-copy")!.getBoundingClientRect();
      const cards = [...document.querySelectorAll<HTMLElement>(".hero-art__item")]
        .filter((card) => getComputedStyle(card).display !== "none")
        .map((card) => card.getBoundingClientRect());
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heroWidth: hero.clientWidth,
        heroHeight: hero.clientHeight,
        copyLeft: copy.left,
        copyRight: copy.right,
        copyBottom: copy.bottom,
      cardTops: cards.filter((card) => card.bottom > 0 && card.top < hero.clientHeight).map((card) => card.top),
      cardLefts: cards.filter((card) => card.bottom > 0 && card.top < hero.clientHeight).map((card) => card.left),
      cardRights: cards.filter((card) => card.bottom > 0 && card.top < hero.clientHeight).map((card) => card.right),
      };
    });

    expect(layout.scrollWidth, `horizontal overflow at ${width}px`).toBe(layout.viewportWidth);
    expect(layout.copyLeft, `hero copy is clipped at ${width}px`).toBeGreaterThanOrEqual(0);
    expect(layout.copyRight, `hero copy is clipped at ${width}px`).toBeLessThanOrEqual(layout.heroWidth);
    expect(layout.copyBottom, `hero copy extends beyond its stage at ${width}px`).toBeLessThanOrEqual(layout.heroHeight);
    if (width <= 520) {
      expect(layout.cardTops).toHaveLength(3);
      expect(Math.min(...layout.cardTops), `art overlaps hero copy at ${width}px`).toBeGreaterThan(layout.copyBottom);
      expect(Math.min(...layout.cardLefts), `art is clipped at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(Math.max(...layout.cardRights), `art is clipped at ${width}px`).toBeLessThanOrEqual(layout.heroWidth);
    }
  }
});

test("keeps the scroll-morph animation active on mobile and desktop", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const firstCard = page.locator(".hero-art__item").first();
    const initialTransform = await firstCard.evaluate((element) => getComputedStyle(element).transform);
    const trackHeight = await page.locator(".hero-track").evaluate((element) => element.clientHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const heroScrollDistance = Math.max(0, trackHeight - viewportHeight);
    await page.evaluate((distance) => window.scrollTo(0, distance * 0.85), heroScrollDistance);
    await expect.poll(() => firstCard.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransform);
    if (width <= 520) {
      await expect(page.locator(".hero-art__item").nth(3)).toBeInViewport();
      await expect(page.locator(".hero-art__item").nth(3)).toHaveCSS("display", "block");
      await page.evaluate((distance) => window.scrollTo(0, distance * 0.99), heroScrollDistance);
      const finalCards = await page.locator(".hero-art__item").evaluateAll((elements) => elements.slice(0, 6).map((element) => {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        return { left, right, top, bottom };
      }));
      expect(finalCards).toHaveLength(6);
      for (const card of finalCards) {
        expect(card.left, `mobile artwork clips left at ${width}px`).toBeGreaterThanOrEqual(0);
        expect(card.right, `mobile artwork clips right at ${width}px`).toBeLessThanOrEqual(width);
        expect(card.top, `mobile artwork clips top at ${width}px`).toBeGreaterThanOrEqual(0);
        expect(card.bottom, `mobile artwork clips bottom at ${width}px`).toBeLessThanOrEqual(844);
      }
      for (let first = 0; first < finalCards.length; first += 1) {
        for (let second = first + 1; second < finalCards.length; second += 1) {
          const a = finalCards[first];
          const b = finalCards[second];
          const overlaps = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          expect(overlaps, `mobile artworks overlap at ${width}px`).toBe(false);
        }
      }
    }
    expect(heroScrollDistance).toBeGreaterThan(0);
  }
});

test("defaults unsupported European browser locales to English", async ({ browser }) => {
  const context = await browser.newContext({ locale: "fr-FR" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await context.close();
});

test("covers artwork when the page loses focus and reveals it on return", async ({ page }) => {
  const overlay = page.getByTestId("artwork-protection-overlay");
  await expect(overlay).not.toHaveClass(/artwork-protection-overlay--active/);
  await expect(overlay).toHaveAttribute("aria-hidden", "true");
  await expect(overlay).toHaveCSS("pointer-events", "none");

  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(overlay).toHaveClass(/artwork-protection-overlay--active/);

  await page.evaluate(() => {
    Object.defineProperty(document, "hasFocus", { configurable: true, value: () => true });
    window.dispatchEvent(new Event("focus"));
  });
  await expect(overlay).not.toHaveClass(/artwork-protection-overlay--active/);
});

test("covers on pointer exit and clears when the pointer returns", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.endsWith("mobile"), "Pointer exit is a desktop mouse behavior.");
  const overlay = page.getByTestId("artwork-protection-overlay");

  await page.evaluate(() => {
    Object.defineProperty(document, "hasFocus", { configurable: true, value: () => true });
    document.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
  });
  await expect(overlay).toHaveClass(/artwork-protection-overlay--active/);
  await page.evaluate(() => document.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" })));
  await expect(overlay).not.toHaveClass(/artwork-protection-overlay--active/);
});

test("covers while the document is hidden and reveals when visible again", async ({ page }) => {
  const overlay = page.getByTestId("artwork-protection-overlay");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(overlay).toHaveClass(/artwork-protection-overlay--active/);

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    Object.defineProperty(document, "hasFocus", { configurable: true, value: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(overlay).not.toHaveClass(/artwork-protection-overlay--active/);
});

test("suppresses context menu and drag only on artwork, not page text", async ({ page }, testInfo) => {
  await page.locator("#amostra").scrollIntoViewIfNeeded();
  const image = page.locator(".gallery-art img").first();
  await expect(image).toBeVisible();

  const protectedEvents = await image.evaluate((element) => {
    const contextMenu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 });
    const dragStart = new DragEvent("dragstart", { bubbles: true, cancelable: true });
    element.dispatchEvent(contextMenu);
    element.dispatchEvent(dragStart);
    return { contextMenuPrevented: contextMenu.defaultPrevented, dragPrevented: dragStart.defaultPrevented };
  });
  expect(protectedEvents).toEqual({ contextMenuPrevented: true, dragPrevented: true });

  const paragraph = page.locator(".sample-note");
  const textMenuPrevented = await paragraph.evaluate((element) => {
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(textMenuPrevented).toBe(false);

  const globalShortcutPrevented = await page.evaluate(() => {
    const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(globalShortcutPrevented).toBe(false);
  if (testInfo.project.name.endsWith("mobile")) await expect(image).toHaveCSS("-webkit-user-drag", "none");
});

test("keeps gallery cards usable by keyboard and touch", async ({ page }, testInfo) => {
  await page.locator("#amostra").scrollIntoViewIfNeeded();
  const card = page.locator(".gallery-art").first();

  if (testInfo.project.name.endsWith("mobile")) {
    await card.tap();
  } else {
    await card.focus();
    await page.keyboard.press("Enter");
  }
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(card).toHaveAttribute("aria-label", /alternativa/);
});

test("serves only reduced WebP artwork files and honors reduced motion", async ({ page }) => {
  await page.locator("#amostra").scrollIntoViewIfNeeded();
  const images = page.locator("img.protected-artwork");
  const sources = await images.evaluateAll((elements) => [...new Set(elements.map((image) => (image as HTMLImageElement).src))]);
  expect(sources.length).toBeGreaterThanOrEqual(24);

  const imageInfo = await page.evaluate(async (srcs) => {
    return Promise.all(srcs.map(async (src) => {
      const response = await fetch(src);
      const bitmap = await createImageBitmap(await response.blob());
      const result = { src, status: response.status, type: response.headers.get("content-type"), width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return result;
    }));
  }, sources);
  expect(imageInfo.every((image) => image.status === 200 && image.type?.includes("image/webp"))).toBe(true);
  expect(imageInfo.every((image) => Math.max(image.width, image.height) <= 1920)).toBe(true);
  expect(imageInfo.every((image) => Math.max(image.width, image.height) <= (image.src.includes("/alternates/") ? 960 : 1920))).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const animationDuration = await page.locator(".art-marquee__track").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration));
  expect(animationDuration).toBeLessThan(0.001);
});

test("production output contains reduced previews, not source originals", async ({ page }) => {
  const directory = resolve(process.cwd(), "dist");
  const files = await listFilesRecursively(directory);
  const showcaseWebps = files.filter((file) => file.toLowerCase().endsWith(".webp"));
  const heroJpegs = files.filter((file) => /hero-\d+\.jpg$/i.test(file));
  const sourceImages = files.filter((file) => /(?:^|[\\/])assets[\\/]source[\\/]/i.test(file) || /painting-\d+\.webp$/i.test(file));

  expect(showcaseWebps).toHaveLength(24);
  expect(showcaseWebps.every((file) => file.includes(`${join("assets", "showcase")}${process.platform === "win32" ? "\\" : "/"}`))).toBe(true);
  expect(heroJpegs).toHaveLength(20);
  expect(sourceImages).toHaveLength(0);

  const heroNames = heroJpegs.map((file) => file.split(/[\\/]/).at(-1)!);
  const heroInfo = await page.evaluate(async (names) => Promise.all(names.map(async (name) => {
    const response = await fetch(`/assets/hero/optimized/${name}`);
    const bitmap = await createImageBitmap(await response.blob());
    const result = { status: response.status, type: response.headers.get("content-type"), width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return result;
  })), heroNames);
  expect(heroInfo.every((image) => image.status === 200 && image.type?.includes("image/jpeg"))).toBe(true);
  expect(heroInfo.every((image) => Math.max(image.width, image.height) <= 800)).toBe(true);
});
