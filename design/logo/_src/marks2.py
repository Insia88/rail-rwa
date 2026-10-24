"""marks2.py — refined B-direction mark candidates (parametric rectilinear R)."""
import os

from brandlib import CREAM, NOIR, SIGNAL, fmt, svg_doc

HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = []


def page(title, body, height=520, cls=""):
    PAGES.append((title, body, height, cls))


def lab(txt):
    return f'<div class="lab">{txt}</div>'


def art(inner, hpx, W=32, H=32):
    wpx = hpx * W / H
    return (
        f'<div class="art" style="height:{hpx}px;width:{wpx:.1f}px">'
        f'<svg viewBox="0 0 {W} {H}" width="100%" height="100%">{inner}</svg></div>'
    )


# ---------------------------------------------------------------- rail R ----
def rail_r(fill=CREAM, accent=None, w=6.0, S=32.0, r=1.2, split_leg=False,
           leg_gap=1.6, taper=0.0, notch=0.0):
    """Rectilinear R on an S x S grid.

    Stem x0..x0+w, top bar, bowl, 26.6deg leg.  accent: "leg" | "slot" | "node".
    Everything sits on a 24-unit cap-height box centered in S.
    """
    pad = 4.0
    x0 = pad
    top = pad
    bot = S - pad
    cap = bot - top  # 24
    # vertical metrics
    stem_r = x0 + w
    bowl_top = top
    bowl_mid = top + cap * 0.22            # inner counter top
    bowl_bot_outer = top + cap * 0.62      # bowl bottom edge
    bowl_right = x0 + cap * 0.72           # bowl outer right
    inner_r = bowl_right - w
    leg_top_a = x0 + w + (cap * 0.30)
    leg_top_b = leg_top_a + w * 1.30
    leg_bot_a = leg_top_a + cap * 0.32
    leg_bot_b = leg_bot_a + w * 1.30
    leg_bot_b = min(leg_bot_b, S - 1.5)

    # outer contour, clockwise
    pts = [
        (x0, top),
        (bowl_right - r, top),
    ]
    segments = []
    segments.append(f"M{fmt(x0)} {fmt(top)}H{fmt(bowl_right - r)}")
    if r > 0:
        segments.append(f"A{fmt(r)} {fmt(r)} 0 0 1 {fmt(bowl_right)} {fmt(top + r)}")
    segments.append(
        f"V{fmt(bowl_bot_outer - r)}"
    )
    if r > 0:
        segments.append(f"A{fmt(r)} {fmt(r)} 0 0 1 {fmt(bowl_right - r)} {fmt(bowl_bot_outer)}")
    segments.append(f"H{fmt(stem_r)}V{fmt(bowl_mid)}H{fmt(inner_r)}V{fmt(bowl_bot_outer - w)}H{fmt(stem_r)}")
    segments.append(f"V{fmt(bot)}H{fmt(x0)}Z")
    d_outer = "".join(segments)

    # counter
    d_counter = (
        f"M{fmt(stem_r)} {fmt(bowl_mid)}H{fmt(inner_r)}V{fmt(bowl_bot_outer - w)}"
        f"H{fmt(stem_r)}Z"
    )
    # leg (parallelogram, steep)
    leg = (
        f"M{fmt(leg_top_a)} {fmt(bowl_bot_outer)}"
        f"L{fmt(leg_top_b)} {fmt(bowl_bot_outer)}"
        f"L{fmt(leg_bot_b)} {fmt(bot)}"
        f"L{fmt(leg_bot_a)} {fmt(bot)}Z"
    )
    base = f'<path d="{d_outer}{d_counter}{leg}" fill-rule="evenodd" fill="{fill}"/>'

    acc = ""
    if accent == "leg":
        # repaint the leg on top in signal colour, with a hairline gap
        acc_leg = (
            f"M{fmt(leg_top_a + leg_gap)} {fmt(bowl_bot_outer + leg_gap)}"
            f"L{fmt(leg_top_b - leg_gap)} {fmt(bowl_bot_outer + leg_gap)}"
            f"L{fmt(leg_bot_b - leg_gap)} {fmt(bot)}"
            f"L{fmt(leg_bot_a + leg_gap * 0.5)} {fmt(bot)}Z"
        )
        base = (
            f'<path d="{d_outer}{d_counter}" fill-rule="evenodd" fill="{fill}"/>'
            f'<path d="{leg}" fill="{fill}"/>'
        )
        acc = f'<path d="{acc_leg}" fill="{SIGNAL}"/>'
    elif accent == "slot":
        acc = (
            f'<rect x="{fmt(stem_r)}" y="{fmt(bowl_mid)}" width="{fmt(inner_r - stem_r)}" '
            f'height="{fmt((bowl_bot_outer - w) - bowl_mid)}" fill="{SIGNAL}"/>'
        )
    elif accent == "node":
        s = w * 0.92
        acc = f'<rect x="{fmt(bot - s - 0.3)}" y="{fmt(bot - s - 0.3)}" width="{fmt(s)}" height="{fmt(s)}" fill="{SIGNAL}"/>'
    return base + acc, leg, d_outer, d_counter


# ------------------------------------------------------------------ sheet ----
R_VARIANTS = [
    ("R mono", rail_r(CREAM)[0]),
    ("R · signal leg", rail_r(CREAM, "leg")[0]),
    ("R · signal slot", rail_r(CREAM, "slot")[0]),
    ("R · signal node", rail_r(CREAM, "node")[0]),
    ("R · sharp r=0", rail_r(CREAM, r=0)[0]),
]
cells = []
for name, inner in R_VARIANTS:
    cells.append(
        f'<div class="cell">{lab(name)}<div class="hrow">'
        + art(inner, 128) + art(inner, 48) + art(inner, 24) + art(inner, 16)
        + "</div></div>"
    )
page("N1 · rail-R variants · 128 / 48 / 24 / 16 px", '<div class="mrow">' + "".join(cells) + "</div>", 420)

# cream sheet
cells = []
for name, inner in R_VARIANTS:
    ci = inner.replace(CREAM, NOIR)
    cells.append(
        f'<div class="cell lightcell">{lab(name)}<div class="hrow">'
        + art(ci, 128) + art(ci, 48) + art(ci, 24) + art(ci, 16)
        + "</div></div>"
    )
page("N2 · rail-R variants · cream", '<div class="mrow">' + "".join(cells) + "</div>", 420, "lightpage")

# --------------------------------------------------------------- chip marks ---
def chip(inner, chip_fill=CREAM, radius=6.0, notch=False, notch_fill=SIGNAL):
    body = (
        f'<rect x="1.5" y="1.5" width="29" height="29" rx="{fmt(radius)}" fill="{chip_fill}"/>'
    )
    if notch:
        # 45-degree clipped top-right corner, signal coloured
        body = (
            f'<path d="M{fmt(7.5)} 1.5H{fmt(26)}L{fmt(30.5)} 6V{fmt(26)}'
            f'A{fmt(4.5)} {fmt(4.5)} 0 0 1 {fmt(26)} {fmt(30.5)}H{fmt(6)}'
            f'A{fmt(4.5)} {fmt(4.5)} 0 0 1 {fmt(1.5)} {fmt(26)}V{fmt(7.5)}'
            f'A{fmt(6)} {fmt(6)} 0 0 1 {fmt(7.5)} 1.5Z" fill="{chip_fill}"/>'
            f'<path d="M{fmt(19)} 1.5H{fmt(26)}L{fmt(30.5)} 6V{fmt(10)}L{fmt(19)} 1.5Z" fill="{notch_fill}"/>'
        )
    return body + inner


r_ink, _, _, _ = rail_r(NOIR)
r_cream, _, _, _ = rail_r(CREAM)
chip_inner = f'<g transform="translate(2.2 2.2) scale(0.865)">{r_ink}</g>'
chip_inner_c = f'<g transform="translate(2.2 2.2) scale(0.865)">{r_cream}</g>'
chips = [
    ("chip · R", chip(chip_inner, CREAM)),
    ("chip · notch", chip(chip_inner, CREAM, notch=True)),
    ("ink chip · R", chip(chip_inner_c, NOIR)),
]
cells = []
for name, inner in chips:
    cells.append(
        f'<div class="cell">{lab(name)}<div class="hrow">'
        + art(inner, 128) + art(inner, 48) + art(inner, 32) + art(inner, 16)
        + "</div></div>"
    )
page("N3 · stamp chip favicon treatments", '<div class="mrow">' + "".join(cells) + "</div>", 360)

# ------------------------------------------------- header lockup with mark ----
from brandlib import archivo, group, layout  # noqa: E402


def lockup(mark_inner, wght=700, wdth=100, gaps=(12, 10, 10, 0), gap_mark=9.0, mark_w=32, mark_scale=0.72,
           fill=CREAM, hpx=24):
    g = archivo(wght, wdth)
    out, total = layout("RAIL", g, gaps)
    mw = mark_w * mark_scale
    x_off = mw + gap_mark
    W = x_off + total
    H = max(32 * mark_scale, 100.0)
    body = f'<g transform="translate(0 {(100 - mw) / 2}) scale({mark_scale})">{mark_inner}</g>'
    body += f'<g transform="translate({fmt(x_off)} 0)" fill="{fill}">' + "".join(
        f'<path transform="translate({fmt(x)} 0)" d="{d}"/>' for x, d, w in out
    ) + "</g>"
    wpx = hpx * W / H
    return (
        f'<div class="art" style="height:{hpx}px;width:{wpx:.1f}px">'
        f'<svg viewBox="0 0 {fmt(W)} {fmt(H)}" width="100%" height="100%">{body}</svg></div>'
    ), W, H


rows = []
for name, mark_inner, kw in [
    ("mono R mark", rail_r(CREAM)[0], dict(wght=700)),
    ("signal-leg R mark", rail_r(CREAM, "leg")[0], dict(wght=700)),
    ("signal-slot R mark", rail_r(CREAM, "slot")[0], dict(wght=700)),
    ("chip mark", chip(chip_inner, CREAM), dict(wght=700, mark_scale=0.82)),
]:
    for cap in (18, 24):
        html, W, H = lockup(mark_inner, hpx=cap, **kw)
        rows.append(f'<div class="vrow"><span class="vlab">{name} · {cap}px cap</span>{html}</div>')
page("N4 · mark + wordmark lockups · dark", "".join(rows), 620)

CSS = """
 *{box-sizing:border-box;margin:0;padding:0}
 body{background:#0a0b0a;color:#F2EDE2;font-family:"Segoe UI",sans-serif}
 .page{padding:30px 44px 36px;border-bottom:1px dashed rgba(242,237,226,.14)}
 .lightpage{background:#F2EDE2;color:#070908}
 .ptitle{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#D9FF5C;margin-bottom:22px}
 .lightpage .ptitle{color:#B03612}
 .vrow{display:flex;align-items:center;gap:22px;margin-bottom:16px}
 .vlab{width:190px;flex:none;font-family:Consolas,monospace;font-size:9px;letter-spacing:.1em;
       color:rgba(242,237,226,.42);text-transform:uppercase}
 .hrow{display:flex;gap:20px;align-items:flex-end}
 .mrow{display:flex;gap:40px;flex-wrap:wrap}
 .cell{display:flex;flex-direction:column;gap:10px}
 .lab{font-family:Consolas,monospace;font-size:9px;letter-spacing:.1em;color:rgba(242,237,226,.42);text-transform:uppercase}
 .lightcell .lab{color:rgba(7,9,8,.44)}
 .lightcell{background:#F2EDE2;padding:10px 14px}
 .art svg{display:block;overflow:visible}
"""
body = "".join(
    f'<section class="page {cls}" id="page{i}"><div class="ptitle">{title}</div>{content}</section>'
    for i, (title, content, _h, cls) in enumerate(PAGES, 1)
)
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>RAIL marks</title>
<style>{CSS}</style></head><body>{body}</body></html>"""
out = os.path.join(HERE, "marks2.html")
with open(out, "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote", out, "pages", len(PAGES))
