---
title: "Introduction to WiFi CSI Sensing"
date: 2026-06-13T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "How WiFi Channel State Information (CSI) can be used to passively sense movement and environments without cameras - the basics behind Wavey."
keywords:
  - WiFi CSI
  - WiFi CSI sensing
  - Channel State Information
  - device-free sensing
tags:
  - WiFi CSI
  - CSI
  - RF sensing
  - ESP32
categories:
  - Fundamentals
---

Welcome to Wavey! In this post we cover the basics of **WiFi Channel State Information (CSI)** and how we use
it to observe spatial environments - without cameras, wearables, or any device on the people being sensed.
Prefer a structured guide? See [how Wavey works](/how-it-works/).

## What is WiFi CSI?

Channel State Information (CSI) describes how a signal propagates from the transmitter to the receiver. It
represents the combined effects of scattering, fading, and power decay with distance. Unlike the simple
**Received Signal Strength Indicator (RSSI)**, which only gives a single power value, CSI provides detailed
information about **each subcarrier** in the OFDM WiFi signal - capturing both **amplitude and phase**.

That detail is the whole point. A single RSSI number can tell you the signal got weaker; CSI can tell you
*how* the channel changed across dozens of frequencies, which is sensitive enough to reveal motion as small
as a breath. (For definitions, see the [glossary](/glossary/).)

## Why a moving body shows up in WiFi

WiFi signals arrive along many paths at once - direct and reflected - a phenomenon called **multipath**. The
human body, being mostly water, reflects and absorbs radio energy. When someone moves, the path lengths and
strengths change, shifting the amplitude and phase recorded in CSI. Those shifts are consistent and
measurable, which is what makes **device-free sensing** possible.

## How Wavey uses CSI

Wavey interfaces with low-cost **ESP32** chips to extract CSI data in real time. When a human walks between
the WiFi transmitter and receiver, their body causes subtle reflections and phase shifts in the radio waves.
Wavey processes these disturbances to:

- Detect physical [occupancy](/use-cases/occupancy-detection/).
- Classify [movement and activities](/use-cases/motion-activity-detection/).
- Sense a still person via [breathing-level micro-motion](/use-cases/presence-detection/).
- Map spatial changes without intrusive cameras or wearables.

For the full pipeline - capture, preprocessing, feature extraction, and inference - see
[how Wavey works](/how-it-works/).

## Where this is going

WiFi sensing isn't science fiction. Carnegie Mellon's [DensePose-from-WiFi](https://arxiv.org/abs/2301.00250)
reconstructed human body pose from WiFi alone, and the **IEEE 802.11bf** standard is formalizing WiFi
sensing as a native capability of WiFi. Espressif's [ESP-CSI](https://github.com/espressif/esp-csi) makes
CSI accessible on cheap hardware. Wavey brings these threads together into an open-source system you can run.

Stay tuned for more on our open-source hardware designs and Python signal-processing pipelines - and come
build with us on [GitHub](https://github.com/waveyhq) and [Discord](https://discord.gg/sxh9r9UTtW).
