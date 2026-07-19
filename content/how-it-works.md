---
title: "How WiFi CSI Sensing Works"
linkTitle: "How it works"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "The physics of WiFi CSI sensing — OFDM subcarriers, multipath superposition, phase vs amplitude, micro-Doppler from breathing, and why commodity WiFi links can sense a room."
keywords:
  - how WiFi CSI sensing works
  - WiFi CSI explained
  - Channel State Information
  - CSI vs RSSI
  - OFDM subcarriers
  - multipath WiFi sensing
  - micro-Doppler WiFi
---

Every WiFi link already measures the radio channel between transmitter and receiver. **Channel State
Information (CSI)** is that measurement, kept at full resolution: amplitude and phase across dozens of
frequency slices. When a body moves in the space, it perturbs those measurements in predictable ways. This
page explains the physics. For signal processing and ML, see the [sensing pipeline](/sensing-pipeline/).
For what can be detected, see the [detection ladder](/detection/).

## CSI vs RSSI

**RSSI** is one number — total received power. It answers "how strong is the signal?" and nothing else.

**CSI** is a vector — amplitude and phase at each **OFDM subcarrier** (typically 50–200 per WiFi channel).
It answers "how did the signal travel, across which frequencies, with what delays?" That vector changes when
anything in the environment moves, even slightly.

RSSI might drop 1 dB when someone walks through a room. CSI shows *which* subcarriers shifted, *how much*
phase rotated, and *whether* the change is broadband (walking) or narrowband (breathing). The extra degrees
of freedom are what make device-free sensing possible.

## OFDM: one packet, many sensors

Modern WiFi uses **Orthogonal Frequency-Division Multiplexing**. Instead of one wideband signal, the channel
is split into narrow parallel subcarriers — each one a separate narrowband measurement of the same physical
space.

One received WiFi packet gives you a CSI snapshot: a complex number (amplitude + phase) per subcarrier. Stack
snapshots over time and you have a 2D matrix — time on one axis, subcarrier index on the other — that records
how the channel evolved. That matrix is the raw input to every WiFi sensing system.

## Multipath: why bodies show up

A signal reaching the receiver travels multiple paths — direct, reflected off walls, scattered off furniture,
diffracted around corners. The received channel is a superposition:

\[
H(f) = \sum_i a_i \, e^{-j 2\pi f \tau_i}
\]

Each path \(i\) has an amplitude \(a_i\) and delay \(\tau_i\). The human body — mostly water — reflects and
absorbs radio energy, adding and modifying paths. When someone moves, path lengths and amplitudes change,
which shifts \(H(f)\) across subcarriers.

This is not a subtle effect. A person walking through a link can rotate phase by radians on individual
subcarriers. The challenge is not sensitivity — it is separating human-caused change from hardware drift,
environmental noise, and other people's motion.

## Phase: informative and treacherous

Phase carries the fine detail needed for micro-motion (breathing, small gestures). But on COTS WiFi, carrier
frequency offset between transmitter and receiver can reach 100 kHz — rotating phase by tens of radians
between consecutive packets. CARM (MobiCom 2015) demonstrated that for activity recognition on commodity
hardware, **amplitude (CSI signal power)** is the reliable signal; raw phase is dominated by hardware
artifacts.

Production systems that need phase — respiration, fine gestures — sanitize before inference: remove linear
trends across subcarriers, work with phase differences, pair antennas to cancel static offsets. Amplitude
is more stable but less sensitive to sub-wavelength motion. Macro motion (walking, sitting) is detectable
from amplitude dynamics alone. The [sensing pipeline](/sensing-pipeline/) covers preprocessing in detail.

## Macro motion vs micro-Doppler

Different motions leave different signatures in the CSI time series:

| Motion type | Frequency band | Mechanism |
|-------------|---------------|-----------|
| Walking, gestures | 1–5 Hz | Limb acceleration creates broadband Doppler spread |
| Sitting, standing | Impulse (< 1 s) | Sudden change in scatterer geometry |
| Breathing | 0.1–0.5 Hz | Periodic chest displacement — micro-Doppler |
| Heartbeat | 0.8–2 Hz | Even smaller displacement; needs high SNR |

Macro motion is easy to detect — variance spikes across subcarriers. Micro-Doppler from respiration is
orders of magnitude weaker and requires clean phase, close range, and a quiet environment. This is why
occupancy and motion are robust while breathing is achievable but conditional.

## What limits commodity sensing

Research systems and Wavey's ESP32 stack are not the same hardware:

| | Research rig (typical) | Wavey ESP32 |
|--|----------------------|-------------|
| Antennas | 3×3 MIMO (9 pairs), Intel 5300 | 1 RX chain |
| Subcarriers | 52–114 per channel | 52–56 |
| Sampling | 100–800 pkt/s | 20–200 pkt/s (traffic-dependent) |
| Phase stability | External clock sync possible | CFO-dominated; amplitude-first |
| Spatial diversity | Beamforming, AoA, dense grids | Multiple nodes at different positions |

Within those constraints:

- **Single-antenna ESP32 nodes** capture one spatial perspective. Multiple nodes improve coverage and enable
  rough spatial diversity.
- **Sampling rate** is tied to WiFi packet arrival — typically tens to low hundreds of Hz, not radar-grade.
  CARM recommends ~800 samples/s for fine HAR; ESP32 deployments operate well below that.
- **Environment specificity** — multipath fingerprints are unique per room. A model or baseline trained
  elsewhere will not transfer without adaptation.
- **Superposition** — multiple bodies create overlapping perturbations. Separating them needs spatial diversity
  or controlled setups.

These are engineering constraints, not fundamental limits. They define where Wavey focuses: occupancy,
motion, and presence — not pose reconstruction or identity.

## Standards and the commodity path

**IEEE 802.11bf** is standardizing WiFi sensing as a first-class capability. Separately, most deployed APs
already emit **compressed beamforming reports (CBR)** during normal 802.11ac/ax operation — city-scale
measurements show raw CSI is available on only a tiny fraction of chipsets, while beamforming feedback is
nearly ubiquitous.

BeamSense (SIGCOMM 2023) reconstructs multipath channels from standard CBR and runs sensing algorithms on
that signal, reporting better accuracy and cross-environment generalization than CSI-only approaches on the
same hardware. For Wavey today, ESP32 CSI is the capture path; long-term, sensing may shift toward what
routers already transmit without firmware hacks.

## Where Wavey fits

```text
ESP32 CSI capture ──▶ preprocess + features ──▶ inference ──▶ events
```

Wavey captures CSI on inexpensive ESP32 nodes, processes it through the pipeline above, and emits occupancy,
motion, and presence events. The open-source stack is on [GitHub](https://github.com/waveyhq); live signals
are visible in the [Console](https://console.wavey.nopejs.me).

## Next steps

- [Sensing pipeline](/sensing-pipeline/) — preprocessing, features, and ML
- [Detection ladder](/detection/) — task feasibility and Wavey scope
- [Getting started](/getting-started/) — deployment architecture
- [Glossary](/glossary/) — term definitions
