#!/usr/bin/env bash
# Generate PWA install icons (any, maskable, monochrome, apple-touch) from wavey-logo.png.
#
# Shapes:
#   - maskable: full-bleed square (OS applies circle/squircle on home screen)
#   - any / apple-touch: squircle background + transparent exterior
#   - monochrome: circular silhouette + transparent exterior
#
# Usage (from repo root):
#   ./scripts/generate-pwa-icons.sh
#
# Requires: Python 3 with Pillow (pip install Pillow)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/static/images/wavey-meta/wavey-logo.png"
OUT="$ROOT/static/images/wavey-meta"
ASSET_OUT="$ROOT/assets/images/wavey-meta"

if [[ ! -f "$SRC" ]]; then
  echo "Source not found: $SRC" >&2
  exit 1
fi

python3 - "$SRC" "$OUT" "$ASSET_OUT" <<'PY'
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

src_path = Path(sys.argv[1])
out_dir = Path(sys.argv[2])
asset_out_dir = Path(sys.argv[3])
out_dir.mkdir(parents=True, exist_ok=True)
asset_out_dir.mkdir(parents=True, exist_ok=True)

BG = (34, 34, 37)  # #222225 — matches manifest background_color
THEME = (98, 196, 255)  # #62c4ff — subtle shape outline

raw = Image.open(src_path).convert("RGBA")


def extract_logo(img: Image.Image, threshold: int = 40) -> Image.Image:
    """Strip the square black canvas from the source so only the hand remains."""
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


logo = extract_logo(raw)
nobg_bbox = logo.getbbox()
if nobg_bbox:
    nobg_path = asset_out_dir / "wavey-logo-nobg.png"
    logo.crop(nobg_bbox).save(nobg_path, optimize=True)
    print(f"wrote {nobg_path}")


def shape_mask(size: int, shape: str) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    if shape == "squircle":
        radius = max(1, int(size * 0.28))
        draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    elif shape == "circle":
        inset = max(0, int(size * 0.04))
        draw.ellipse((inset, inset, size - 1 - inset, size - 1 - inset), fill=255)
    else:
        return Image.new("L", (size, size), 255)
    return mask


def draw_shape_outline(size: int, shape: str, width: int = 2) -> Image.Image:
    """Thin theme-colored border so the platform shape is obvious in previews."""
    outline = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(outline)
    inset = max(1, width // 2)
    if shape == "squircle":
        radius = max(1, int(size * 0.28))
        draw.rounded_rectangle(
            (inset, inset, size - 1 - inset, size - 1 - inset),
            radius=max(1, radius - inset),
            outline=(*THEME, 180),
            width=width,
        )
    elif shape == "circle":
        pad = max(inset, int(size * 0.04))
        draw.ellipse(
            (pad, pad, size - 1 - pad, size - 1 - pad),
            outline=(*THEME, 180),
            width=width,
        )
    return outline


def composite_logo(size: int, scale: float, mask: Image.Image) -> Image.Image:
    target = int(size * scale)
    resized = logo.resize((target, target), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - target) // 2, (size - target) // 2)
    layer.paste(resized, offset, resized)
    layer.putalpha(ImageChops.multiply(layer.getchannel("A"), mask))
    return layer


def fit_in_shape(size: int, scale: float, shape: str, outline: bool = True) -> Image.Image:
    """Background and logo clipped to circle/squircle; exterior stays transparent."""
    mask = shape_mask(size, shape)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    bg = Image.new("RGBA", (size, size), (*BG, 255))
    bg.putalpha(mask)
    canvas = Image.alpha_composite(canvas, bg)
    canvas = Image.alpha_composite(canvas, composite_logo(size, scale, mask))
    if outline:
        canvas = Image.alpha_composite(canvas, draw_shape_outline(size, shape))
    return canvas


def fit_maskable(size: int, scale: float) -> Image.Image:
    """Opaque full-bleed square — required so launchers can apply their own mask."""
    canvas = Image.new("RGBA", (size, size), (*BG, 255))
    canvas = Image.alpha_composite(canvas, composite_logo(size, scale, shape_mask(size, "none")))
    return canvas.convert("RGB")


def make_monochrome(size: int, scale: float) -> Image.Image:
    target = int(size * scale)
    resized = logo.resize((target, target), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - target) // 2, (size - target) // 2)
    layer.paste(resized, offset, resized)

    gray = layer.convert("L")
    alpha = gray.point(lambda p: 255 if p > 30 else 0)
    mono = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    mono.putalpha(alpha)

    mask = shape_mask(size, "circle")
    mono.putalpha(ImageChops.multiply(mono.getchannel("A"), mask))
    return mono


for name, size, scale in [
    ("icon-192-maskable.png", 192, 0.70),
    ("icon-512-maskable.png", 512, 0.70),
]:
    path = out_dir / name
    fit_maskable(size, scale).save(path, optimize=True)
    print(f"wrote {path}")

for name, size, scale, shape in [
    ("icon-192-any.png", 192, 0.72, "circle"),
    ("icon-512-any.png", 512, 0.72, "circle"),
    ("apple-touch-icon.png", 180, 0.72, "squircle"),
]:
    path = out_dir / name
    fit_in_shape(size, scale, shape).save(path, optimize=True)
    print(f"wrote {path}")

for name, size, scale in [
    ("icon-192-monochrome.png", 192, 0.70),
    ("icon-512-monochrome.png", 512, 0.70),
]:
    path = out_dir / name
    make_monochrome(size, scale).save(path, optimize=True)
    print(f"wrote {path}")

for size in (192, 512):
    legacy = out_dir / f"icon-{size}.png"
    src = out_dir / f"icon-{size}-any.png"
    legacy.write_bytes(src.read_bytes())
    print(f"wrote {legacy} (legacy alias)")
PY

echo "Done."
