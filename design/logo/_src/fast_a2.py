"""fast_a2.py — final A calibration: width + tracking + signal point."""
import os

from brandlib import CAP, fmt, glyph_w, layout, archivo

HERE = os.path.dirname(os.path.abspath(__file__))
CREAM, SIG = "#F2EDE2", "#FF4B1F"


def build(wght, wdth, gaps, dot=15.0, dot_gap=15.0):
    g = archivo(wght, wdth)
    out, total = layout("RAIL", g, gaps)
    base = list(out)
    acc = []
    if dot:
        acc.append((total + dot_gap, f"M0 0h{fmt(dot)}v{fmt(dot)}h{fmt(-dot)}Z", dot, CAP - dot))
        total = total + dot_gap + dot
    return base, acc, total


def svg(base, acc, total, hpx, fill=CREAM):
    body = f'<g fill="{fill}">' + "".join(
        f'<path transform="translate({fmt(x)} 0)" d="{d}"/>' for x, d, w in base) + "</g>"
    body += f'<g fill="{SIG}">' + "".join(
        f'<path transform="translate({fmt(x)} {fmt(y)})" d="{d}"/>' for x, d, w, y in acc) + "</g>"
    w = hpx * total / CAP
    return (f'<div class="art" style="height:{hpx}px;width:{w:.1f}px">'
            f'<svg viewBox="0 0 {fmt(total)} {fmt(CAP)}" width="100%" height="100%">{body}</svg></div>')


CANDS = [
    ("600/100 gap12", dict(wght=600, wdth=100, gaps=(12, 10, 10, 0))),
    ("600/105 gap12", dict(wght=600, wdth=105, gaps=(12, 10, 10, 0))),
    ("600/110 gap12", dict(wght=600, wdth=110, gaps=(12, 10, 10, 0))),
    ("600/125 gap12", dict(wght=600, wdth=125, gaps=(12, 10, 10, 0))),
    ("550/110 gap13", dict(wght=550, wdth=110, gaps=(13, 11, 11, 0))),
    ("600/110 gap9", dict(wght=600, wdth=110, gaps=(9, 8, 8, 0))),
    ("600/110 nodot", dict(wght=600, wdth=110, gaps=(12, 10, 10, 0), dot=0)),
    ("600/110 gap12 dot18", dict(wght=600, wdth=110, gaps=(12, 10, 10, 0), dot=18, dot_gap=16)),
]

rows = []
for name, kw in CANDS:
    b, a, t = build(**kw)
    rows.append(f'<div class="vrow"><span class="vlab">{name}</span>'
                + svg(b, a, t, 22) + svg(b, a, t, 36) + svg(b, a, t, 70) + "</div>")

detail = []
for name, kw in CANDS[:4]:
    b, a, t = build(**kw)
    detail.append(f'<div class="cell"><div class="lab">{name}</div>{svg(b, a, t, 104)}</div>')

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{background:#070908;color:#F2EDE2;font-family:Consolas,monospace;padding:26px 34px}
h1{font-size:10px;letter-spacing:.26em;color:#D9FF5C;font-weight:400;margin-bottom:20px}
.vrow{display:flex;align-items:flex-end;gap:34px;margin-bottom:18px}
.vlab{width:190px;flex:none;font-size:9px;letter-spacing:.1em;color:rgba(242,237,226,.45);text-transform:uppercase}
.hrow{display:flex;gap:26px;align-items:flex-end;margin-top:24px;flex-wrap:wrap}
.lab{font-size:8px;color:rgba(242,237,226,.4);margin-bottom:8px}
.art svg{display:block}
.hdrbar{margin:26px 0 6px;padding:14px 20px;border:1px solid rgba(242,237,226,.12);display:inline-flex;align-items:center;gap:22px;background:#0c110f}
.hdrtxt{font-size:11px;color:rgba(242,237,226,.6);letter-spacing:.12em}
"""
b, a, t = build(600, 110, (12, 10, 10, 0))
bar = ('<div class="hdrbar">' + svg(b, a, t, 22)
       + '<span class="hdrtxt">SEOUL · 2026</span></div>')
html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<h1>A FINAL — width / tracking / signal point · 22 / 36 / 70 px cap</h1>
{''.join(rows)}
<div style="margin-top:26px;font-size:10px;letter-spacing:.2em;color:rgba(242,237,226,.4)">DETAIL · 104PX</div>
<div class="hrow">{''.join(detail)}</div>
<div style="margin-top:26px;font-size:10px;letter-spacing:.2em;color:rgba(242,237,226,.4)">HEADER SCALE CHECK · 22PX</div>
{bar}
</body></html>"""
path = os.path.join(HERE, "fast-a2.html")
with open(path, "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote", path)
