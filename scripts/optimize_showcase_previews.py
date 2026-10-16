"""Build reduced, watermarked WebP previews from the untouched Downloads originals."""

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path.home() / "Downloads" / "01-wallpapers-4k"
PUBLIC = ROOT / "public"
SHOWCASE_DATA = ROOT / "src" / "data" / "showcase-artworks.ts"
ALTERNATES_DATA = ROOT / "src" / "data" / "gallery-alternates.json"
HERO_SOURCES = ROOT / "assets" / "source" / "hero"
HERO_PUBLIC = PUBLIC / "assets" / "hero" / "optimized"


def source_mappings() -> list[tuple[str, str, int]]:
    mappings: list[tuple[str, str, int]] = []
    source_text = SHOWCASE_DATA.read_text(encoding="utf-8")
    for public_src, original in re.findall(
        r'\{ src: "([^\"]+)", alt: "[^\"]+", original: "([^\"]+)"', source_text
    ):
        mappings.append((public_src, original, 1920))

    for artwork in json.loads(ALTERNATES_DATA.read_text(encoding="utf-8")):
        mappings.append((artwork["src"], artwork["original"], 960))

    return mappings


def make_watermark(width: int, height: int) -> Image.Image:
    font_path = Path("C:/Windows/Fonts/arialbd.ttf")
    font_size = max(26, min(width, height) // 24)
    font = ImageFont.truetype(str(font_path), font_size) if font_path.exists() else ImageFont.load_default(size=font_size)
    label = "ARTORA  •  PRÉVIA"
    scratch = Image.new("RGBA", (width * 2, height * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(scratch)
    text_width = int(draw.textlength(label, font=font))
    row_step = font_size * 6
    column_step = text_width + font_size * 6
    stroke_width = max(1, font_size // 36)

    for row, y in enumerate(range(-height, height * 3, row_step)):
        offset = column_step // 2 if row % 2 else 0
        for x in range(-width, width * 3, column_step):
            draw.text(
                (x + offset, y),
                label,
                font=font,
                fill=(255, 255, 255, 88),
                stroke_width=stroke_width,
                stroke_fill=(9, 20, 35, 115),
            )

    rotated = scratch.rotate(28, resample=Image.Resampling.BICUBIC, expand=False)
    left = (rotated.width - width) // 2
    top = (rotated.height - height) // 2
    return rotated.crop((left, top, left + width, top + height))


def build_preview(original: Path, destination: Path, max_side: int, quality: int) -> None:
    with Image.open(original) as source_image:
        image = source_image.convert("RGB")
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        image = Image.alpha_composite(image.convert("RGBA"), make_watermark(image.width, image.height))
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.convert("RGB").save(destination, "WEBP", quality=quality, method=6)
        print(f"{original.name} -> {destination.relative_to(ROOT)} ({image.width}x{image.height})")


def build_hero_preview(original: Path, destination: Path) -> None:
    with Image.open(original) as source_image:
        image = source_image.convert("RGB")
        image.thumbnail((800, 800), Image.Resampling.LANCZOS)
        image = Image.alpha_composite(image.convert("RGBA"), make_watermark(image.width, image.height))
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.convert("RGB").save(destination, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"{original.name} -> {destination.relative_to(ROOT)} ({image.width}x{image.height})")


def main() -> None:
    mappings = source_mappings()
    missing = [filename for _, filename, _ in mappings if not (SOURCE / filename).is_file()]
    if missing:
        raise FileNotFoundError(f"Missing original artwork files in {SOURCE}: {', '.join(missing)}")

    for public_src, filename, max_side in mappings:
        destination = PUBLIC / public_src.lstrip("/")
        build_preview(SOURCE / filename, destination, max_side, 84 if max_side == 1920 else 82)

    hero_sources = sorted(HERO_SOURCES.glob("*.png"), key=lambda path: path.name.casefold())
    if len(hero_sources) != 20:
        raise ValueError(f"Expected 20 hero originals in {HERO_SOURCES}, found {len(hero_sources)}")
    for index, original in enumerate(hero_sources, start=1):
        build_hero_preview(original, HERO_PUBLIC / f"hero-{index:02}.jpg")


if __name__ == "__main__":
    main()
