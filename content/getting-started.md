---
title: "Getting Started with Wavey"
linkTitle: "Get started"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "Deploy Wavey — ESP32 CSI node architecture, Python pipeline layers, detection task selection, and how to follow development on GitHub."
keywords:
  - getting started Wavey
  - ESP32 CSI setup
  - WiFi CSI sensing deployment
  - open-source WiFi sensing
faq:
  - question: "Is Wavey ready to install today?"
    answer: "Wavey is in active development. This page covers architecture; github.com/waveyhq has current setup steps and release status."
  - question: "What will I need?"
    answer: "CSI-capable ESP32 nodes, a WiFi environment, and a host running the Python pipeline. Start with one node; add more for coverage."
  - question: "How can I contribute?"
    answer: "Star the GitHub repo, join Discord, or email mail@waveyhq.dev. Firmware, pipeline, integrations, and docs all welcome."
---

Wavey is an open-source WiFi CSI sensing system. This page covers deployment architecture — for signal
processing detail, see the [sensing pipeline](/sensing-pipeline/). For what to detect first, see the
[detection ladder](/detection/).

> Setup steps live in the [GitHub repository](https://github.com/waveyhq) — they change as the project matures.

## Three-layer architecture

```text
[ ESP32 CSI nodes ]  ->  [ Python pipeline ]  ->  [ console / automations ]
   capture CSI            preprocess + features       visualize + emit events
```

1. **Sensing nodes (ESP32).** Capture [CSI](/glossary/) from ambient WiFi traffic. See
   [commodity CSI limits](/posts/esp32-csi-explained/) for hardware constraints.
2. **Analysis pipeline (Python).** Outlier rejection, amplitude features (primary on ESP32), phase
   sanitization for micro-motion, baseline learning, inference. See the
   [sensing pipeline](/sensing-pipeline/) for the processing stack.
3. **Console and integrations.** Live visualization at [console.waveyhq.dev](https://console.waveyhq.dev);
   events for [automation](/use-cases/smart-home-automation/) and [analytics](/use-cases/occupancy-analytics/).

## Before you begin

- One or more CSI-capable ESP32 modules (any ESP32 family chip)
- A WiFi environment with traffic the nodes can sniff
- A host machine for the Python stack

## Pick your first detection task

Start at the bottom of the [detection ladder](/detection/) — the most robust tasks first:

1. **Occupancy** — [change-point detection on a baseline](/use-cases/occupancy-detection/)
2. **Motion** — [variance and spectral features](/use-cases/motion-activity-detection/)
3. **Presence** — [micro-Doppler in the respiration band](/use-cases/presence-detection/)

Each level adds preprocessing requirements and tuning complexity. Get occupancy working before attempting HAR.
Every deployment needs its own empty-room baseline — cross-site transfer without per-site calibration
remains an open problem on commodity hardware.

## Follow development

- **Code:** [github.com/waveyhq](https://github.com/waveyhq)
- **Console:** [console.waveyhq.dev](https://console.waveyhq.dev)
- **Community:** [Discord](https://discord.gg/sxh9r9UTtW)
- **Contact:** [mail@waveyhq.dev](mailto:mail@waveyhq.dev)

Background reading: [how it works](/how-it-works/), [glossary](/glossary/), [FAQ](/faq/).
