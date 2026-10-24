"""
brandlib.py — tiny SVG/typography helper used to design the RAIL identity.

Coordinate system for every wordmark: cap height = 100 units, cap line at
y = 0, baseline at y = 100.  Assets are generated from baked font outlines
(glyphs.json) so nothing depends on a webfont at runtime.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, "glyphs.json"), encoding="utf-8") as _fh:
    GLYPHS = json.load(_fh)

NOIR = "#070908"
CREAM = "#F2EDE2"
SIGNAL = "#FF4B1F"
ACID = "#D9FF5C"

CAP = 100.0


def archivo(wght=800, wdth=100):
    return GLYPHS["archivo"][f"{wght}-{wdth}"]["glyphs"]


def plex(style="medium"):
    return GLYPHS["plex"][style]["glyphs"]


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def glyph_w(g):
    return g["x1"] - g["x0"]


# --------------------------------------------------------------------------
# layout
# --------------------------------------------------------------------------
def layout(letters, glyphs, gaps, custom=None):
    """Place letters left-to-right using ink gaps (cap=100 units).

    custom: {index: (width, d)} overrides a glyph (e.g. the twin-rail I).
    Returns ([(x, d, w)], total_ink_width)
    """
    custom = custom or {}
    pen = 0.0
    out = []
    for i, ch in enumerate(letters):
        if i in custom:
            w, d = custom[i]
        else:
            g = glyphs[ch]
            w, d = glyph_w(g), g["d"]
        out.append((round(pen, 2), d, w))
        pen += w + (gaps[i] if i < len(gaps) else gaps[-1])
    total = pen - (gaps[-1] if gaps else 0)
    return out, total


def svg_doc(width, height, body, title=None, viewbox=None):
    vb = viewbox or f"0 0 {fmt(width)} {fmt(height)}"
    t = f"<title>{title}</title>" if title else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
        f'width="{fmt(width)}" height="{fmt(height)}" fill="none" '
        f'role="img" aria-label="{title or "RAIL"}">{t}{body}</svg>'
    )


def group(elements, fill="currentColor", transform=None):
    """elements: [(x, d, w)] -> one <g> of translated paths."""
    inner = "".join(
        f'<path transform="translate({fmt(x)} 0)" d="{d}"/>' for x, d, w in elements
    )
    tr = f' transform="{transform}"' if transform else ""
    return f'<g{tr} fill="{fill}">{inner}</g>'


def rect_path(x, y, w, h, rx=0.0, ry=None):
    """Path for a rect with optional uniform corner radius (per-corner fixed)."""
    ry = rx if ry is None else ry
    if rx <= 0 and ry <= 0:
        return f"M{fmt(x)} {fmt(y)}h{fmt(w)}v{fmt(h)}h{fmt(-w)}Z"
    r = min(rx, w / 2, h / 2)
    return (
        f"M{fmt(x + r)} {fmt(y)}h{fmt(w - 2 * r)}"
        f"a{fmt(r)} {fmt(r)} 0 0 1 {fmt(r)} {fmt(r)}v{fmt(h - 2 * r)}"
        f"a{fmt(r)} {fmt(r)} 0 0 1 {fmt(-r)} {fmt(r)}h{fmt(-(w - 2 * r))}"
        f"a{fmt(r)} {fmt(r)} 0 0 1 {fmt(-r)} {fmt(-r)}v{fmt(-(h - 2 * r))}"
        f"a{fmt(r)} {fmt(r)} 0 0 1 {fmt(r)} {fmt(-r)}Z"
    )


def poly_path(points, close=True):
    head = f"M{fmt(points[0][0])} {fmt(points[0][1])}"
    rest = "".join(f"L{fmt(x)} {fmt(y)}" for x, y in points[1:])
    return head + rest + ("Z" if close else "")


# --------------------------------------------------------------------------
# the RAIL letters, extended-geometric set built on Archivo outlines
# --------------------------------------------------------------------------
def rail_wordmark(
    wght=800,
    wdth=100,
    gaps=(13, 11, 11, 0),
    i_mode="twin",
    i_gap_ratio=0.30,
    i_color="signal-rail",
    a_flat=0.0,
    r_gap=0.0,
    l_wide=0.0,
):
    """Return (base_paths, accent_paths, width, height).

    base_paths / accent_paths: [(x, d, w)]
    """
    glyphs = archivo(wght, wdth)
    letters = ["R", "A", "I", "L"]
    custom = {}

    # ---- I: the track -----------------------------------------------------
    if "I" in letters and i_mode != "solid":
        gi = glyphs["I"]
        full_w = glyph_w(gi)
        if i_mode == "twin":
            gap = full_w * i_gap_ratio
            rail = (full_w - gap) / 2
            d_left = rect_path(0, 0, rail, CAP)
            d_right = rect_path(rail + gap, 0, rail, CAP)
            custom[2] = (full_w, f"{d_left}{d_right}")
            accent_override = f'<path transform="translate({fmt(rail)} 0)" '
            # accent handled separately: caller gets accent elements below
            i_twin = (full_w, rail, gap, d_left, d_right)
    elif i_mode == "core":
        gi = glyphs["I"]
        full_w = glyph_w(gi)
        core = full_w * 0.30
        rail = (full_w - core) / 2
        d = rect_path(0, 0, rail, CAP) + rect_path(rail + core, 0, rail, CAP)
        custom[2] = (full_w, d)
        i_core = (full_w, rail, core)

    out, total = layout(letters, glyphs, gaps, custom)
    base = [(x, d, w) for x, d, w in out]
    accent = []

    if i_mode == "twin":
        full_w, rail, gap, d_left, d_right = i_twin
        ix = out[2][0]
        base[2] = (ix, d_left + d_right, full_w)
        if i_color == "signal-core":
            accent.append((round(ix + rail, 2), rect_path(0, 0, gap, CAP), gap))
        elif i_color == "signal-rail":
            base[2] = (ix, d_left, rail)
            accent.append((round(ix + rail + gap, 2), d_right, rail))

    if i_mode == "core":
        full_w, rail, core = i_core
        ix = out[2][0]
        base[2] = (ix, rect_path(0, 0, rail, CAP) + rect_path(rail + core, 0, rail, CAP), full_w)
        accent.append((round(ix + rail, 2), rect_path(0, 0, core, CAP), core))

    if i_mode == "ties":
        gi = glyphs["I"]
        full_w = glyph_w(gi)
        ix = out[2][0]
        base[2] = (ix, gi["d"], full_w)
        tie_w = full_w + 9
        tie_h = 3.4
        for cy in (32.0, 68.0):
            accent.append((round(ix - 4.5, 2), rect_path(0, cy - tie_h / 2, tie_w, tie_h), tie_w))

    return base, accent, total, CAP


def wordmark_height(base):
    return CAP
