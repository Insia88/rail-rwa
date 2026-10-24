"""explore.py — candidate sheets for the three RAIL logo directions."""
import os

from brandlib import (CAP, CREAM, NOIR, SIGNAL, archivo, fmt, group, layout,
                      plex, rail_wordmark, rect_path, svg_doc)

HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = []


def page(title, body, height=900, cls=""):
    PAGES.append((title, body, height, cls))


def lab(txt):
    return f'<div class="lab">{txt}</div>'


def inline(body, w, h, hpx, extra=""):
    wpx = hpx * w / h
    return (
        f'<div class="art" style="height:{hpx}px;width:{wpx:.1f}px;{extra}">'
        f'<svg viewBox="0 0 {fmt(w)} {fmt(h)}" width="100%" height="100%" '
        f'preserveAspectRatio="xMinYMid meet">{body}</svg></div>'
    )


def wm(wght, wdth, gaps, i_mode="solid", i_color="signal-rail", hpx=120,
       fill=CREAM, accent=SIGNAL, track=False):
    base, acc, W, H = rail_wordmark(wght=wght, wdth=wdth, gaps=gaps, i_mode=i_mode, i_color=i_color)
    body = group(base, fill=fill) + (group(acc, fill=accent) if acc else "")
    if track:
        bar_h = 3.6
        body += group([(0.0, rect_path(0, CAP + 12, W * 0.42, bar_h), W * 0.42)], fill=SIGNAL)
    return inline(body, W, CAP + (20 if track else 0), hpx), W


# =========================================================== A · wordmark ===
a_cells = []
for name, wght, wdth, gaps in [
    ("900/125 gap 4", 900, 125, (4, 3, 3, 0)),
    ("900/125 gap 7", 900, 125, (7, 6, 6, 0)),
    ("800/125 gap 7", 800, 125, (7, 6, 6, 0)),
    ("800/125 gap 12", 800, 125, (12, 10, 10, 0)),
    ("700/125 gap 13", 700, 125, (13, 11, 11, 0)),
    ("900/100 gap 4", 900, 100, (4, 3, 3, 0)),
    ("800/100 gap 9", 800, 100, (9, 8, 8, 0)),
]:
    html, _ = wm(wght, wdth, gaps, hpx=112)
    a_cells.append(
        f'<div class="vrow"><span class="vlab">{name}</span>{html}</div>'
    )
page("A1 · wordmark candidates · solid I", "".join(a_cells), 1000)

# slit I variants at display size + header size
slits = []
for slit_ratio in (0.12, 0.18, 0.24, 0.30):
    base, acc, W, H = rail_wordmark(wght=800, wdth=125, gaps=(7, 6, 6, 0),
                                    i_mode="twin", i_color="signal-core", i_gap_ratio=slit_ratio)
    body = group(base, fill=CREAM) + (group(acc, fill=SIGNAL) if acc else "")
    slits.append(f'<div class="cell">{lab(f"I slit {int(slit_ratio*100)}%")}{inline(body, W, H, 120)}</div>')
page("A2 · signal slit in the I (color) · display size", '<div class="hrow">' + "".join(slits) + "</div>", 360)

sizes = []
for i_mode, i_color, nm in [("solid", "signal-rail", "solid I"), ("twin", "signal-core", "slit I (orange)"), ("twin", "none", "slit I (mono)")]:
    row = []
    for hpx in (14, 16, 18, 22, 28, 40):
        base, acc, W, H = rail_wordmark(wght=800, wdth=125, gaps=(7, 6, 6, 0),
                                        i_mode=i_mode, i_color=i_color, i_gap_ratio=0.18)
        body = group(base, fill=CREAM) + (group(acc, fill=SIGNAL) if acc and i_color != "none" else "")
        row.append(f'<div class="art" style="height:{hpx}px;width:{hpx*W/H:.1f}px">'
                   f'<svg viewBox="0 0 {fmt(W)} {fmt(H)}" width="100%" height="100%">{body}</svg></div>')
    sizes.append(f'<div class="vrow"><span class="vlab">{nm}</span>{"".join(row)}</div>')
page("A3 · the I at header sizes · dark", "".join(sizes), 460)

# =============================================================== B · marks ===
MARK_GRID = 24


def mark_svg(inner, hpx, bg=None, W=MARK_GRID, H=MARK_GRID):
    box = f'background:{bg};' if bg else ""
    wpx = hpx * W / H
    return (
        f'<div class="art" style="height:{hpx}px;width:{wpx:.1f}px;{box}">'
        f'<svg viewBox="0 0 {W} {H}" width="100%" height="100%">{inner}</svg></div>'
    )


def monoline_r(stroke=3.6, leg_color=CREAM, dot=False):
    """geometric R, 24 grid, bowl rounded, leg detached."""
    s = stroke
    x0, top, bot = 5.2, 3.4, 20.6
    bowl_r = 3.4
    stem = x0 + s / 2
    right = 17.2
    mid = 12.2
    inner = (
        f'<g fill="none" stroke-width="{s}" stroke-linecap="butt" stroke-linejoin="miter">'
        f'<path stroke="{CREAM}" d="M{fmt(stem)} {fmt(top)}V{fmt(bot)}"/>'
        f'<path stroke="{CREAM}" d="M{fmt(stem)} {fmt(top)}H{fmt(right - bowl_r)}'
        f'A{fmt(bowl_r)} {fmt(bowl_r)} 0 0 1 {fmt(right)} {fmt(top + bowl_r)}'
        f'V{fmt(mid - bowl_r)}A{fmt(bowl_r)} {fmt(bowl_r)} 0 0 1 {fmt(right - bowl_r)} {fmt(mid)}'
        f'H{fmt(stem + s / 2)}"/>'
    )
    if dot:
        inner += (
            f'<path stroke="{leg_color}" d="M{fmt(right - 4.4)} {fmt(mid + 0.4)}L{fmt(right)} {fmt(bot)}"/>'
            f'<rect x="{fmt(right - 1.8)}" y="{fmt(bot - 3.6)}" width="3.6" height="3.6" fill="{SIGNAL}"/>'
        )
    else:
        inner += f'<path stroke="{leg_color}" d="M{fmt(right - 4.6)} {fmt(mid + 0.2)}L{fmt(right + 0.2)} {fmt(bot)}"/>'
    return inner + "</g>"


def stamp_mark(color=CREAM, accent=SIGNAL):
    """passport stamp: heavy rounded square, notched at 45°, signal bar inside."""
    return (
        f'<g><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.6" fill="none" '
        f'stroke="{color}" stroke-width="2.8"/>'
        f'<path d="M13.6 3.4h4.4a2.6 2.6 0 0 1 2.6 2.6v4.4Z" fill="{accent}"/></g>'
    )


def track_mark(color=CREAM, accent=SIGNAL):
    """two rails converging to a vanishing point."""
    return (
        f'<g stroke-width="3.2" stroke-linecap="butt" fill="none">'
        f'<path stroke="{color}" d="M4.4 20.4 12 3.6"/>'
        f'<path stroke="{accent}" d="M19.6 20.4 12 3.6"/>'
        f'<path stroke="{color}" stroke-width="2.6" d="M7.4 14.4h9.2"/></g>'
    )


def split_tile(color=CREAM, accent=SIGNAL):
    """ink tile split by a rail; lower-right half signal."""
    return (
        f'<g><path d="M4 7.2A3.2 3.2 0 0 1 7.2 4h9.6A3.2 3.2 0 0 1 20 7.2v9.6a3.2 3.2 0 0 1-3.2 3.2H7.2A3.2 3.2 0 0 1 4 16.8Z" '
        f'fill="{color}"/>'
        f'<path d="M4 16.8 16.8 4h-9.6A3.2 3.2 0 0 0 4 7.2Z" fill="none"/>'
        f'<path d="M6.4 20.6 20.6 6.4v4.8L11.2 20.6Z" fill="{accent}"/></g>'
    )


def rail_junction(color=CREAM, accent=SIGNAL):
    """R built from rails: two verticals + top tie + leg."""
    s = 3.2
    return (
        f'<g fill="none" stroke-width="{s}" stroke-linecap="butt">'
        f'<path stroke="{color}" d="M5.8 {fmt(3.6)}V{fmt(20.4)}"/>'
        f'<path stroke="{color}" d="M5.8 3.6H15.4A3.4 3.4 0 0 1 18.8 7v3.4a3.4 3.4 0 0 1-3.4 3.4H10"/>'
        f'<path stroke="{accent}" d="M13.2 14.6 19 20.6"/></g>'
    )


def signal_post(color=CREAM, accent=SIGNAL):
    """rail signal: post + light."""
    return (
        f'<g><rect x="4.6" y="4" width="3.4" height="16" fill="{color}"/>'
        f'<rect x="10.2" y="4" width="7.2" height="7.2" rx="1.2" fill="{accent}"/>'
        f'<rect x="10.2" y="13.6" width="7.2" height="6.4" rx="1.2" fill="none" stroke="{color}" stroke-width="2.4"/></g>'
    )


marks = [
    ("M1 monoline R", monoline_r()),
    ("M2 R · signal leg", monoline_r(leg_color=SIGNAL)),
    ("M3 R · signal node", monoline_r(leg_color=CREAM, dot=True)),
    ("M4 stamp", stamp_mark()),
    ("M5 converging rails", track_mark()),
    ("M6 split rail tile", split_tile()),
    ("M7 rail-built R", rail_junction()),
    ("M8 signal post", signal_post()),
]
cells = []
for name, inner in marks:
    cells.append(
        f'<div class="cell">{lab(name)}'
        + '<div class="hrow">'
        + mark_svg(inner, 96) + mark_svg(inner, 32) + mark_svg(inner, 24) + mark_svg(inner, 16)
        + "</div></div>"
    )
page("B1 · mark candidates · 96 / 32 / 24 / 16 px", '<div class="mrow">' + "".join(cells) + "</div>", 460)

# cream versions of the same
cells = []
for name, inner in marks:
    cells.append(
        f'<div class="cell lightcell">{lab(name)}'
        + '<div class="hrow">'
        + mark_svg(inner.replace(CREAM, NOIR).replace(SIGNAL, SIGNAL), 96)
        + mark_svg(inner.replace(CREAM, NOIR), 32)
        + mark_svg(inner.replace(CREAM, NOIR), 24)
        + mark_svg(inner.replace(CREAM, NOIR), 16)
        + "</div></div>"
    )
page("B2 · mark candidates · cream background", '<div class="mrow">' + "".join(cells) + "</div>", 460, "lightpage")

# ================================================================ C · editorial
def c_lockup(wght=600, wdth=125, gaps=(22, 20, 20, 0), bar="before", tag=True, hpx=120,
             fill=CREAM, accent=SIGNAL):
    g = archivo(wght, wdth)
    out, total = layout("RAIL", g, gaps)
    bar_w = 7.0
    pad = 13.0
    tag_h = 10.0
    x_off = pad + bar_w + pad if bar == "before" else 0.0
    W = x_off + total
    H = CAP
    body = f'<g fill="{fill}" transform="translate({fmt(x_off)} 0)">' + "".join(
        f'<path transform="translate({fmt(x)} 0)" d="{d}"/>' for x, d, w in out
    ) + "</g>"
    if bar == "before":
        body += f'<rect x="0" y="0" width="{fmt(bar_w)}" height="{fmt(CAP)}" fill="{accent}"/>'
    elif bar == "after":
        body += f'<rect x="{fmt(W + pad)}" y="0" width="{fmt(bar_w)}" height="{fmt(CAP)}" fill="{accent}"/>'
        W += pad + bar_w
    if tag:
        # tiny SEOUL mono tag, top-right, baseline aligned with cap line
        tg = plex("medium")
        x = x_off + total - 0.0
        t_out, t_total = layout("SEOUL", tg, (16, 14, 14, 14, 0))
        scale = tag_h / CAP
        body += (
            f'<g transform="translate({fmt(x)} -0.5) scale({scale})" fill="{fill}" opacity="0.72">'
            + "".join(f'<path transform="translate({fmt(tx)} 0)" d="{d}"/>' for tx, d, w in t_out)
            + "</g>"
        )
    return body, W, H


c_cells = []
for name, opts in [
    ("C1 bar before", dict(bar="before", tag=False)),
    ("C2 bar before + SEOUL", dict(bar="before", tag=True)),
    ("C3 bar after + SEOUL", dict(bar="after", tag=True)),
    ("C4 wght 500 tracked", dict(bar="before", tag=True, wght=500, gaps=(30, 28, 28, 0))),
    ("C5 no bar + SEOUL", dict(bar="none", tag=True)),
]:
    body, W, H = c_lockup(**opts)
    c_cells.append(f'<div class="vrow"><span class="vlab">{name}</span>{inline(body, W, H, 92)}</div>')
page("C · editorial hybrid candidates", "".join(c_cells), 620)

CSS = """
 *{box-sizing:border-box;margin:0;padding:0}
 body{background:#0a0b0a;color:#F2EDE2;font-family:"Segoe UI",sans-serif}
 .page{padding:30px 44px 36px;border-bottom:1px dashed rgba(242,237,226,.14)}
 .lightpage{background:#F2EDE2;color:#070908}
 .ptitle{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#D9FF5C;margin-bottom:24px}
 .lightpage .ptitle{color:#B03612}
 .vrow{display:flex;align-items:center;gap:26px;margin-bottom:16px}
 .vlab{width:150px;flex:none;font-family:Consolas,monospace;font-size:9px;letter-spacing:.1em;
       color:rgba(242,237,226,.42);text-transform:uppercase}
 .hrow{display:flex;gap:20px;align-items:center}
 .mrow{display:flex;gap:34px;flex-wrap:wrap}
 .cell{display:flex;flex-direction:column;gap:12px}
 .lab{font-family:Consolas,monospace;font-size:9px;letter-spacing:.1em;color:rgba(242,237,226,.42);text-transform:uppercase}
 .lightcell .lab{color:rgba(7,9,8,.44)}
 .lightcell{background:#F2EDE2;padding:10px 14px}
 .art svg{display:block;overflow:visible}
"""
body = "".join(
    f'<section class="page {cls}" id="page{i}"><div class="ptitle">{title}</div>{content}</section>'
    for i, (title, content, _h, cls) in enumerate(PAGES, 1)
)
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>RAIL explore</title>
<style>{CSS}</style></head><body>{body}</body></html>"""
out = os.path.join(HERE, "explore.html")
with open(out, "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote", out, "pages", len(PAGES))
