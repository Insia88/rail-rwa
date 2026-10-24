#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RAIL v2 — local procedural art generator ("Night Signal").

All imagery is generated locally with numpy + Pillow from fixed seeds.
No external images, no stock, no generative-API calls, no third-party assets:
everything here is original work produced by this script, so it is license-free
for the project.

Usage (run from rail-app/):
    python scripts/art/gen_art.py                 # all raster assets
    python scripts/art/gen_art.py --only hero     # one asset
    python scripts/art/gen_art.py --list

Assets written to public/art/:
    hero-rail.webp       2400x1500  cinematic chrome rail perspective + ignition
    passport-chrome.webp 1600x1200  chrome / metal foil + guilloche engraving
    orange-band.webp     2400x1200  ignition orange gradient mesh + chrome sheen
    chrome-ribbon.webp   2000x1200  liquid chrome ribbon on night
    halftone-grid.webp   1600x1600  rotated halftone dot field (RGBA)
    grain.png             512x512   seamless film grain tile (RGBA)
    agents-scan.webp     1600x1000  scanline / telemetry texture, low contrast

Design notes (why the look holds together):
  * dark assets are built in linear light, tone-mapped with a soft filmic
    rolloff (`1 - exp(-x)`) and finished with grain + triangular dither, so the
    WebP at q84-86 carries no banding across the large gradients;
  * "chrome" is always a reflection ladder (thin horizon line + softbox strip +
    core shadow + warm ignition rim) sampled across a 1-D cross-section, which
    is what makes metal read as metal instead of grey plastic;
  * the hero keeps its left third under ~0.40 peak luminance (measured in the
    console output) so cream type sits on it without an extra scrim.
"""
from __future__ import annotations

import argparse
import os
import sys
import time

import numpy as np
from PIL import Image

# ── paths ────────────────────────────────────────────────────────────────────
HERE = os.path.dirname(os.path.abspath(__file__))
RAIL_APP = os.path.dirname(os.path.dirname(HERE))  # scripts/art -> rail-app
OUT_DIR = os.path.join(RAIL_APP, "public", "art")

# ── palette (DESIGN-V2 §1) ───────────────────────────────────────────────────
C = {
    "ink": "#070908",
    "ink2": "#0C110F",
    "ink3": "#131A16",
    "paper": "#F2EDE2",
    "paper2": "#E7DFCF",
    "signal": "#FF4B1F",
    "signal2": "#FF7B4D",
    "glow": "#FFB39B",
    "acid": "#D9FF5C",
    "acid_dim": "#A8C93F",
    "chrome1": "#6E7A74",
    "chrome2": "#E9EFEA",
    "ember": "#EA4419",   # deeper ignition for band mesh shading
}


# ── small numeric helpers ────────────────────────────────────────────────────
def srgb_arr(hexstr: str) -> np.ndarray:
    h = hexstr.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0


def srgb_to_lin(x: np.ndarray) -> np.ndarray:
    x = np.clip(x, 0.0, None)
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4).astype(np.float32)


def lin_to_srgb(x: np.ndarray) -> np.ndarray:
    x = np.clip(x, 0.0, 1.0)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(x, 1.0 / 2.4) - 0.055).astype(np.float32)


def lin(hexstr: str) -> np.ndarray:
    """'#RRGGBB' -> linear-light float32 RGB."""
    return srgb_to_lin(srgb_arr(hexstr))


def mesh(h: int, w: int):
    yy = np.arange(h, dtype=np.float32)[:, None]
    xx = np.arange(w, dtype=np.float32)[None, :]
    return np.broadcast_to(xx, (h, w)).copy(), np.broadcast_to(yy, (h, w)).copy()


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return (t * t * (3.0 - 2.0 * t)).astype(np.float32)


def gauss_g(x, c, wd, amp=1.0):
    return amp * np.exp(-(((x - c) / wd) ** 2)).astype(np.float32)


def blur(a: np.ndarray, sigma: float) -> np.ndarray:
    """Exact gaussian blur via FFT (reflect padded, so edges do not wrap)."""
    if sigma <= 0.05:
        return a.astype(np.float32)
    h, w = a.shape[:2]
    pad = int(min(max(3.0 * sigma, 4.0), min(h, w) // 2))
    pad3 = ((pad, pad), (pad, pad), (0, 0)) if a.ndim == 3 else ((pad, pad), (pad, pad))
    ap = np.pad(a, pad3, mode="reflect")
    h2, w2 = ap.shape[:2]
    fy = np.fft.fftfreq(h2)[:, None]
    fx = np.fft.rfftfreq(w2)[None, :]
    k = np.exp(-2.0 * np.pi ** 2 * sigma ** 2 * (fx * fx + fy * fy))
    if a.ndim == 3:
        out = np.empty_like(ap, dtype=np.float64)
        for c in range(a.shape[2]):
            out[..., c] = np.fft.irfft2(np.fft.rfft2(ap[..., c].astype(np.float64)) * k, s=(h2, w2))
    else:
        out = np.fft.irfft2(np.fft.rfft2(ap.astype(np.float64)) * k, s=(h2, w2))
    return out[pad:pad + h, pad:pad + w].astype(np.float32)


def noise1d(n: int, beta: float = 1.4, seed: int = 0) -> np.ndarray:
    """Smooth periodic 1-D noise, ~N(0,1) — brushed-metal streaks."""
    rng = np.random.default_rng(seed)
    f = np.fft.rfftfreq(n).astype(np.float32)
    f[0] = 1.0
    amp = f ** (-beta / 2.0)
    amp[0] = 0.0
    spec = amp * np.exp(1j * rng.random(len(f)).astype(np.float32) * (2 * np.pi))
    x = np.fft.irfft(spec, n=n).astype(np.float32)
    x -= x.mean()
    x /= (x.std() + 1e-9)
    return x


# ── procedural noise ─────────────────────────────────────────────────────────
def spectral(h: int, w: int, beta: float = 2.0, seed: int = 0,
             fx: float = 1.0, fy: float = 1.0) -> np.ndarray:
    """Periodic 1/f^beta power-law noise, ~N(0,1). Anisotropic via fx/fy."""
    rng = np.random.default_rng(seed)
    fy_ = np.fft.fftfreq(h).astype(np.float32)[:, None] * fy
    fx_ = np.fft.rfftfreq(w).astype(np.float32)[None, :] * fx
    f = np.sqrt(fx_ * fx_ + fy_ * fy_)
    f[0, 0] = 1.0
    amp = f ** (-beta / 2.0)
    amp[0, 0] = 0.0
    phase = rng.random((h, w // 2 + 1)).astype(np.float32) * (2.0 * np.pi)
    spec = amp * np.exp(1j * phase)
    n = np.fft.irfft2(spec, s=(h, w)).astype(np.float32)
    n -= n.mean()
    n /= (n.std() + 1e-9)
    return n


def fbm(h: int, w: int, seed: int = 0, beta: float = 2.6, fx: float = 1.0,
        fy: float = 1.0, octaves: int = 3, gain: float = 0.5) -> np.ndarray:
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        acc += amp * spectral(h, w, beta, seed + 101 * o + 7, fx * (2 ** o), fy * (2 ** o))
        tot += amp
        amp *= gain
    return acc / tot


def smooth_field(h: int, w: int, seed: int, beta: float = 3.6, fx: float = 0.6,
                 fy: float = 0.9, octaves: int = 1, sigma: float = 6.0) -> np.ndarray:
    """Very low-frequency, smoothly blurred field (for reflection coordinates)."""
    f = fbm(h, w, seed=seed, beta=beta, fx=fx, fy=fy, octaves=octaves)
    return blur(f, sigma)


def bilinear(img: np.ndarray, xs: np.ndarray, ys: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    x0 = np.floor(xs).astype(np.int32)
    y0 = np.floor(ys).astype(np.int32)
    tx = (xs - x0).astype(np.float32)
    ty = (ys - y0).astype(np.float32)
    x0c = np.clip(x0, 0, w - 1)
    x1c = np.clip(x0 + 1, 0, w - 1)
    y0c = np.clip(y0, 0, h - 1)
    y1c = np.clip(y0 + 1, 0, h - 1)
    a, b = img[y0c, x0c], img[y0c, x1c]
    c, d = img[y1c, x0c], img[y1c, x1c]
    if img.ndim == 3:
        tx = tx[..., None]
        ty = ty[..., None]
    top = a + (b - a) * tx
    bot = c + (d - c) * tx
    return (top + (bot - top) * ty).astype(np.float32)


def domain_warp(field: np.ndarray, xx, yy, amount: float = 40.0, seed: int = 0,
                beta: float = 2.6) -> np.ndarray:
    h, w = field.shape[:2]
    n1 = fbm(h, w, seed=seed, beta=beta, octaves=2)
    n2 = fbm(h, w, seed=seed + 31, beta=beta, octaves=2)
    return bilinear(field, xx + n1 * amount, yy + n2 * amount)


def srgb_lum(rgb_srgb: np.ndarray) -> np.ndarray:
    """WCAG relative luminance from gamma-encoded sRGB in 0..1."""
    l = srgb_to_lin(np.clip(rgb_srgb, 0, 1))
    return (0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]).astype(np.float32)


# ── output / QA ──────────────────────────────────────────────────────────────
def finalize_lin(rgb_lin: np.ndarray, path: str, quality: int = 86,
                 exposure: float = 1.0, grain: float = 2.2, grain_seed: int = 0,
                 vignette: np.ndarray | None = None, mode: str = "RGB",
                 extra_dither: float = 0.75, report: bool = True) -> np.ndarray:
    """Linear RGB -> filmic rolloff -> sRGB -> grain + dither -> 8-bit file."""
    x = 1.0 - np.exp(-np.maximum(rgb_lin, 0.0) * exposure)
    if vignette is not None:
        x = x * vignette[..., None]
    s = lin_to_srgb(x)
    h, w = s.shape[:2]
    rng = np.random.default_rng(grain_seed + 991)
    if grain > 0:
        g = rng.standard_normal((h, w)).astype(np.float32)
        g += 0.55 * blur(rng.standard_normal((h, w)).astype(np.float32), 1.1)
        s = s + (g * grain / 255.0)[..., None]
    if extra_dither > 0:
        d = (rng.random((h, w), np.float32) - rng.random((h, w), np.float32))
        s = s + (d * extra_dither / 255.0)[..., None]
    u8 = np.clip(np.round(s * 255.0), 0, 255).astype(np.uint8)
    if mode == "RGB":
        Image.fromarray(u8, "RGB").save(path, "WEBP", quality=quality, method=6)
    else:
        Image.fromarray(u8, "RGBA").save(path, "WEBP", quality=quality, method=6)
    if report:
        report_file(path, u8)
    return u8


def report_file(path: str, u8: np.ndarray) -> None:
    size = os.path.getsize(path)
    h = u8.shape[0]
    step = max(1, h // 512)
    a = u8[::step, ::step].astype(np.float32) / 255.0
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    print(f"  -> {os.path.basename(path)}  {size / 1024.0:6.1f} KB  "
          f"ch={u8.shape[2]}  lum p1/p50/p95/p999/max="
          f"{np.percentile(lum, 1):.3f}/{np.percentile(lum, 50):.3f}/"
          f"{np.percentile(lum, 95):.3f}/{np.percentile(lum, 99.9):.3f}/{lum.max():.3f}")


def _ct_ratio(u8: np.ndarray) -> tuple[float, float]:
    lum = srgb_lum(u8.astype(np.float32) / 255.0)
    return float(np.percentile(lum, 0.5)), float(np.percentile(lum, 99.5))


# ═════════════════════════════════════════════════════════════════════════════
# 1 · hero-rail.webp — cinematic dark chrome rail perspective + ignition glow
# ═════════════════════════════════════════════════════════════════════════════
def gen_hero(path: str) -> None:
    W, H = 2400, 1500
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H

    ink = lin(C["ink"])
    ink3 = lin(C["ink3"])
    sig = lin(C["signal"])
    sig2 = lin(C["signal2"])
    glow_c = lin(C["glow"])
    ch1 = lin(C["chrome1"])
    ch2 = lin(C["chrome2"])
    paper = lin(C["paper"])
    warm_metal = 0.58 * glow_c + 0.32 * paper + 0.10 * sig2
    hot = 0.55 * paper + 0.45 * glow_c

    vpx, vpy = W * 0.735, H * 0.475
    gx, gy = W * 0.795, H * 0.500

    # ── night base: near black, a breath of haze on the horizon ─────────────
    img = np.empty((H, W, 3), np.float32)
    img[:] = ink[None, None, :]
    lift = 0.26 * np.exp(-((v - 0.50) / 0.30) ** 2) + 0.14 * smoothstep(0.0, 1.0, v)
    img += ink3[None, None, :] * lift[..., None]

    fog = fbm(H, W, seed=17, beta=3.6, fx=0.80, fy=1.15, octaves=2)
    fog = smoothstep(-1.2, 1.9, fog)
    fogmask = np.exp(-(((u - 0.74) / 0.40) ** 2 + ((v - 0.50) / 0.30) ** 2))
    img += (0.55 * ink3 + 0.012 * sig2)[None, None, :] * (fog * fogmask * 0.35)[..., None]

    # ── ignition: hot core, tight halo, very faint atmosphere ───────────────
    rr = np.sqrt(((xx - gx) / (W * 0.55)) ** 2 + ((yy - gy) / (H * 0.55)) ** 2)
    core = np.exp(-(rr / 0.043) ** 2)
    core2 = np.exp(-(rr / 0.098) ** 2)
    halo = np.exp(-(rr / 0.26) ** 2)
    atmos = np.exp(-(rr / 0.62) ** 2)
    img += hot[None, None, :] * (core * 2.10 + core2 * 0.58)[..., None]
    img += glow_c[None, None, :] * (halo * 0.085)[..., None]
    img += sig[None, None, :] * (atmos * 0.010)[..., None]

    adx = np.abs(xx - gx) / (W * 0.42)
    ady = np.abs(yy - gy) / (H * 0.050)
    img += glow_c[None, None, :] * (np.exp(-(ady ** 2)) * np.exp(-(adx ** 2) * 1.6) * 0.055)[..., None]
    shaft = np.exp(-(((xx - gx) / (W * 0.030)) ** 2)) * np.exp(-(((yy - gy) / (H * 0.30)) ** 2))
    img += glow_c[None, None, :] * (shaft * 0.012)[..., None]

    # distant haze floor at the vanishing horizon (depth cue, no lens flare)
    hz = np.exp(-((v - 0.500) / 0.016) ** 2) * smoothstep(0.18, 0.62, u) * 0.028
    img += (glow_c * 0.70 + ch2 * 0.30)[None, None, :] * hz[..., None]
    hz2 = np.exp(-((v - 0.548) / 0.030) ** 2) * smoothstep(0.25, 0.78, u) * 0.013
    img += sig2[None, None, :] * hz2[..., None]

    cfg = dict(ch2=ch2, warm=warm_metal, glow=glow_c, ch1=ch1)

    # ── rails: chrome wedges converging on the ignition point ───────────────
    rails = [
        (143.0, 0.0080, 0.30, 0.35),
        (150.2, 0.0300, 0.72, 0.70),
        (155.0, 0.0360, 1.00, 0.95),
        (159.8, 0.0270, 0.92, 1.00),
        (165.5, 0.0140, 0.52, 0.70),
        (171.5, 0.0080, 0.32, 0.45),
        (202.0, 0.0030, 0.30, 0.30),
        (210.0, 0.0022, 0.22, 0.25),
    ]
    for i, (ang, k, bright, warm) in enumerate(rails):
        col, a = _hero_rail_layer(xx, yy, vpx, vpy, ang, k, bright, warm, 300 + i * 13, cfg)
        img = img * (1.0 - a) + col * a

    # ── bloom: cinematic halation ──────────────────────────────────────────
    lum = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    bright = np.clip(lum - 0.32, 0.0, None) ** 1.3
    img += (warm_metal * 0.38 + ch2 * 0.14)[None, None, :] * (blur(bright, 22.0) * 0.45)[..., None]
    img += (sig * 0.55)[None, None, :] * (blur(bright, 64.0) * 0.16)[..., None]

    # ── grade: quiet left third (cream headline sits there), vignette ──────
    left = 0.06 + 0.94 * smoothstep(0.0, 0.50, u) ** 2.4
    img *= left[..., None]
    corner = 1.0 - 0.50 * smoothstep(0.40, 1.30,
                                     np.sqrt(((u - 0.52) * 1.16) ** 2 + ((v - 0.47) * 1.02) ** 2) / 0.72)
    img *= corner[..., None]

    finalize_lin(img, path, quality=86, exposure=0.96, grain=2.2, grain_seed=5)
    _hero_text_safety(path)


def _hero_rail_layer(xx, yy, vpx, vpy, angle_deg, k, bright, warm, seed, cfg):
    """One chrome rail wedge receding to the vanishing point. Returns (rgb, alpha)."""
    th = np.deg2rad(angle_deg)
    dx = xx - vpx
    dy = yy - vpy
    p = dx * np.cos(th) + dy * np.sin(th)
    s = -dx * np.sin(th) + dy * np.cos(th)
    p = np.maximum(p, 0.0)
    hw = np.maximum(k * p, 0.35)
    uu = np.clip(s / hw, -1.4, 1.4)

    # smooth longitudinal brushing (interpolated 1-D noise: no beaded aliasing)
    n1 = noise1d(1024, 1.25, seed)
    n2 = noise1d(1024, 0.95, seed + 5)
    grid = np.linspace(0.0, 1.0, 1024)
    b1 = np.interp(p * (1.0 / 1700.0), grid, n1)
    b2 = np.interp(p * (1.0 / 430.0), grid, n2)
    brush = 0.90 + 0.09 * b1 + 0.035 * b2

    # chrome cross-section: cool face / core shadow / lit warm face / ignition rim
    prof = (0.020
            + gauss_g(uu, -0.62, 0.26, 0.62)      # broad cool face
            + gauss_g(uu, -0.98, 0.060, 0.95)     # cool edge rim
            + gauss_g(uu, 0.10, 0.22, 0.20)       # warm shoulder
            + gauss_g(uu, 0.50, 0.20, 0.56)       # lit warm face
            + gauss_g(uu, 0.88, 0.10, 1.30)       # hot specular face
            + gauss_g(uu, 1.00, 0.038, 1.75)      # ignition rim
            - gauss_g(uu, -0.24, 0.16, 0.42)      # core shadow
            + 0.075 * smoothstep(0.10, 0.95, uu))
    prof = prof * bright * brush

    wt = smoothstep(-0.10, 0.55, uu) * warm
    col = (cfg["ch1"] * 0.10 + 0.002)[None, None, :] + prof[..., None] * (
        (1.0 - wt)[..., None] * cfg["ch2"][None, None, :]
        + wt[..., None] * cfg["warm"][None, None, :])
    col = col + cfg["glow"][None, None, :] * (gauss_g(uu, 1.00, 0.06, 0.45) * bright)[..., None]

    # fade toward the left: the rails leave the light, keeping the text side quiet
    xfade = (0.02 + 0.98 * smoothstep(0.12, 0.52, xx / xx.shape[1])).astype(np.float32)
    col *= xfade[..., None]

    fog_fade = (0.30 + 0.70 * smoothstep(30.0, 760.0, p)).astype(np.float32)
    near_fade = smoothstep(0.0, 20.0, p) * fog_fade
    aa = smoothstep(1.04, 0.90, np.abs(uu))
    return col, (aa * near_fade * xfade)[..., None]


def _hero_text_safety(path: str) -> None:
    """Verify the left third is quiet enough to carry cream display type."""
    arr = np.asarray(Image.open(path).convert("RGB"), np.float32) / 255.0
    h, w = arr.shape[:2]
    lum = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    left = lum[:, : int(w * 0.33)]
    p50 = np.percentile(left, 50)
    p99 = np.percentile(left, 99)
    top = lum[:, : int(w * 0.30)][int(h * 0.80):]  # bottom-left corner band
    print(f"     text-safe left third: mean={left.mean():.3f} p50={p50:.3f} "
          f"p99={p99:.3f} max={left.max():.3f} | bottom-left max={top.max():.3f}")


# ═════════════════════════════════════════════════════════════════════════════
# 2 · passport-chrome.webp — dark chrome foil + guilloche engraving
# ═════════════════════════════════════════════════════════════════════════════
def gen_passport(path: str) -> None:
    W, H = 1600, 1200
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H

    ink = lin(C["ink"])
    ink2 = lin(C["ink2"])
    ch1 = lin(C["chrome1"])
    ch2 = lin(C["chrome2"])
    paper = lin(C["paper"])
    glow_c = lin(C["glow"])
    sig = lin(C["signal"])

    # ── deep ink-green sheet ────────────────────────────────────────────────
    col = ink[None, None, :] * 0.96 + ink2[None, None, :] * (
        0.40 * smoothstep(0.0, 1.0, v) + 0.26 * smoothstep(0.0, 1.0, u))[..., None]

    # ── reflection ladder: a polished sheet catching two softbox strips ────
    warp = smooth_field(H, W, seed=61, beta=3.8, fx=0.50, fy=0.80, octaves=1, sigma=14.0)
    t = (0.34 * u + 0.66 * v + 0.012 * warp
         + 0.020 * np.sin(2 * np.pi * (0.85 * u + 0.18)) + 0.012 * np.sin(
             2 * np.pi * (1.7 * v + 0.6))).astype(np.float32)

    env = (0.005
           + gauss_g(t, 0.090, 0.055, 0.42)
           + gauss_g(t, 0.255, 0.080, 0.95)     # main softbox reflection (broad)
           + gauss_g(t, 0.430, 0.060, 0.22)
           + gauss_g(t, 0.610, 0.075, 0.62)     # second softbox
           + gauss_g(t, 0.790, 0.050, 0.30)
           + gauss_g(t, 0.930, 0.040, 0.52)     # lower glint
           - gauss_g(t, 0.360, 0.050, 0.12))
    env = np.clip(env, 0.0, None)
    dir_ = smoothstep(-0.30, 1.20, 0.55 * u + 0.55 * (1.0 - v))
    env = env * (0.55 + 0.75 * dir_)

    metal = ch1 * 0.55 + ch2 * 0.45
    col = col + metal[None, None, :] * (env * 1.15)[..., None]

    # thin specular ridges on the band centres (the "chrome" read)
    ridge = (gauss_g(t, 0.255, 0.010, 0.55) + gauss_g(t, 0.610, 0.009, 0.40)
             + gauss_g(t, 0.930, 0.007, 0.28))
    col = col + (ch2 * 0.50 + paper * 0.50)[None, None, :] * (ridge * 0.50)[..., None]

    # ── guilloche engraving: two crossing families of security lines ───────
    a1 = np.deg2rad(66.0)
    x1 = (u - 0.5) * np.cos(a1) + (v - 0.5) * np.sin(a1)
    x2 = -(u - 0.5) * np.sin(a1) + (v - 0.5) * np.cos(a1)
    wav = smooth_field(H, W, seed=97, beta=3.2, fx=1.6, fy=1.6, octaves=2, sigma=3.0)
    g1 = np.sin(2 * np.pi * (x1 * 44.0 + 0.52 * np.sin(2 * np.pi * x2 * 3.1 + wav * 1.5)))
    g2 = np.sin(2 * np.pi * (x2 * 36.0 + 0.42 * np.sin(2 * np.pi * x1 * 2.3 + wav * 1.1)))
    line1 = smoothstep(0.84, 0.998, 0.5 + 0.5 * g1)
    line2 = smoothstep(0.92, 0.999, 0.5 + 0.5 * g2)
    # concentric security rose, fading outward
    dxn = (xx - W * 0.56) / H
    dyn = (yy - H * 0.44) / H
    rr = np.sqrt(dxn * dxn + dyn * dyn)
    ang = np.arctan2(dyn, dxn)
    g3 = np.sin(2 * np.pi * (rr * 25.0 + 0.34 * np.sin(ang * 8.0 + wav * 1.2)))
    line3 = smoothstep(0.86, 0.998, 0.5 + 0.5 * g3)
    eng = line1 * 0.38 + line2 * 0.16 + line3 * 0.46 * (1.0 - smoothstep(0.12, 0.62, rr))
    eng *= (0.20 + 0.80 * smoothstep(0.0, 0.62, 1.0 - np.abs(t - 0.55) * 1.5))
    # emboss: highlight + a soft shadow one step lower
    sh = np.roll(eng, 2, axis=0)
    sh[:3] = 0.0
    col = col + (ch2 * 0.62 + paper * 0.38)[None, None, :] * (eng * 0.105)[..., None]
    col = col - ink[None, None, :] * (blur(sh, 1.4) * 0.32)[..., None]

    # ── brushed micro-streaks ─────────────────────────────────────────────
    brush = spectral(H, W, 1.2, 211, fx=0.13, fy=4.0) * 0.018
    col *= (1.0 + brush)[..., None]

    # ── soft fold across the foil (tonal step + thin highlight) ───────────
    f_ang = np.deg2rad(-26.0)
    sf = (u - 0.5) * np.cos(f_ang) + (v - 0.5) * np.sin(f_ang)
    col *= (0.88 + 0.26 * smoothstep(0.022, 0.050, sf))[..., None]
    crease = gauss_g(sf, 0.048, 0.0026, 0.70) + gauss_g(sf, 0.048, 0.020, 0.16)
    col = col + (ch2 * 0.8 + paper * 0.4)[None, None, :] * (crease * 0.35)[..., None]

    # ── ignition rim leaking from the lower right ─────────────────────────
    rim = np.exp(-(((u - 1.02) / 0.30) ** 2 + ((v - 0.99) / 0.34) ** 2)) * 0.34
    col = col + (glow_c * 0.7 + sig * 0.3)[None, None, :] * rim[..., None]

    # ── deep margins + vignette ───────────────────────────────────────────
    margin = smoothstep(0.0, 0.085, np.minimum(np.minimum(u, 1 - u), np.minimum(v, 1 - v)))
    col = ink[None, None, :] * 0.78 * (1 - margin)[..., None] + col * margin[..., None]
    vig = 1.0 - 0.42 * smoothstep(0.40, 1.28,
                                  np.sqrt(((u - 0.5) * 1.05) ** 2 + ((v - 0.5) * 1.0) ** 2) / 0.70)
    col *= vig[..., None]

    finalize_lin(col, path, quality=84, exposure=0.94, grain=1.6, grain_seed=7)


# ═════════════════════════════════════════════════════════════════════════════
# 3 · orange-band.webp — ignition orange mesh + chrome sheen (ink text safe)
# ═════════════════════════════════════════════════════════════════════════════
def gen_orange_band(path: str) -> None:
    W, H = 2400, 1200
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H
    sig = srgb_arr(C["signal"])
    sig2 = srgb_arr(C["signal2"])
    glow_c = srgb_arr(C["glow"])
    ember = srgb_arr(C["ember"])
    paper = srgb_arr(C["paper"])

    # ── deep ignition base: signal -> ember along a soft diagonal ──────────
    t = np.clip(0.07 + 0.50 * (0.62 * u + 0.42 * (1.0 - v)), 0.0, 1.0)
    t = smoothstep(0.0, 1.0, t)
    col = sig[None, None, :] * (1 - t[..., None]) + ember[None, None, :] * t[..., None]

    # very large, very soft value modulation (keeps the mid-tone flat)
    m = smooth_field(H, W, seed=131, beta=3.6, fx=0.5, fy=0.5, octaves=1, sigma=44.0)
    col = col * (0.962 + 0.070 * np.tanh(m * 0.9))[..., None]

    # one broad warm bloom top-right, one deeper pool bottom-left
    col = col + sig2[None, None, :] * (
        gauss_g(u, 0.86, 0.30, 0.070) * gauss_g(v, 0.24, 0.40, 1.0))[..., None]
    col = col * (1.0 - 0.045 * (gauss_g(u, 0.03, 0.32, 1.0) * gauss_g(v, 0.94, 0.36, 1.0)))[..., None]

    # ── chrome reflection: one broad diagonal sheen, very smooth ──────────
    a_ang = np.deg2rad(66.0)
    s_axis = (u * np.cos(a_ang) + v * np.sin(a_ang)).astype(np.float32)
    sheen = blur(gauss_g(s_axis, 0.26, 0.16, 0.65), 26.0)
    sheen = sheen / max(float(sheen.max()), 1e-6)
    col = col + (paper * 0.45 + glow_c * 0.55)[None, None, :] * (sheen * 0.095)[..., None]
    # a second, softer vertical reflection near the right edge
    wash = blur(np.exp(-(((u - 0.94) / 0.14) ** 2)) * np.exp(-((v - 0.40) / 0.55) ** 2), 34.0)
    col = col + sig2[None, None, :] * (wash * 0.080)[..., None]
    # one broad darker reflection band gives the orange field a metallic falloff
    dark_band = blur(gauss_g(s_axis, 0.70, 0.10, 1.0), 22.0)
    col = col * (1.0 - 0.030 * dark_band)[..., None]

    # ── barely-there micro texture + grain ────────────────────────────────
    brush = spectral(H, W, 1.0, 149, fx=0.08, fy=5.0) * 0.006
    col = np.clip(col * 1.040, 0, 1) * (1.0 + brush)[..., None]

    rng = np.random.default_rng(151)
    s = np.clip(col, 0, 1)
    g = rng.standard_normal((H, W)).astype(np.float32)
    g += 0.5 * blur(rng.standard_normal((H, W)).astype(np.float32), 1.1)
    s = s + (g * 1.5 / 255.0)[..., None]
    d = (rng.random((H, W), np.float32) - rng.random((H, W), np.float32))
    s = s + (d * 0.75 / 255.0)[..., None]
    u8 = np.clip(np.round(s * 255.0), 0, 255).astype(np.uint8)
    Image.fromarray(u8, "RGB").save(path, "WEBP", quality=86, method=6)
    report_file(path, u8)

    lo, hi = _ct_ratio(u8)
    print(f"     ink-on-band WCAG contrast: {(lo + 0.05) / 0.05:.2f}:1 (dark) .. "
          f"{(hi + 0.05) / 0.05:.2f}:1 (bright)")


# ═════════════════════════════════════════════════════════════════════════════
# 4 · chrome-ribbon.webp — liquid chrome ribbon on night
# ═════════════════════════════════════════════════════════════════════════════
def gen_chrome_ribbon(path: str) -> None:
    W, H = 2000, 1200
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H

    ink = lin(C["ink"])
    ink2 = lin(C["ink2"])
    ch1 = lin(C["chrome1"])
    ch2 = lin(C["chrome2"])
    paper = lin(C["paper"])
    sig = lin(C["signal"])
    sig2 = lin(C["signal2"])
    glow_c = lin(C["glow"])
    warm_metal = 0.42 * glow_c + 0.10 * paper + 0.48 * sig2

    # ── night backdrop: deep ink + a low warm haze ─────────────────────────
    img = np.empty((H, W, 3), np.float32)
    img[:] = ink[None, None, :]
    haze = np.exp(-(((u - 0.90) / 0.48) ** 2 + ((v - 1.08) / 0.42) ** 2))
    img += (sig * 0.35 + ink2 * 0.5)[None, None, :] * (haze * 0.038)[..., None]
    fogb = smooth_field(H, W, seed=301, beta=3.4, fx=1.0, fy=1.0, octaves=2, sigma=8.0)
    img += (ink2 * 0.9 + ch1 * 0.10)[None, None, :] * (smoothstep(-1.0, 1.8, fogb) * 0.010)[..., None]

    strands = [
        # thick diagonal hero ribbon (front)
        dict(y0=0.505, a1=0.104, f1=0.80, p1=0.60, a2=0.030, f2=2.20, p2=1.70,
             th=0.104, tilt=-0.24, seed=1, bright=1.00, wob=1.00),
        # mid ribbon crossing the other way
        dict(y0=0.355, a1=0.078, f1=1.20, p1=2.60, a2=0.022, f2=3.00, p2=0.40,
             th=0.060, tilt=0.16, seed=2, bright=0.82, wob=0.85),
        # thin lower ribbon
        dict(y0=0.805, a1=0.050, f1=1.50, p1=4.40, a2=0.017, f2=3.70, p2=2.20,
             th=0.034, tilt=-0.09, seed=3, bright=0.55, wob=0.75),
    ]
    for st in reversed(strands):
        _ribbon_strand(img, xx, yy, u, v, st, ch1, ch2, paper, glow_c, warm_metal)

    # ── bloom / halation ──────────────────────────────────────────────────
    lum = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
    bright = np.clip(lum - 0.42, 0.0, None) ** 1.25
    img += (ch2 * 0.28 + glow_c * 0.52)[None, None, :] * (blur(bright, 20.0) * 0.55)[..., None]
    img += (sig * 0.70)[None, None, :] * (blur(bright, 62.0) * 0.26)[..., None]

    vig = 1.0 - 0.46 * smoothstep(0.38, 1.24,
                                  np.sqrt(((u - 0.5) * 1.06) ** 2 + ((v - 0.5) * 1.0) ** 2) / 0.72)
    img *= vig[..., None]
    img *= (0.90 + 0.10 * smoothstep(0.0, 1.0, u))[..., None]

    finalize_lin(img, path, quality=85, exposure=1.0, grain=2.4, grain_seed=11)


def _ribbon_strand(img, xx, yy, u, v, s, ch1, ch2, paper, glow_c, warm_metal):
    """Liquid-metal ribbon: smooth warped reflection ladder + rounded-tube volume."""
    H, W = xx.shape

    cy = (s["y0"]
          + s["a1"] * np.sin(2 * np.pi * s["f1"] * u + s["p1"])
          + s["a2"] * np.sin(2 * np.pi * s["f2"] * u + s["p2"])
          + s["tilt"] * (u - 0.5)).astype(np.float32)
    wob = smooth_field(H, W, seed=410 + s["seed"] * 7, beta=3.3, fx=0.9, fy=1.5,
                       octaves=2, sigma=10.0)
    th = (s["th"] * (1.0 + 0.20 * np.sin(2 * np.pi * 0.85 * u + s["p1"] * 1.7 + 0.4))
          * (1.0 + 0.06 * wob)).astype(np.float32)
    d = ((v - cy) / th).astype(np.float32)
    inside = np.clip(1.0 - d * d, 0.0, 1.0)

    # warp + twist the reflection ladder so the metal flows along the strand
    twist = 0.11 * np.sin(2 * np.pi * (0.9 * u + s["p1"] * 0.6))
    dd = (d * (1.0 + 0.05 * wob) + 0.13 * wob + twist).astype(np.float32)

    # a few broad reflection bands: liquid chrome, not marble (no thin stripes)
    env = (0.004
           + gauss_g(dd, -0.78, 0.16, 0.32)      # cool broad reflection
           + gauss_g(dd, -0.30, 0.048, 1.00)     # cool horizon line
           + gauss_g(dd, 0.14, 0.085, 1.30)      # warm key reflection
           + gauss_g(dd, 0.52, 0.055, 0.26)
           + gauss_g(dd, 0.84, 0.150, 0.20)
           - gauss_g(dd, -0.02, 0.070, 0.26)     # dark valley
           + 0.020 * smoothstep(0.20, 1.20, dd))
    spec = (gauss_g(dd, 0.10, 0.026, 1.65)
            + gauss_g(dd, -0.30, 0.018, 0.70)
            + gauss_g(dd, -0.12, 0.012, 0.60)
            + gauss_g(dd, 0.50, 0.013, 0.38))
    env = (env + spec) * s["bright"]
    env = env * (0.94 + 0.10 * np.sin(2 * np.pi * (u * 1.8 + 0.5 * wob)))

    wt = smoothstep(0.30, 1.02, dd)
    col = (ch1 * 0.10 + 0.002)[None, None, :] + env[..., None] * (
        (1.0 - wt)[..., None] * (ch2 * 0.96)[None, None, :]
        + wt[..., None] * warm_metal[None, None, :])

    # rounded-tube volume: edges roll off, centre carries the reflection
    form = (0.14 + 0.86 * inside ** 0.52).astype(np.float32)
    col = col * form[..., None]

    # rims: lower edge catches the ignition, upper edge stays cool chrome
    col = col + warm_metal[None, None, :] * (
        gauss_g(d, 0.975, 0.032, 0.95) * s["bright"] * 0.55)[..., None]
    col = col + ch2[None, None, :] * (
        gauss_g(d, -0.985, 0.024, 0.55) * s["bright"] * 0.30)[..., None]

    aa = smoothstep(1.0, 0.93, np.abs(d))
    a = (aa * (0.55 + 0.45 * inside ** 0.30))[..., None]
    img *= (1.0 - a)
    img += col * a


# ═════════════════════════════════════════════════════════════════════════════
# 5 · halftone-grid.webp — rotated halftone dot field (RGBA overlay)
# ═════════════════════════════════════════════════════════════════════════════
def gen_halftone(path: str) -> None:
    W = H = 1600
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H
    rot = np.deg2rad(27.0)
    cs, sn = np.cos(rot), np.sin(rot)
    gx = (xx - W * 0.5) * cs + (yy - H * 0.5) * sn
    gy = -(xx - W * 0.5) * sn + (yy - H * 0.5) * cs

    spacing = 34.0
    fx = np.mod(gx, spacing) - spacing * 0.5
    fy = np.mod(gy, spacing) - spacing * 0.5
    dist = np.sqrt(fx * fx + fy * fy)

    # dot size swells and recedes like a print screen photographed off paper
    field = fbm(H, W, seed=501, beta=2.9, fx=0.75, fy=0.75, octaves=2)
    field = smoothstep(-1.9, 1.9, field)
    field = 0.18 + 0.82 * field
    corner = smoothstep(0.0, 1.0, np.clip((u * 0.60 + (1.0 - v) * 0.68) * 1.25, 0, 1))
    radius = (spacing * 0.38) * field * (0.18 + 1.00 * corner)

    aa = 0.85
    cover = np.clip((radius - dist) / aa + 0.5, 0.0, 1.0)
    cover = cover * cover * (3 - 2 * cover)

    fx2 = np.mod(gx * 2.0 + 7.0, spacing) - spacing * 0.5
    fy2 = np.mod(gy * 2.0 + 7.0, spacing) - spacing * 0.5
    dist2 = np.sqrt(fx2 * fx2 + fy2 * fy2)
    radius2 = (spacing * 0.16) * field * (0.20 + 0.80 * corner)
    cover2 = np.clip((radius2 - dist2) / aa + 0.5, 0.0, 1.0)
    cover2 = cover2 * cover2 * (3 - 2 * cover2)

    alpha = np.clip(cover * 0.94 + cover2 * 0.24, 0.0, 1.0)
    dot = srgb_arr(C["paper"])
    rgb = np.broadcast_to(dot, (H, W, 3)).copy()

    a8 = np.round(np.clip(alpha, 0, 1) * 255.0 / 18.0) * 18.0
    rgba = np.concatenate([rgb * 255.0, np.clip(a8, 0, 255)[..., None]], axis=-1)
    u8 = np.clip(np.round(rgba), 0, 255).astype(np.uint8)
    Image.fromarray(u8, "RGBA").save(path, "WEBP", quality=80, method=6, alpha_quality=82)
    report_file(path, u8)


# ═════════════════════════════════════════════════════════════════════════════
# 6 · grain.png — seamless 512 film-grain tile with alpha
# ═════════════════════════════════════════════════════════════════════════════
def gen_grain(path: str) -> None:
    N = 512
    rng = np.random.default_rng(701)
    white = rng.standard_normal((N, N)).astype(np.float32)
    clump = spectral(N, N, 1.35, 703) * 0.9
    clump2 = spectral(N, N, 2.30, 709) * 1.1
    # mid-grey carrier: bright *and* dark specks, transparent where neutral
    g = 128.0 + 15.0 * clump + 21.0 * clump2 + 30.0 * white
    hot = np.abs(white) > 2.2
    g = g + hot * white * 14.0
    g = np.clip(g, 0, 255)

    alpha = np.abs(g - 128.0) * 2.35 + 6.0 * np.abs(clump)
    alpha = np.clip(alpha, 0, 255)

    # coarse quantisation of value + alpha: invisible at the 5-15% CSS opacity
    # this tile is used at, but keeps a noisy 512px PNG small on the wire.
    g = np.round(g / 20.0) * 20.0
    alpha = np.round(alpha / 56.0) * 56.0
    g = np.clip(g, 0, 255)
    alpha = np.clip(alpha, 0, 255)

    rgb = np.repeat(g[..., None], 3, axis=2)
    rgba = np.concatenate([rgb, alpha[..., None]], axis=-1).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(path, "PNG", optimize=True)
    size = os.path.getsize(path)
    print(f"  -> {os.path.basename(path)}  {size / 1024.0:6.1f} KB  seamless  "
          f"mean alpha={alpha.mean():.1f}")


# ═════════════════════════════════════════════════════════════════════════════
# 7 · agents-scan.webp — scanline / telemetry texture (low contrast, dark)
# ═════════════════════════════════════════════════════════════════════════════
def gen_agents_scan(path: str) -> None:
    W, H = 1600, 1000
    xx, yy = mesh(H, W)
    u = xx / W
    v = yy / H
    ink = srgb_arr(C["ink"])
    ink2 = srgb_arr(C["ink2"])
    acid = srgb_arr(C["acid"])
    sig = srgb_arr(C["signal"])
    ch1 = srgb_arr(C["chrome1"])

    col = ink[None, None, :] * (0.85 + 0.30 * smoothstep(0.0, 1.0, v))[..., None]
    col = col + ink2[None, None, :] * (0.85 * np.exp(-((v - 0.42) / 0.55) ** 2))[..., None]

    # scanlines: two periods mixed so downscaling never produces moire
    scan = (0.5 + 0.5 * np.cos(2 * np.pi * yy / 3.0)) * 0.55 \
         + (0.5 + 0.5 * np.cos(2 * np.pi * yy / 7.0)) * 0.45
    col = col * (0.88 + 0.20 * scan)[..., None]

    grid_x = np.exp(-((np.mod(xx + 2.0, 64.0) - 2.0) / 1.2) ** 2)
    col = col + ch1[None, None, :] * (grid_x * 0.030 * smoothstep(0.0, 1.0, v))[..., None]
    dots = ((np.mod(xx, 24.0) < 1.3) & (np.mod(yy, 24.0) < 1.3)).astype(np.float32)
    col = col + ch1[None, None, :] * (dots * 0.020)[..., None]

    rng = np.random.default_rng(811)
    for _ in range(52):
        y0 = rng.uniform(0.03, 0.98) * H
        x0 = rng.uniform(0.01, 0.55) * W
        ln = rng.uniform(0.06, 0.42) * W
        fade = rng.uniform(0.25, 1.0)
        w = np.exp(-((yy - y0) / 0.85) ** 2)
        h = smoothstep(x0, x0 + 8.0, xx) * smoothstep(x0 + ln, x0 + ln - 40.0, xx)
        c = acid if rng.random() > 0.35 else ch1
        col = col + c[None, None, :] * (w * h * fade * 0.060)[..., None]

    for (cx, cy, n, amp, cc) in ((0.17, 0.79, 16, 0.13, acid), (0.66, 0.24, 12, 0.07, ch1)):
        for i in range(n):
            bx = (cx + (i - n / 2) * 0.0125) * W
            bh = rng.uniform(0.02, 0.10) * H
            by = cy * H
            w = np.exp(-((xx - bx) / 1.3) ** 2)
            h = smoothstep(by, by + 3.0, yy) * smoothstep(by + bh, by + bh - 6.0, yy)
            col = col + cc[None, None, :] * (w * h * amp * rng.uniform(0.5, 1.0))[..., None]

    g1 = np.exp(-(((u - 0.16) / 0.30) ** 2 + ((v - 0.80) / 0.32) ** 2))
    col += acid[None, None, :] * (g1 * 0.040)[..., None]
    g2 = np.exp(-(((u - 0.82) / 0.34) ** 2 + ((v - 0.18) / 0.30) ** 2))
    col += sig[None, None, :] * (g2 * 0.026)[..., None]

    vig = 1.0 - 0.45 * smoothstep(0.35, 1.15,
                                  np.sqrt(((u - 0.5) * 1.05) ** 2 + ((v - 0.5) * 1.0) ** 2) / 0.72)
    col *= vig[..., None]

    # display-space grain + dither (already sRGB values, do NOT encode twice)
    g = rng.standard_normal((H, W)).astype(np.float32)
    g += 0.5 * blur(rng.standard_normal((H, W)).astype(np.float32), 1.0)
    s = col + (g * 1.4 / 255.0)[..., None]
    d = (rng.random((H, W), np.float32) - rng.random((H, W), np.float32))
    s = s + (d * 0.7 / 255.0)[..., None]
    u8 = np.clip(np.round(s * 255.0), 0, 255).astype(np.uint8)
    Image.fromarray(u8, "RGB").save(path, "WEBP", quality=85, method=6)
    report_file(path, u8)


# ═════════════════════════════════════════════════════════════════════════════
# entry point
# ═════════════════════════════════════════════════════════════════════════════
ASSETS = {
    "hero": ("hero-rail.webp", gen_hero),
    "passport": ("passport-chrome.webp", gen_passport),
    "band": ("orange-band.webp", gen_orange_band),
    "ribbon": ("chrome-ribbon.webp", gen_chrome_ribbon),
    "halftone": ("halftone-grid.webp", gen_halftone),
    "grain": ("grain.png", gen_grain),
    "scan": ("agents-scan.webp", gen_agents_scan),
}


# target aliases: short names for humans, asset-file names for the MCP server
# (mcp/art-server.mjs enum: hero-rail, passport-chrome, orange-band, chrome-ribbon,
#  halftone-grid, grain, agents-scan, all)
ALIASES = {
    "hero": "hero", "hero-rail": "hero", "hero-rail.webp": "hero",
    "passport": "passport", "passport-chrome": "passport", "passport-chrome.webp": "passport",
    "band": "band", "orange-band": "band", "orange-band.webp": "band",
    "ribbon": "ribbon", "chrome-ribbon": "ribbon", "chrome-ribbon.webp": "ribbon",
    "halftone": "halftone", "halftone-grid": "halftone", "halftone-grid.webp": "halftone",
    "grain": "grain", "grain.png": "grain",
    "scan": "scan", "agents-scan": "scan", "agents-scan.webp": "scan",
}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="RAIL v2 local art generator")
    ap.add_argument("--target", "--only", dest="targets", nargs="*", default=None,
                    metavar="NAME",
                    help="asset to generate: " + ", ".join(ASSETS) +
                         " (or the asset file name / 'all'); default all")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args(argv)

    if args.list:
        for k, (fn, _) in ASSETS.items():
            print(f"{k:10s} {fn}")
        return 0

    os.makedirs(OUT_DIR, exist_ok=True)
    if not args.targets:
        keys = list(ASSETS)
    else:
        keys, unknown = [], []
        for t in args.targets:
            t = str(t).strip().lower()
            if t in ("all", "everything", "*"):
                keys = list(ASSETS)
                break
            k = ALIASES.get(t)
            if k is None:
                unknown.append(t)
            elif k not in keys:
                keys.append(k)
        if unknown:
            print(f"unknown target(s): {unknown}. known: {', '.join(ASSETS)} / all")
            return 2
        if not keys:
            keys = list(ASSETS)

    print(f"RAIL art -> {OUT_DIR}")
    for k in keys:
        fname, fn = ASSETS[k]
        t0 = time.time()
        print(f"[{k}] {fname}")
        fn(os.path.join(OUT_DIR, fname))
        print(f"     {time.time() - t0:5.1f}s")
    print("done")
    return 0


if __name__ == "__main__":
    sys.exit(main())
