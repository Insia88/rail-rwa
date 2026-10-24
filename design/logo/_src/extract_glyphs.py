"""
Extract vector outlines from the OFL fonts used by RAIL, normalized so that
cap height = 100 units and the cap line sits at y = 0 (baseline y = 100).
Output: design/logo/_src/glyphs.json  (consumed by build_brand.py)

Why: the wordmark must survive without webfonts (SVG files, OG images,
favicon, email).  Baking paths keeps the identity fully self-contained.
"""
import json
import os
import sys

PYLIBS = r"C:\Users\User\AppData\Local\Temp\raillogo-pylibs"
if PYLIBS not in sys.path:
    sys.path.insert(0, PYLIBS)

from fontTools.pens.svgPathPen import SVGPathPen  # noqa: E402
from fontTools.pens.transformPen import TransformPen  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "glyphs.json")

# (wght, wdth) instances of Archivo.  wdth 100 = normal, 125 = extended.
ARCHIVO_CONFIGS = [
    (400, 100), (500, 100), (600, 100), (700, 100), (800, 100), (900, 100),
    (400, 125), (500, 125), (600, 125), (700, 125), (800, 125), (900, 125),
    (500, 105), (550, 100), (550, 105), (550, 110), (600, 105), (600, 110), (650, 105), (700, 110),
]
PLEX = [
    ("regular", "IBMPlexMono-Regular.ttf"),
    ("medium", "IBMPlexMono-Medium.ttf"),
    ("semibold", "IBMPlexMono-SemiBold.ttf"),
]


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def glyph_path(font, glyph_name, cap, upm_scale=None):
    """Return (svg path d, ink bbox, advance) in cap-height=100 space."""
    gs = font.getGlyphSet()
    glyf = font["glyf"][glyph_name] if "glyf" in font else None
    if glyf is not None:
        glyf.recalcBounds(font["glyf"])
        xmin = glyf.xMin
        xmax = glyf.xMax
        ymin = glyf.yMin
        ymax = glyf.yMax
    else:  # CFF fallback
        from fontTools.pens.boundsPen import BoundsPen

        bp = BoundsPen(gs)
        gs[glyph_name].draw(bp)
        xmin, ymin, xmax, ymax = bp.bounds

    s = 100.0 / cap
    # x' = s*(x - xmin)  ;  y' = (cap - y) * s
    t = (s, 0, 0, -s, -xmin * s, cap * s)
    pen = SVGPathPen(gs, ntos=fmt)
    gs[glyph_name].draw(TransformPen(pen, t))
    d = pen.getCommands()
    adv = font["hmtx"][glyph_name][0] * s
    return {
        "d": d,
        "x0": 0.0,
        "x1": (xmax - xmin) * s,
        "top": (cap - ymax) * s,
        "bottom": (cap - ymin) * s,
        "adv": adv,
    }


def build_archivo(wght, wdth):
    font = TTFont(os.path.join(FONTS, "Archivo.ttf"))
    inst = instantiateVariableFont(font, {"wght": wght, "wdth": wdth}, inplace=False)
    cap = inst["OS/2"].sCapHeight
    cmap = inst.getBestCmap()
    out = {"wght": wght, "wdth": wdth, "cap": cap, "glyphs": {}}
    for ch in "RAIL SEOUL0123456789":
        if ch == " ":
            out["glyphs"]["space"] = {"adv": inst["hmtx"][cmap[ord(" ")]] [0] * 100.0 / cap}
            continue
        name = cmap[ord(ch)]
        out["glyphs"][ch] = glyph_path(inst, name, cap)
    return out


def build_plex(style, fname):
    font = TTFont(os.path.join(FONTS, fname))
    cap = font["OS/2"].sCapHeight
    cmap = font.getBestCmap()
    out = {"style": style, "cap": cap, "glyphs": {}}
    for ch in "SEOUL":
        out["glyphs"][ch] = glyph_path(font, cmap[ord(ch)], cap)
    return out


def main():
    data = {"archivo": {}, "plex": {}}
    for wght, wdth in ARCHIVO_CONFIGS:
        key = f"{wght}-{wdth}"
        print("archivo", key)
        data["archivo"][key] = build_archivo(wght, wdth)
    for style, fname in PLEX:
        print("plex", style)
        data["plex"][style] = build_plex(style, fname)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
