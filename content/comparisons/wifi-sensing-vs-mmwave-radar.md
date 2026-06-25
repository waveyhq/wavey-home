---
title: "WiFi CSI Sensing vs mmWave Radar"
linkTitle: "WiFi sensing vs mmWave radar"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 20
schema_type: "TechArticle"
description: "WiFi CSI sensing vs mmWave radar for presence and motion: privacy, cost, hardware, and accuracy compared - and when each makes sense."
keywords:
  - WiFi sensing vs mmWave radar
  - mmWave vs WiFi CSI
  - radar occupancy alternative
  - low-cost presence sensing
faq:
  - question: "Is mmWave radar more accurate than WiFi sensing?"
    answer: "Often, yes - dedicated mmWave radar is purpose-built for fine motion and ranging and can be very precise. The trade-off is cost and hardware: radar needs specialized, more expensive sensors, while WiFi CSI sensing reuses commodity ESP32 WiFi chips you can deploy cheaply at scale."
  - question: "Are both private?"
    answer: "Yes. Both mmWave radar and WiFi CSI sensing are non-visual and do not capture images, so both are far more privacy-friendly than cameras. They differ mainly on cost, availability, and ecosystem."
---

Both **mmWave radar** and **WiFi CSI sensing** are privacy-friendly, non-visual ways to detect people. The
real difference is **hardware cost and ubiquity**.

## At a glance

**Privacy**
- *mmWave radar:* non-visual, no images - very low privacy risk.
- *Wavey (WiFi CSI):* also non-visual, no images - reads the body's effect on WiFi.

**Hardware & cost**
- *mmWave radar:* dedicated radar modules; more expensive and specialized. Research literature notes radar and LiDAR are "expensive and power-intensive" ([DensePose From WiFi](https://arxiv.org/abs/2301.00250)).
- *Wavey:* commodity ESP32 WiFi chips; cheap, widely available, OTA-upgradable.

**Precision**
- *mmWave radar:* excellent fine-motion sensing and ranging; purpose-built.
- *Wavey:* strong presence/motion; fine-grained tasks are harder but improving.

**Ubiquity**
- *mmWave radar:* extra hardware everywhere you sense.
- *Wavey:* uses the WiFi that's already in the building.

## Why it matters

If you need lab-grade ranging in a single zone, radar is hard to beat. But if you want privacy-friendly
sensing **spread cheaply across a whole space**, WiFi CSI wins on economics - you're reusing the radios you
already have, on hardware that costs a few dollars per node.

## The bottom line

Pick mmWave radar for maximum per-zone precision; pick [Wavey](/how-it-works/) for affordable, scalable,
privacy-first coverage. See it in action for [presence](/use-cases/presence-detection/) and
[occupancy](/use-cases/occupancy-detection/), or browse the other [comparisons](/comparisons/).
