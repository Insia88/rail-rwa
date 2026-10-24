"""fast_a.py — quick A-direction calibration: weight / width / I-as-track variants."""
import os

from brandlib import CAP, fmt, glyph_w, layout, archivo, plex

HERE = os.path.dirname(os.path.abspath(__file__))
CREAM, INK, SIGNAL = "#F2EDE2", "#070908", "#FF4B1F"


def items_word(wght, wdth, gaps, i_mode="solid", gap_u=6.0, dot_u=6.0, dot_pos="mid"):
    g = archivo(wght, wdth)
    letters = ["R", "A", "I", "L"]
    custom = {}
    iw = glyph_w(g["I"])
    if i_mode == "solid":
        pass
    else:
        gap = gap_u
        rail = (iw - gap) / 2
        d = (
            f"M0 0h{fmt(rail)}v{fmt(CAP)}h{fmt(-rail)}Z"
            f"M{fmt(rail + gap)} 0h{fmt(rail)}v{fmt(CAP)}h{fmt(-rail)}Z"
        )
        custom[2] = (iw, d)
    out, total = layout(letters, g, gaps, custom)
    base = []
    acc = []
    for i, (x, d, w) in enumerate(out):
        if i == 2 and i_mode != "solid":
            gap = gap_u
            rail = (iw - gap) / 2
            d_left = f"M0 0h{fmt(rail)}v{fmt(CAP)}h{fmt(-rail)}Z"
            d_right = f"M{fmt(rail + gap)} 0h{fmt(rail)}v{fmt(CAP)}h{fmt(-rail)}Z"
            base.append((x, d_left + d_right, iw))
            if dot_u:
                ix = x + (iw - dot_u) / 2
                if dot_pos == "mid":
                    iy = (CAP - dot_u) / 2
                elif dot_pos == "bottom":
                    iy = CAP - dot_u
                elif dot_pos == "top":
                    iy = 0
                acc.append((ix, f"M0 0h{fmt(dot_u)}v{fmt(dot_u)}h{fmt(-dot_u)}Z", dot_u, iy))
        else:
            base.append((x, d, w))
    if i_mode == "post":
        # solid I + orange signal dot above the cap line
        ix = out[2][0] + (iw - dot_u) / 2
        acc.append((ix, f"M0 0h{fmt(dot_u)}v{fmt(dot_u)}h{fmt(-dot_u)}Z", dot_u, -dot_u - 3.0))
    return base, acc, total


def svg(base, acc, total, hpx, fill=CREAM):
    body = f'<g fill="{fill}">' + "".join(
        f'<path transform="translate({fmt(x)} 0)" d="{d}"/>' for x, d, w in base
    ) + "</g>"
    body += f'<g fill="{SIGNAL}">' + "".join(
        f'<path transform="translate({fmt(x)} {fmt(y)})" d="{d}"/>' for x, d, w, y in acc
    ) + "</g>"
    w = hpx * total / CAP
    return (
        f'<div class="art" style="height:{hpx}px;width:{w:.1f}px">'
        f'<svg viewBox="0 0 {fmt(total)} {fmt(CAP)}" width="100%" height="100%">{body}</svg></div>'
    )


VARIANTS = [
    ("600/100 solid", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="solid")),
    ("600/125 solid", dict(wght=600, wdth=125, gaps=(15, 13, 13, 0), i_mode="solid")),
    ("600/100 rails g4 dot4", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="rails", gap_u=4, dot_u=4)),
    ("600/100 rails g6 dot6", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="rails", gap_u=6, dot_u=6)),
    ("600/100 rails g8 dot8", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="rails", gap_u=8, dot_u=8)),
    ("600/100 rails g6 dot baseline", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="rails", gap_u=6, dot_u=6, dot_pos="bottom")),
    ("600/100 solid + dot above", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="post", dot_u=7)),
    ("600/100 rails g3 dot4", dict(wght=600, wdth=100, gaps=(15, 13, 13, 0), i_mode="rails", gap_u=3, dot_u=0)),
]

rows = []
for name, kw in VARIANTS:
    base, acc, total = items_word(**kw)
    rows.append(
        f'<div class="vrow"><span class="vlab">{name}</span>'
        + svg(base, acc, total, 22)
        + svg(base, acc, total, 34)
        + svg(base, acc, total, 64)
        + "</div>"
    )

# detail of the I at large size
detail = []
for name, kw in VARIANTS[2:6]:
    base, acc, total = items_word(**kw)
    detail.append(f'<div class="cell"><div class="lab">{name}</div>{svg(base, acc, total, 110)}</div>')

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{background:#070908;color:#F2EDE2;font-family:Consolas,monospace;padding:28px 34px}
h1{font-size:10px;letter-spacing:.26em;color:#D9FF5C;font-weight:400;margin-bottom:22px}
.vrow{display:flex;align-items:flex-end;gap:30px;margin-bottom:16px}
.vlab{width:230px;flex:none;font-size:9px;letter-spacing:.1em;color:rgba(242,237,226,.45);text-transform:uppercase}
.hrow{display:flex;gap:30px;align-items:flex-end;margin-top:30px}
.lab{font-size:8px;color:rgba(242,237,226,.4);margin-bottom:8px}
.art svg{display:block}
.art{margin-bottom:0}
"""

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<h1>A — 600 weight · tracking · I-as-track variants · 22 / 34 / 64 px cap</h1>
{''.join(rows)}
<div style="margin-top:34px;font-size:10px;letter-spacing:.2em;color:rgba(242,237,226,.4)">I DETAIL · 110PX</div>
<div class="hrow">{''.join(detail)}</div>
</body></html>"""
path = os.path.join(HERE, "fast-a.html")
with open(path, "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote", path)
