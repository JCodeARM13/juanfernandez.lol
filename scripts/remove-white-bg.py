#!/usr/bin/env python3
"""Remove near-white background from a JPG and output transparent PNG.

Uses a simple threshold with feathering for soft edges:
- pixels with min(r,g,b) >= 250 => fully transparent
- pixels with min(r,g,b) in [235, 250) => proportional alpha (anti-alias)
- pixels below threshold => fully opaque
"""
import sys
from PIL import Image

WHITE_FULL = 250
WHITE_SOFT = 235


def remove_bg(input_path: str, output_path: str) -> None:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = pixels[x, y]
            mv = min(r, g, b)
            if mv >= WHITE_FULL:
                pixels[x, y] = (r, g, b, 0)
            elif mv >= WHITE_SOFT:
                alpha = int(255 * (WHITE_FULL - mv) / (WHITE_FULL - WHITE_SOFT))
                pixels[x, y] = (r, g, b, alpha)
    img.save(output_path, "PNG", optimize=True)
    print(f"wrote {output_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: remove-white-bg.py <input.jpg> <output.png>", file=sys.stderr)
        sys.exit(1)
    remove_bg(sys.argv[1], sys.argv[2])
