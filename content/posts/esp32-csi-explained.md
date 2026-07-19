---
title: "Commodity CSI: Capture Limits and Calibration"
date: 2026-06-24T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "What ESP32 CSI actually gives you — sampling rate, antenna count, phase noise floor, ESP-CSI API surface, and when cheap hardware is enough for real sensing."
keywords:
  - ESP32 CSI limits
  - ESP32 CSI calibration
  - commodity WiFi sensing hardware
  - ESP-CSI phase noise
tags:
  - ESP32
  - hardware
  - calibration
categories:
  - Fundamentals
---

Research papers often use USRPs, Intel 5300 NICs (3×3 MIMO, 9 antenna pairs), or dense WiFi grids.
Person-in-WiFi used 2× Intel 5300 sets with 30 subcarriers per link — 270 scalar measurements per frame.
WiVi pushed 100 pkt/s with custom OpenWrt firmware on TP-Link routers, producing 100×114 CSI frames.
Wavey uses a $5 ESP32. This post is about what that hardware actually delivers, where it falls short, and
when it is enough.

## What ESP-CSI exposes

Espressif's [ESP-CSI](https://github.com/espressif/esp-csi) library reports per-packet CSI from the WiFi PHY:

- **Subcarriers:** 52–56 usable data subcarriers per 20 MHz channel (varies by chip and config).
- **Antennas:** typically 1 RX chain on most ESP32 modules (ESP32-S3 with external antenna can do better).
- **Format:** complex IQ per subcarrier — amplitude and phase as reported by the baseband.
- **Rate:** one CSI vector per received WiFi frame. Effective sampling rate = packet arrival rate, typically
  20–200 Hz depending on traffic and configuration.

You do not control the transmitter — you sniff CSI from ambient WiFi traffic or a dedicated AP sending
beacons/data to the node.

## The phase noise floor

On a USRP with external clock sync, phase is stable enough to track sub-millimeter displacement. On COTS
WiFi without sync, CARM showed CFO can reach 100 kHz — phase rotates by tens of radians per packet. On an
ESP32:

- **CFO** (carrier frequency offset) between TX and RX rotates phase by degrees per packet.
- **SFO** (sampling frequency offset) adds a linear phase slope across subcarriers.
- **Packet boundary jitter** introduces random phase steps between consecutive samples.
- **Quantization** in the reported IQ values adds discretization noise.

For macro-motion HAR, **amplitude is the primary signal** on commodity hardware. The biological signal from
breathing (0.1–0.5 Hz, sub-wavelength displacement) sits below the hardware noise floor in raw phase.
Phase sanitization can recover micro-motion in controlled setups — remove CFO/SFO trends, work with
differences, filter outliers. See the [sensing pipeline](/sensing-pipeline/) for the preprocessing stack.

Amplitude variance and spectral features on amplitude spectrograms work well on ESP32 without heroic
calibration. This is why occupancy and motion — which rely on amplitude dynamics — are the practical
starting points.

## Sampling rate constraints

At 50 packets/second, Nyquist says you can resolve signals up to 25 Hz. Walking (1–5 Hz) is well within range.
Breathing (0.1–0.5 Hz) is fine. Heartbeat (0.8–2 Hz) is borderline — you need consistent packet rate and
clean phase. CARM recommended ~800 CSI samples per second for fine activity segmentation; ESP32 deployments
typically run at 20–200 pkt/s depending on traffic. That gap limits fine-grained HAR and impulse detection
(falls, sit-downs) compared to research rigs.

## Single antenna vs research rigs

Research systems with 3×3 MIMO (9 antenna pairs) extract spatial diversity — beamforming, angle of arrival,
multi-person separation. Person-in-WiFi needed 9 TX-RX pairs to make pose estimation tractable. GoPose
reconstructs 2D angle-of-arrival spectra from multi-receiver CSI. A single-antenna ESP32 sees one
superposition of all scatterers. You get:

- **Binary occupancy** — yes, reliably.
- **Motion intensity** — yes.
- **Coarse activity** — yes, with labeled data.
- **Person count** — rough at best.
- **Pose / localization** — no, not without multiple nodes at different geometry.

Multiple ESP32 nodes at different positions partially compensate — each node sees a different superposition.
Three nodes in a room give three perspectives, not one array, but enough spatial diversity for zone-level
detection.

## When cheap hardware is enough

| Task | ESP32 sufficient? |
|------|-------------------|
| Occupancy | Yes |
| Motion detection | Yes |
| Coarse HAR (walk/sit/stand) | Yes, with per-site labels |
| Breathing / micro-presence | Yes, with preprocessing and good placement |
| Fall detection | Possible, high false-alarm risk |
| Person count | Approximate only |
| Pose estimation | No |

The ESP32 is not a limitation for the tasks Wavey targets. It is a limitation for research-frontier tasks
that need dense spatial sampling — and that is an honest scope boundary, not a product failure.

## Further reading

- [Getting started](/getting-started/) — deployment architecture
- [The WiFi channel as a sensor](/posts/introduction-to-wifi-csi/) — what the CSI matrix contains
- [Detection ladder](/detection/) — task feasibility on commodity hardware
