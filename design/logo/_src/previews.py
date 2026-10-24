"""previews.py — builds the three RAIL direction preview sheets (HTML)."""
import os

from build_brand import (CREAM_HEX, INK, SIGNAL_HEX, a_mark, a_wordmark,
                         b_lockup_geo, b_mark_geo, b_wordmark_geo,
                         c_lockup_geo, c_mark_geo, c_wordmark_geo,
                         favicon_svg, svg_geo)

HERE = os.path.dirname(os.path.abspath(__file__))
ACID = "#D9FF5C"

DIRS = {
    "A": dict(
        letter="A",
        name="SIGNAL RAIL",
        sub="Wordmark-first",
        blurb="타입만으로 완결되는 워드마크. 600 웨이트에 타이트한 트래킹, 마지막의 오렌지 스퀘어가 ‘레일 위의 신호’입니다.",
        specs=["Archivo 600 · wdth 110", "tracking −0.018em", "signal point 15u", "no sublabel / no mark"],
        header=a_wordmark,
        hero=a_wordmark,
        rows=[("LOCKUP", a_wordmark),
              ("WORDMARK", lambda: a_wordmark(with_dot=False)),
              ("MARK", a_mark)],
        filelist="wordmark.svg · mark.svg · lockup.svg · + inverse / mono",
    ),
    "B": dict(
        letter="B",
        name="SIGNAL R",
        sub="Mark + wordmark",
        blurb="사각 그리드로 그린 R. 발치의 오렌지 시그널 노드가 ‘레일 스위치’가 되고, 16px에서도 R로 남습니다.",
        specs=["custom R (rectilinear)", "signal node at the foot", "mark 16 to infinity", "wordmark Archivo 700"],
        header=b_lockup_geo,
        hero=b_lockup_geo,
        rows=[("LOCKUP", b_lockup_geo), ("WORDMARK", b_wordmark_geo), ("MARK", b_mark_geo)],
        filelist="mark.svg · wordmark.svg · lockup.svg · + inverse / mono",
    ),
    "C": dict(
        letter="C",
        name="MASTHEAD",
        sub="Editorial hybrid",
        blurb="확장형 그로테스크 + 시그널 바 + SEOUL 모노 태그. 가장 조용하고 편집적인 방향.",
        specs=["Archivo 600 · wdth 125", "tracking +0.02em", "signal bar 10u", "SEOUL mono tag"],
        header=lambda: c_lockup_geo(with_tag=False),
        hero=c_lockup_geo,
        rows=[("LOCKUP", lambda: c_lockup_geo(with_tag=False)),
              ("WORDMARK", lambda: c_wordmark_geo(with_bar=False)),
              ("MARK", c_mark_geo)],
        filelist="lockup-masthead.svg · wordmark.svg · mark.svg · + inverse / mono",
    ),
}

DARK = {"base": CREAM_HEX, "accent": SIGNAL_HEX, "tag": "rgba(242,237,226,0.62)"}
LIGHT = {"base": INK, "accent": SIGNAL_HEX, "tag": "#5F574B"}
MONO_D = {"base": CREAM_HEX, "accent": CREAM_HEX, "tag": CREAM_HEX}


def svg_px(g, colors, cap_px, cls=""):
    pt, pb, pl, pr = g["pad"]
    s = cap_px / g["height"]
    W = (g["width"] + pl + pr) * s
    H = (g["height"] + pt + pb) * s
    svg = svg_geo(g, colors)
    return (f'<div class="art {cls}" style="width:{W:.2f}px;height:{H:.2f}px">{svg}</div>'), W, H


def section(label, inner, cls=""):
    return f'<section class="sec {cls}"><div class="sec-lab">{label}</div>{inner}</section>'


def shrink_row(label, g, sizes=(48, 32, 24, 16)):
    cells = []
    for cap in sizes:
        art, W, H = svg_px(g, DARK, cap)
        cells.append(
            f'<div class="cell"><div class="cell-art" style="height:{max(H, 22):.0f}px">'
            f'<div class="art-b" style="width:{W:.2f}px;height:{H:.2f}px">{art}</div></div>'
            f'<div class="cell-lab">{cap}</div></div>'
        )
    return f'<div class="vrow"><div class="vrow-lab">{label}</div><div class="hrow">{"".join(cells)}</div></div>'


def tab_strip(dark=True, fav="a"):
    if dark:
        bg, tab, text, dim, line = "#070908", "#131A16", "#F2EDE2", "rgba(242,237,226,.42)", "rgba(242,237,226,.1)"
    else:
        bg, tab, text, dim, line = "#D8D2C4", "#F2EDE2", "#070908", "rgba(7,9,8,.45)", "rgba(7,9,8,.12)"
    img = f"favicon-{fav}-32.png"
    return f"""
    <div class="tabs" style="background:{bg};border-color:{line}">
      <div class="tab active" style="background:{tab};border-color:{line}">
        <img src="{img}" width="16" height="16" alt="">
        <span style="color:{text}">RAIL — RWA Credit Rail</span>
        <b style="color:{dim}">&#10005;</b>
      </div>
      <div class="tab" style="border-color:{line}"><span style="color:{dim}">Market · RAIL</span></div>
      <div class="tab" style="border-color:{line}"><span style="color:{dim}">여권 · RAIL</span></div>
    </div>"""


def favicon_stage(letter):
    fav = favicon_svg(letter)
    sizes = []
    for px in (16, 32, 48):
        sizes.append(
            f'<div class="cell"><div class="cell-art" style="height:{px}px">'
            f'<div class="art" style="width:{px}px;height:{px}px">{fav}</div></div>'
            f'<div class="cell-lab">{px}</div></div>'
        )
    zoom = (
        f'<div class="zoom"><img src="favicon-{letter.lower()}-32.png" alt="">'
        f'<div class="cell-lab">32px @4× (pixel view)</div></div>'
    )
    return f"""
    <div class="favwrap">
      <div class="tabcol">{tab_strip(True, letter.lower())}{tab_strip(False, letter.lower())}</div>
      <div class="favextras">
        <div class="hrow">{''.join(sizes)}</div>
        {zoom}
      </div>
    </div>"""


def sheet(letter):
    d = DIRS[letter]
    hdr_logo, _, _ = svg_px(d["header"](), DARK, 22)
    cream_logo, _, _ = svg_px(d["hero"](), LIGHT, 84, cls="big")
    rows = "".join(shrink_row(lbl, fn()) for lbl, fn in d["rows"])
    fav = favicon_svg(letter)
    mono_logo, _, _ = svg_px(d["hero"](), MONO_D, 30)
    accent_logo, _, _ = svg_px(d["hero"](), DARK, 30)
    clear = svg_px(d["hero"](), LIGHT, 38)[0]
    fav_min = f'<div class="art" style="width:16px;height:16px">{fav}</div>'

    head = f"""
    <section class="head">
      <div class="head-left">
        <div class="head-kick">RAIL — DESIGN LOGO SYSTEM · NITRO SEOUL 2026</div>
        <div class="head-title">DIRECTION {d['letter']} <span>/</span> {d['name']}</div>
        <div class="head-sub">{d['sub']} — {d['blurb']}</div>
      </div>
      <div class="head-specs">{''.join(f'<div>{s}</div>' for s in d['specs'])}</div>
    </section>"""

    hero = f"""
    <section class="hero">
      <div class="hero-bg"></div>
      <header class="hdr"><div class="hdr-in">
        <div class="left">{hdr_logo}
          <span class="chip"><i class="dot"></i>SEOUL · 2026</span>
        </div>
        <nav><a>문제</a><a>작동 방식</a><a>신용 여권</a><a>시장</a><a>에이전트</a></nav>
        <a class="cta">신용 여권 만들기</a>
      </div></header>
      <div class="hero-copy">
        <div class="kicker"><i class="dot"></i>RWA CREDIT RAIL · SEOUL 2026</div>
        <h1>매출은 있는데,<br>신용이 <em>없습니다.</em></h1>
        <p>RAIL은 수출대금·정산 이력·매출채권을 온체인 증거로 검증해, 담보 없는 기업의 신용 여권을 만듭니다.</p>
        <div class="hero-ctas"><a class="cta lg">한빛전자 3분 심사</a><a class="ghost">RWA 시장 보기</a></div>
      </div>
      <div class="hero-caption">REAL HEADER CONTEXT · HEADER 64PX · WORDMARK CAP 22PX</div>
    </section>
    <div class="sect-label">A — REAL DARK HEADER CONTEXT</div>"""

    cream = f"""
    <section class="cream">
      <div class="cream-in">
        <div class="cream-left">{cream_logo}</div>
        <div class="cream-right">
          <div class="sec-lab">B — CREAM SURFACE / INK + SIGNAL</div>
          <div class="cream-note">크림 밴드에서는 잉크 버전. 오렌지는 단 한 곳, 시그널 포인트에만.</div>
          <div class="chips">
            <span>MIN 16PX CAP</span><span>CLEARSPACE 1C</span><span>NO GRADIENT</span><span>NO SUBLABEL</span>
          </div>
        </div>
      </div>
    </section>"""

    shrink = section("C — 16 / 24 / 32 / 48 PX SHRINK GRID · DARK", rows, "shrink-sec")
    favsec = section("D — FAVICON / TAB / DOCK", favicon_stage(letter), "fav-sec")

    rules = f"""
    <section class="rules">
      <div class="sec-lab">E — TREATMENTS</div>
      <div class="rule-row">
        <div class="rule-cell"><div class="rule-art light">{clear}</div><div class="rule-lab">INK ON CREAM · PRIMARY</div></div>
        <div class="rule-cell"><div class="rule-art dark">{accent_logo}</div><div class="rule-lab">CREAM + SIGNAL ON NOIR</div></div>
        <div class="rule-cell"><div class="rule-art dark">{mono_logo}</div><div class="rule-lab">MONO — SINGLE COLOR</div></div>
        <div class="rule-cell"><div class="rule-art dark small">{fav_min}</div><div class="rule-lab">16PX FAVICON</div></div>
      </div>
      <div class="rule-foot">MARK ORANGE = SIGNAL ONLY · NEVER GRADIENT · NEVER OUTLINE-ONLY · NEVER ADD “CREDIT ENGINE”</div>
    </section>"""

    footer = f"""
    <footer class="foot">
      <span>DIRECTION {d['letter']} — {d['name']}</span>
      <span>{d['filelist']}</span>
      <span>DESIGN/LOGO/{d['letter']}/</span>
    </footer>"""

    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>RAIL — Direction {d['letter']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
{head}{hero}{cream}{shrink}{favsec}{rules}{footer}
</body></html>"""


CSS = """
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --noir:#070908; --noir-2:#0C110F; --noir-3:#131A16; --cream:#F2EDE2;
    --signal:#FF4B1F; --acid:#D9FF5C; --line-dark:rgba(242,237,226,.14); --line-darker:rgba(242,237,226,.08);
    --mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;
    --sans:"Pretendard Variable",Pretendard,"Malgun Gothic","Segoe UI",sans-serif;
  }
  html{-webkit-font-smoothing:antialiased}
  body{width:1240px;background:var(--noir);color:var(--cream);font-family:var(--sans);overflow-x:hidden}
  .art svg{display:block;width:100%;height:100%}
  .art img{display:block}
  .sect-label,.sec-lab{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:rgba(242,237,226,.42)}
  .head{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;
        padding:32px 56px 28px;background:var(--noir-2);border-bottom:1px solid var(--line-dark)}
  .head-kick{font-family:var(--mono);font-size:9px;letter-spacing:.26em;color:var(--acid);margin-bottom:13px}
  .head-title{font-family:var(--mono);font-size:20px;font-weight:600;letter-spacing:.04em;color:var(--cream)}
  .head-title span{color:var(--signal)}
  .head-sub{margin-top:10px;max-width:660px;font-size:12.5px;line-height:1.72;color:rgba(242,237,226,.62);word-break:keep-all}
  .head-specs{display:flex;flex-direction:column;gap:7px;min-width:250px;
              font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,237,226,.45)}
  .head-specs div{border-left:1px solid rgba(255,75,31,.6);padding-left:10px}

  .hero{position:relative;overflow:hidden;padding-bottom:26px}
  .hero-bg{position:absolute;inset:0;background:
     linear-gradient(180deg,rgba(7,9,8,.42) 0%,rgba(7,9,8,.55) 40%,rgba(7,9,8,.88) 82%,#070908 100%),
     url("../../../rail-app/public/art/hero-rail.webp") center 30%/cover no-repeat;}
  .hdr{position:relative;z-index:2;border-bottom:1px solid var(--line-darker);background:rgba(7,9,8,.58);backdrop-filter:blur(18px)}
  .hdr-in{height:64px;max-width:1152px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between}
  .hdr .left{display:flex;align-items:center;gap:16px}
  .chip{display:flex;align-items:center;gap:6px;border-left:1px solid var(--line-dark);
        padding-left:16px;font-family:var(--mono);font-size:9px;letter-spacing:.22em;
        text-transform:uppercase;color:rgba(242,237,226,.4)}
  .dot{width:4px;height:4px;border-radius:50%;background:var(--acid);display:inline-block}
  nav{display:flex;gap:28px}
  nav a{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
        color:rgba(242,237,226,.55);text-decoration:none}
  .cta{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 14px;
       background:var(--signal);color:var(--cream);font-family:var(--sans);font-size:12px;
       font-weight:500;letter-spacing:.01em;text-decoration:none}
  .cta.lg{height:46px;padding:0 22px;font-size:13.5px}
  .ghost{display:inline-flex;align-items:center;height:46px;padding:0 22px;border:1px solid rgba(242,237,226,.35);
         color:var(--cream);font-size:13.5px;text-decoration:none}
  .hero-copy{position:relative;z-index:2;max-width:1152px;margin:0 auto;padding:42px 32px 0}
  .kicker{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;letter-spacing:.28em;color:var(--acid);text-transform:uppercase}
  h1{margin-top:20px;font-size:54px;line-height:1.03;letter-spacing:-.045em;font-weight:800;color:var(--cream)}
  h1 em{font-style:normal;color:var(--signal)}
  .hero-copy p{margin-top:16px;max-width:540px;font-size:14.5px;line-height:1.78;color:rgba(242,237,226,.62);word-break:keep-all}
  .hero-ctas{display:flex;gap:12px;margin-top:24px}
  .hero-caption{position:absolute;right:32px;bottom:12px;z-index:3;font-family:var(--mono);font-size:8px;
                letter-spacing:.22em;color:rgba(242,237,226,.32)}
  .sect-label{padding:14px 56px 0}

  .cream{background:var(--cream);color:var(--noir);padding:42px 56px 44px;border-top:1px solid rgba(7,9,8,.08)}
  .cream-in{display:flex;align-items:center;gap:64px;max-width:1128px;margin:0 auto}
  .cream-left{flex:none}
  .cream .sec-lab{color:rgba(7,9,8,.45)}
  .cream-right{max-width:460px}
  .cream-note{margin-top:14px;font-size:13px;line-height:1.8;color:rgba(7,9,8,.72);word-break:keep-all}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
  .chips span{font-family:var(--mono);font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;
              border:1px solid rgba(7,9,8,.22);padding:6px 8px;color:rgba(7,9,8,.66)}

  .sec{padding:32px 56px 36px;border-top:1px solid var(--line-darker)}
  .vrow{display:flex;align-items:flex-start;gap:34px;margin-bottom:20px}
  .vrow-lab{width:96px;flex:none;font-family:var(--mono);font-size:9px;letter-spacing:.18em;
            color:rgba(242,237,226,.38);text-transform:uppercase;padding-top:4px}
  .hrow{display:flex;align-items:flex-end;gap:30px}
  .cell{display:flex;flex-direction:column;align-items:flex-start;gap:9px}
  .cell-art{display:flex;align-items:flex-end}
  .cell-lab{font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:rgba(242,237,226,.32)}
  .favwrap{display:flex;gap:48px;align-items:flex-start}
  .tabcol{flex:1;max-width:660px;display:flex;flex-direction:column;gap:14px}
  .tabs{display:flex;align-items:flex-end;height:38px;border-radius:9px 9px 0 0;border:1px solid;border-bottom:none;padding:0 8px;overflow:hidden}
  .tab{display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:7px 7px 0 0;
       border:1px solid;border-bottom:none;font-family:var(--sans);font-size:11px;white-space:nowrap;margin-right:4px}
  .tab.active img{width:16px;height:16px;display:block}
  .tab b{font-size:9px;font-weight:400;margin-left:8px}
  .favextras{flex:none;display:flex;flex-direction:column;gap:20px}
  .zoom{display:flex;flex-direction:column;gap:6px}
  .zoom img{width:128px;height:128px;image-rendering:pixelated;border:1px solid var(--line-dark)}
  .rules{padding:32px 56px 38px;border-top:1px solid var(--line-darker)}
  .rule-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:18px}
  .rule-cell{display:flex;flex-direction:column;gap:10px}
  .rule-art{display:flex;align-items:center;justify-content:center;height:104px;padding:0 18px}
  .rule-art.light{background:var(--cream)}
  .rule-art.dark{background:var(--noir-2);border:1px solid var(--line-darker)}
  .rule-lab{font-family:var(--mono);font-size:8px;letter-spacing:.16em;color:rgba(242,237,226,.4);text-transform:uppercase}
  .rule-foot{margin-top:22px;font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;
             color:rgba(242,237,226,.35);text-transform:uppercase}
  .foot{display:flex;justify-content:space-between;gap:20px;padding:20px 56px 26px;border-top:1px solid var(--line-dark);
        font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;color:rgba(242,237,226,.4);text-transform:uppercase}
"""


def build():
    for d in ("A", "B", "C"):
        html = sheet(d)
        path = os.path.join(HERE, f"preview-{d.lower()}.html")
        with open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(html)
        print("  wrote", path, len(html))


if __name__ == "__main__":
    build()
