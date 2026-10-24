"""calib.py — typographic calibration pages for the RAIL wordmark."""
import os

from brandlib import (CAP, CREAM, NOIR, SIGNAL, archivo, fmt, group, layout,
                      rail_wordmark, svg_doc)

HERE = os.path.dirname(os.path.abspath(__file__))

PAGES = []


def page(title, body, height=760):
    PAGES.append((title, body, height))


def label(txt):
    return f'<div class="lab">{txt}</div>'


def svg_inline(body, w, h, height_px):
    width_px = height_px * w / h
    return (
        f'<div class="art" style="height:{height_px}px;width:{width_px:.1f}px">'
        f'<svg viewBox="0 0 {fmt(w)} {fmt(h)}" width="100%" height="100%">{body}</svg></div>'
    )


def wm(wght, wdth, gaps, i_mode="solid", i_color="signal-rail", h=100, fill=CREAM, accent=SIGNAL):
    base, acc, W, H = rail_wordmark(wght=wght, wdth=wdth, gaps=gaps, i_mode=i_mode, i_color=i_color)
    body = group(base, fill=fill) + (group(acc, fill=accent) if acc else "")
    return svg_inline(body, W, H, h)


def wm_html(wght, wdth, gaps, i_mode="solid", i_color="signal-rail", h=100, fill=CREAM, accent=SIGNAL):
    base, acc, W, H = rail_wordmark(wght=wght, wdth=wdth, gaps=gaps, i_mode=i_mode, i_color=i_color)
    body = group(base, fill=fill) + (group(acc, fill=accent) if acc else "")
    return svg_inline(body, W, H, h)


# ------------------------------------------------------------------ page 1
rows = []
for wght in (400, 500, 600, 700, 800, 900):
    g = archivo(wght, 100)
    out, total = layout("RAIL", g, (14, 12, 12, 0))
    rows.append(
        f'<div class="vrow"><span class="vlab">wght {wght}</span>{svg_inline(group(out, fill=CREAM), total, CAP, 118)}</div>'
    )
page("A. Archivo · width 100 · weight ladder", "".join(rows), 900)

# ------------------------------------------------------------------ page 2
rows = []
for wght in (500, 600, 700, 800, 900):
    g = archivo(wght, 125)
    out, total = layout("RAIL", g, (14, 12, 12, 0))
    rows.append(
        f'<div class="vrow"><span class="vlab">wght {wght}</span>{svg_inline(group(out, fill=CREAM), total, CAP, 118)}</div>'
    )
page("B. Archivo · width 125 (extended) · weight ladder", "".join(rows), 820)

# ------------------------------------------------------------------ page 3
rows = []
for gaps in ((0, 0, 0, 0), (5, 4, 4, 0), (9, 8, 8, 0), (13, 11, 11, 0), (18, 16, 16, 0)):
    rows.append(
        f'<div class="vrow"><span class="vlab">gap {gaps[0]}/{gaps[1]}</span>{wm(800, 100, gaps, h=100)}</div>'
    )
page("C. Tracking ladder · 800 / 100 · ink gaps in cap=100 units", "".join(rows), 760)

# ------------------------------------------------------------------ page 4
variants = [
    ("solid I", "solid", "signal-rail"),
    ("twin rails · bg gap", "twin", "none"),
    ("twin rails · orange gap", "twin", "signal-core"),
    ("twin rails · orange rail", "twin", "signal-rail"),
    ("I with signal ties", "ties", "signal-rail"),
]
cells = []
for name, mode, color in variants:
    base, acc, W, H = rail_wordmark(wght=800, wdth=100, gaps=(10, 8, 8, 0), i_mode=mode, i_color=color)
    body = group(base, fill=CREAM) + (group(acc, fill=SIGNAL) if acc and color != "none" else "")
    cells.append(f'<div class="cell">{label(name)}{svg_inline(body, W, H, 190)}</div>')
page("D. The I · rail-motif variants (800 / 100)", '<div class="hrow">' + "".join(cells) + "</div>", 400)

# ------------------------------------------------------------------ page 5
rows = []
for cap_px in (14, 16, 18, 22, 28, 40):
    rows.append(
        f'<div class="vrow"><span class="vlab">{cap_px}px</span>{wm(800, 100, (11, 9, 9, 0), "twin", "signal-rail", h=cap_px)}</div>'
    )
page("E. Header sizes · cap px · dark", "".join(rows), 620)

rows = []
for cap_px in (14, 16, 18, 22, 28, 40):
    rows.append(
        f'<div class="vrow lightrow"><span class="vlab">{cap_px}px</span>{wm(800, 100, (11, 9, 9, 0), "twin", "signal-rail", h=cap_px, fill=NOIR)}</div>'
    )
page("F. Header sizes · cap px · cream", "".join(rows), 620)

CSS = """
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0a0b0a;color:#F2EDE2;font-family:"Segoe UI",sans-serif}
  .page{padding:34px 44px 40px;border-bottom:1px dashed rgba(242,237,226,.14)}
  .ptitle{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#D9FF5C;margin-bottom:26px}
  .vrow{display:flex;align-items:center;gap:30px;margin-bottom:18px}
  .vlab{width:120px;flex:none;font-family:Consolas,monospace;font-size:10px;letter-spacing:.12em;
        color:rgba(242,237,226,.4);text-transform:uppercase}
  .lightrow{background:#F2EDE2;padding:12px 18px;color:#070908;margin-left:-18px;width:calc(100% + 36px)}
  .lightrow .vlab{color:rgba(7,9,8,.42)}
  .hrow{display:flex;gap:38px;align-items:flex-end;flex-wrap:wrap}
  .cell{display:flex;flex-direction:column;gap:14px}
  .lab{font-family:Consolas,monospace;font-size:9px;letter-spacing:.14em;color:rgba(242,237,226,.4);text-transform:uppercase}
  .art svg{display:block;overflow:visible}
"""

body = "".join(
    f'<section class="page" id="page{i}"><div class="ptitle">{title}</div>{content}</section>'
    for i, (title, content, _h) in enumerate(PAGES, 1)
)
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>RAIL calib</title>
<style>{CSS}</style></head><body>{body}</body></html>"""

path = os.path.join(HERE, "calib.html")
with open(path, "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote", path, len(html), "pages:", len(PAGES))
