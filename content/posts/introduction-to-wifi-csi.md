---
title: "The WiFi Channel as a Distributed Sensor"
date: 2026-06-13T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "What one CSI matrix actually looks like — OFDM structure, multipath superposition as a worked example, and why RSSI discards the degrees of freedom that make WiFi sensing possible."
keywords:
  - WiFi CSI matrix
  - OFDM CSI structure
  - multipath superposition
  - WiFi channel as sensor
tags:
  - WiFi CSI
  - OFDM
  - multipath
categories:
  - Fundamentals
---

Most explanations of WiFi sensing stop at "CSI measures amplitude and phase." This post goes one level deeper:
what a single CSI snapshot actually contains, how multipath superposition works as a concrete model, and why
collapsing that into RSSI throws away the information you need.

For the full physics treatment, see [how it works](/how-it-works/). This is the worked-example version.

## One packet, one matrix

When an ESP32 receives a WiFi frame, the PHY layer reports CSI as a complex vector:

```
CSI[k] = |CSI[k]| · e^(j·φ[k])     for k = 0, 1, ..., N-1
```

Each index `k` is one **OFDM subcarrier** — a narrow frequency slice of the channel. A typical 20 MHz WiFi
channel has 64 subcarriers (52 data-bearing). You get 52 complex numbers per packet: 52 amplitude-phase
pairs describing how the signal traveled at each frequency.

Stack packets over time and you have a 2D matrix:

```
         subcarrier 0   1   2  ...  51
time t0:    [CSI]    [CSI] [CSI] ... [CSI]
time t1:    [CSI]    [CSI] [CSI] ... [CSI]
...
```

This matrix is the fundamental sensing input. Every detection algorithm — variance thresholds, spectrograms,
convolutional classifiers — operates on this structure or a transformation of it.

## Multipath as superposition: a worked example

Suppose a WiFi link crosses a 5 m room. Three dominant paths reach the receiver:

| Path | Description | Delay | Relative amplitude |
|------|-------------|-------|--------------------|
| 0 | Direct (TX → RX) | 17 ns | 1.0 |
| 1 | Wall reflection | 25 ns | 0.6 |
| 2 | Floor reflection | 31 ns | 0.4 |

The channel at frequency \(f\) is:

\[
H(f) = 1.0 \cdot e^{-j2\pi f \cdot 17\text{ns}} + 0.6 \cdot e^{-j2\pi f \cdot 25\text{ns}} + 0.4 \cdot e^{-j2\pi f \cdot 31\text{ns}}
\]

Each subcarrier \(k\) with frequency \(f_k\) gets a different complex value depending on how the three path
phases align at that frequency. Constructive interference at some subcarriers, destructive at others — this
is the **frequency-selective fading** pattern that CSI captures.

Now a person walks through the link. Their body adds a fourth path (or modifies path 1's reflection off the
wall behind them). The superposition changes. Some subcarriers rotate phase by π/4, others barely move. The
*pattern* of which subcarriers changed — not just that something changed — carries information about where
and how the body perturbed the field.

## What RSSI throws away

RSSI integrates power across all subcarriers (and often across antennas and packets):

\[
\text{RSSI} \propto \sum_k |H(f_k)|^2
\]

Phase cancels in the sum. Frequency-selective structure is lost. Two completely different channel states —
one with a person present, one without — can produce identical RSSI if the total power happens to match.

CSI preserves per-subcarrier amplitude and phase. A person breathing might rotate phase on subcarriers 12–18
by 0.1 radians while leaving subcarriers 30–40 unchanged. RSSI sees nothing. CSI sees a spatially structured
perturbation — the signature of a scatterer at a specific geometry.

This is not a marginal improvement. It is the difference between sensing and not sensing.

## Implications for system design

1. **Never reduce CSI to RSSI for sensing.** If your pipeline only uses signal strength, you are leaving
   the mechanism on the table.
2. **Subcarrier selection matters.** Not all subcarriers respond equally to a given motion. FreeDetector uses
   greedy selection of the most occupancy-responsive subcarriers. Feature extraction should use the full vector,
   learned attention, or selected indices — not a single arbitrary subcarrier.
3. **Time resolution is packet-rate.** Each row in the CSI matrix arrives with one WiFi frame. At 100
   packets/second, your Nyquist limit for motion is 50 Hz — fine for walking, marginal for heartbeat. CARM
   recommended ~800 samples/s for fine activity boundaries; ESP32 deployments typically run well below that.

## The ill-posed recovery problem

Recovering body pose from CSI is fundamentally underdetermined. Person-in-WiFi (ICCV 2019) frames it explicitly:
9 antenna pairs × 30 subcarriers = ~270 scalar equations per frame to recover a high-dimensional skeleton.
The system does not solve this geometrically — it learns segmentation masks and joint heatmaps from video
labels. That is why pose estimation requires research-grade antenna arrays and labeled training pipelines,
not a single ESP32 sniffing ambient traffic.

## Where to go next

- [How it works](/how-it-works/) — macro vs micro-Doppler, phase challenges
- [Sensing pipeline](/sensing-pipeline/) — what happens to this matrix before inference
- [ESP32 CSI: capture limits](/posts/esp32-csi-explained/) — what commodity hardware actually delivers
