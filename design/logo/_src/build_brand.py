"""
build_brand.py — RAIL logo system generator.

  python build_brand.py assets     -> design/logo/{A,B,C}/*.svg
  python build_brand.py previews   -> design/logo/_src/preview-{a,b,c}.html
  python build_brand.py favicons   -> design/logo/_src/favicon-{a,b,c}.html

All wordmarks/marks are baked vector (no webfont needed at runtime).
Geometry model: each asset is a list of items
    {"d": path, "role": "base"|"accent"|"tag", "t": optional transform}
laid out in a cap-height-100 coordinate space, plus width/height/pad.
"""
import os
import shutil

from brandlib import CAP, archivo, fmt, glyph_w, layout, plex, poly_path, rect_path

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_DIR = os.path.dirname(HERE)

INK = "#070908"
CREAM_HEX = "#F2EDE2"
SIGNAL_HEX = "#FF4B1F"
TAG_MUTED_LIGHT = "#5F574B"
TAG_MUTED_DARK = "rgba(242,237,226,0.62)"


def item(d, role="base", t=None, rule=None):
    return {"d": d, "role": role, "t": t, "rule": rule}


def place(elements, dx=0.0, role="base", prefix=""):
    """[(x, d, w)] -> items with baked translate transforms."""
    return [item(d, role, f"{prefix}translate({fmt(x + dx)} 0)") for x, d, w in elements]


def geo(items, width, height, pad=(1.5, 1.5, 0, 0)):
    return {"items": items, "width": width, "height": height, "pad": pad}


# =============================================================================
# Direction A — "Signal Rail"  (wordmark first)
# =============================================================================
A = dict(wght=600, wdth=110, gaps=(12, 10, 10, 0), dot=15.0, dot_gap=15.0)


def a_wordmark(with_dot=True):
    g = archivo(A["wght"], A["wdth"])
    out, total = layout("RAIL", g, A["gaps"])
    items = place(out)
    width = total
    if with_dot:
        d = A["dot"]
        items.append(item(rect_path(0, CAP - d, d, d), "accent",
                          f"translate({fmt(total + A['dot_gap'])} 0)"))
        width = total + A["dot_gap"] + d
    return geo(items, width, CAP)


def a_mark():
    g = archivo(A["wght"], A["wdth"])
    r = g["R"]
    w = glyph_w(r)
    dot, gap = 17.0, 9.0
    items = place([(0.0, r["d"], w)])
    items.append(item(rect_path(0, CAP - dot, dot, dot), "accent",
                      f"translate({fmt(w + gap)} 0)"))
    return geo(items, w + gap + dot, CAP, pad=(1.5, 1.5, 0, 0))


# =============================================================================
# Direction B — "Signal R" (mark + wordmark)
# =============================================================================
B_MARK_STROKE = 15.0
B_MARK_PAD = 8.0
B = dict(wght=700, wdth=100, gaps=(14, 12, 12, 0))


def b_mark_geo(with_node=True):
    """Rectilinear R on a 100 grid: square stem, arc bowl, rectangular counter,
    attached diagonal leg, signal node at the foot (orange)."""
    sw = B_MARK_STROKE
    p = B_MARK_PAD
    top, bot = p, 100 - p
    x_left, x_stem_r = p, p + sw
    bowl_right = 80.0
    bowl_bot = 52.0
    r_out = 12.0
    counter_top = top + sw
    counter_bot = bowl_bot - sw
    counter_right = bowl_right - sw

    outer = (
        f"M{fmt(x_left)} {fmt(top)}H{fmt(bowl_right - r_out)}"
        f"A{fmt(r_out)} {fmt(r_out)} 0 0 1 {fmt(bowl_right)} {fmt(top + r_out)}"
        f"V{fmt(bowl_bot - r_out)}"
        f"A{fmt(r_out)} {fmt(r_out)} 0 0 1 {fmt(bowl_right - r_out)} {fmt(bowl_bot)}"
        f"H{fmt(x_stem_r)}V{fmt(bot)}H{fmt(x_left)}Z"
    )
    counter = (
        f"M{fmt(x_stem_r)} {fmt(counter_top)}H{fmt(counter_right)}"
        f"V{fmt(counter_bot)}H{fmt(x_stem_r)}Z"
    )
    # attached leg, ~24deg from vertical, reaching the baseline
    leg = poly_path([(50.0, 52.0), (64.0, 52.0), (82.0, 92.0), (68.0, 92.0)])
    items = [item(outer + counter, "base", rule="evenodd"), item(leg, "base")]
    if with_node:
        items.append(item(rect_path(79.0, 79.0, 13.0, 13.0), "accent"))
    return geo(items, 100.0, 100.0, pad=(0.0, 0.0, 0.0, 0.0))


def b_wordmark_geo():
    g = archivo(B["wght"], B["wdth"])
    out, total = layout("RAIL", g, B["gaps"])
    return geo(place(out), total, CAP, pad=(1.5, 0.0, 0.0, 0.0))


def b_lockup_geo(mark_scale=1.12, gap=26.0, with_node=True):
    mark = b_mark_geo(with_node=with_node)
    word = b_wordmark_geo()
    ink_top = B_MARK_PAD * mark_scale
    ink_bot = (100 - B_MARK_PAD) * mark_scale
    dy = CAP - ink_bot
    items = []
    for it in mark["items"]:
        items.append(item(it["d"], it["role"],
                          f"translate(0 {fmt(dy)}) scale({fmt(mark_scale)})",
                          it.get("rule")))
    dx = mark["width"] * mark_scale + gap
    for it in word["items"]:
        t = it["t"]
        if t and t.startswith("translate("):
            inner = t[len("translate("):-1].strip()
            x = float(inner.split()[0])
            items.append(item(it["d"], it["role"], f"translate({fmt(x + dx)} 0)"))
        else:
            items.append(it)
    return geo(items, dx + word["width"], CAP, pad=(1.5, 0.0, 0.0, 0.0))


# =============================================================================
# Direction C — "Masthead" (editorial)
# =============================================================================
C = dict(wght=600, wdth=125, gaps=(27, 25, 25, 0), bar=10.0, bar_gap=26.0,
         tag_gap=14.0, tag_cap=15.0, tag_track=11.0)


def c_wordmark_geo(with_bar=True):
    g = archivo(C["wght"], C["wdth"])
    out, total = layout("RAIL", g, C["gaps"])
    x_off = C["bar"] + C["bar_gap"] if with_bar else 0.0
    items = place(out, dx=x_off)
    if with_bar:
        items.insert(0, item(rect_path(0, 0, C["bar"], CAP), "accent"))
        total += x_off
    else:
        total = total
    return geo(items, total, CAP)


def c_lockup_geo(with_tag=True):
    base = c_wordmark_geo(with_bar=True)
    if not with_tag:
        return base
    tg = plex("medium")
    t_out, t_total = layout("SEOUL", tg, (C["tag_track"],) * 4)
    scale = C["tag_cap"] / CAP
    tag_y = CAP + C["tag_gap"]
    tag_x = base["width"] - t_total * scale
    items = []
    # bar spans the full masthead height
    items.append(item(rect_path(0, 0, C["bar"], tag_y + C["tag_cap"]), "accent"))
    for it in base["items"]:
        if it["role"] != "accent":
            items.append(it)
    for x, d, w in t_out:
        items.append(item(d, "tag",
                          f"translate({fmt(tag_x + x * scale)} {fmt(tag_y)}) scale({fmt(scale)})"))
    return geo(items, base["width"], tag_y + C["tag_cap"])


def c_mark_geo():
    g = archivo(C["wght"], C["wdth"])
    r = g["R"]
    w = glyph_w(r)
    x_off = C["bar"] + C["bar_gap"]
    items = [item(rect_path(0, 0, C["bar"], CAP), "accent"),
             item(r["d"], "base", f"translate({fmt(x_off)} 0)")]
    return geo(items, x_off + w, CAP, pad=(2.0, 2.0, 0, 0))


# =============================================================================
# svg assembly
# =============================================================================
def svg_geo(g, colors, title="RAIL"):
    """colors: {"base":..., "accent":..., "tag":...}"""
    pt, pb, pl, pr = g["pad"]
    W = g["width"] + pl + pr
    H = g["height"] + pt + pb
    body = f'<g transform="translate({fmt(pl)} {fmt(pt)})">'
    for it in g["items"]:
        fill = colors.get(it["role"]) or colors["base"]
        t = f' transform="{it["t"]}"' if it["t"] else ""
        rule = f' fill-rule="{it["rule"]}"' if it.get("rule") else ""
        body += f'<path{t} d="{it["d"]}" fill="{fill}"{rule}/>'
    body += "</g>"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pl} {-pt} {fmt(W)} {fmt(H)}" '
        f'fill="none" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>'
    )


COLORWAYS = {
    "light": {"base": INK, "accent": SIGNAL_HEX, "tag": TAG_MUTED_LIGHT},
    "inverse": {"base": CREAM_HEX, "accent": SIGNAL_HEX, "tag": TAG_MUTED_DARK},
    "mono": {"base": "currentColor", "accent": "currentColor", "tag": "currentColor"},
}


def direction_assets(name):
    out = {}
    if name == "A":
        wm = a_wordmark()
        plain = a_wordmark(with_dot=False)
        mk = a_mark()
        for key, g in (("wordmark", wm), ("wordmark-plain", plain),
                       ("mark", mk), ("lockup", wm)):
            for cw in ("light", "inverse", "mono"):
                suffix = "" if cw == "light" else "-" + cw
                out[key + suffix] = svg_geo(g, COLORWAYS[cw])
    elif name == "B":
        for key, make_light, make_mono in (
            ("mark", lambda: b_mark_geo(), lambda: b_mark_geo(with_node=False)),
            ("wordmark", b_wordmark_geo, b_wordmark_geo),
            ("lockup", lambda: b_lockup_geo(), lambda: b_lockup_geo(with_node=False)),
        ):
            g_light = make_light()
            out[key] = svg_geo(g_light, COLORWAYS["light"])
            out[key + "-inverse"] = svg_geo(g_light, COLORWAYS["inverse"])
            out[key + "-mono"] = svg_geo(make_mono(), COLORWAYS["mono"])
    elif name == "C":
        word = c_wordmark_geo(with_bar=False)
        compact = c_lockup_geo(with_tag=False)
        mast = c_lockup_geo(with_tag=True)
        for key, g in (("mark", c_mark_geo()), ("wordmark", word),
                       ("lockup", compact), ("lockup-masthead", mast)):
            for cw in ("light", "inverse", "mono"):
                suffix = "" if cw == "light" else "-" + cw
                out[key + suffix] = svg_geo(g, COLORWAYS[cw])
    return out


def build_assets():
    for d in ("A", "B", "C"):
        outdir = os.path.join(LOGO_DIR, d)
        if os.path.isdir(outdir):
            shutil.rmtree(outdir)
        os.makedirs(outdir, exist_ok=True)
        assets = direction_assets(d)
        for fn, svg in assets.items():
            with open(os.path.join(outdir, fn + ".svg"), "w", encoding="utf-8", newline="\n") as fh:
                fh.write(svg + "\n")
        print(f"  {d}: {len(assets)} svg -> design/logo/{d}/")


# =============================================================================
# favicon page
# =============================================================================
def favicon_geo(name):
    g = {"A": a_mark, "B": b_mark_geo, "C": c_mark_geo}[name]()
    inner = 24.0
    scale = min(inner / g["width"], inner / g["height"])
    bw, bh = g["width"] * scale, g["height"] * scale
    tx, ty = (32 - bw) / 2, (32 - bh) / 2
    items = []
    for it in g["items"]:
        it = dict(it)
        t = it["t"] or ""
        it["t"] = f"translate({fmt(tx)} {fmt(ty)}) scale({fmt(scale)}) {t}"
        items.append(it)
    return geo(items, 32.0, 32.0, pad=(0.0, 0.0, 0.0, 0.0))


def favicon_svg(name, tile=INK, fill=CREAM_HEX, accent=SIGNAL_HEX, rx=7.0):
    g = favicon_geo(name)
    body = f'<rect width="32" height="32" rx="{fmt(rx)}" fill="{tile}"/>'
    for it in g["items"]:
        fill_c = accent if it["role"] == "accent" else fill
        rule = f' fill-rule="{it["rule"]}"' if it.get("rule") else ""
        body += f'<path transform="{it["t"]}" d="{it["d"]}" fill="{fill_c}"{rule}/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">'
            f'<title>RAIL</title>{body}</svg>')


def build_favicons():
    for d in ("A", "B", "C"):
        svg = favicon_svg(d)
        html = (
            '<!doctype html><html><head><meta charset="utf-8">'
            '<style>html,body{margin:0;padding:0;background:transparent}'
            '#fav{width:32px;height:32px}#fav svg{display:block;width:32px;height:32px}</style>'
            f'</head><body><div id="fav">{svg}</div></body></html>'
        )
        with open(os.path.join(HERE, f"favicon-{d.lower()}.html"), "w", encoding="utf-8") as fh:
            fh.write(html)
    print("  favicon pages written")


if __name__ == "__main__":
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else "assets"
    if cmd == "assets":
        print("building svg assets")
        build_assets()
    elif cmd == "favicons":
        build_favicons()
    else:
        print("usage: build_brand.py [assets|favicons|previews]")
