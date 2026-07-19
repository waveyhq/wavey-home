---
title: "Getting Started with Wavey"
linkTitle: "Get started"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "Get started with Wavey, the open-source WiFi CSI sensing system. The architecture, the ESP32-CSI approach, and how to follow development and contribute."
keywords:
  - getting started Wavey
  - ESP32 CSI setup
  - WiFi CSI sensing project
  - open-source WiFi sensing
  - how to build WiFi sensing
faq:
  - question: "Is Wavey ready to install today?"
    answer: "Wavey is an open-source project in active development. This page explains the architecture and approach so you can follow along and contribute. For the latest code, releases, and setup status, follow the GitHub project at github.com/waveyhq."
  - question: "What will I need to run Wavey?"
    answer: "At a high level: one or more ESP32 sensing nodes (any CSI-capable ESP32 works), a WiFi environment to sense, and a host machine to run the Python analysis pipeline. Exact hardware and steps are tracked in the GitHub repository."
  - question: "How can I contribute to Wavey?"
    answer: "Star and watch the GitHub repo, join the Discord community, and reach out at mail@wavey.nopejs.me. Contributions to firmware, the signal-processing pipeline, integrations, and docs are all welcome."
---

Wavey is an **open-source WiFi CSI sensing** system, built in the open. This guide explains how Wavey is
put together and how to follow along - so you understand the approach before you dive into the code.

> Wavey is in active development. For the current code, hardware list, and step-by-step setup, follow the
> [GitHub repository](https://github.com/waveyhq) - that's the source of truth as the project evolves.

## How a Wavey deployment is structured

At a high level, Wavey has three layers (see [how it works](/how-it-works/) for the signal details):

```text
[ ESP32 CSI nodes ]  ->  [ real-time pipeline ]  ->  [ console / automations ]
   capture CSI            clean + extract +            visualize, alert,
   from WiFi              infer presence/motion        and integrate
```

1. **Sensing nodes (ESP32).** Inexpensive ESP32 modules capture [Channel State Information](/glossary/) from WiFi. The whole ESP32 family supports CSI, so nodes are cheap and easy to source.
2. **Analysis pipeline (Python).** A host ingests CSI, removes noise, extracts features, and infers occupancy, motion, and presence against a learned baseline of the empty space.
3. **Console & integrations.** Results stream to the [Wavey Console](https://console.wavey.nopejs.me) for live visualization and can drive [smart-home automation](/use-cases/smart-home-automation/), alerts, or [analytics](/use-cases/occupancy-analytics/).

## What you'll want before you begin

- **One or more CSI-capable ESP32 nodes.** Start with one to experiment; add nodes for coverage and robustness.
- **A WiFi environment to sense.** Wavey reads the signals already present in a space.
- **A host for the pipeline.** Any machine that can run the Python analysis stack.

(Exact models, wiring, and commands live in the repo so they stay accurate as Wavey matures - we
intentionally don't duplicate fast-moving setup steps here.)

## Plan your first sensing task

The easiest wins come first. We recommend starting with the most robust capability and building up:

1. **Occupancy** - [is the room occupied?](/use-cases/occupancy-detection/)
2. **Motion** - [detect movement and activity](/use-cases/motion-activity-detection/)
3. **Presence** - [sense a still person by breathing](/use-cases/presence-detection/)

## Follow development and get involved

- **Code & releases:** [github.com/waveyhq](https://github.com/waveyhq)
- **Live console:** [console.wavey.nopejs.me](https://console.wavey.nopejs.me)
- **Community:** [Discord](https://discord.gg/sxh9r9UTtW)
- **Contact:** [mail@wavey.nopejs.me](mailto:mail@wavey.nopejs.me)

New to the field? Read [how Wavey works](/how-it-works/), skim the [glossary](/glossary/), browse the
[FAQ](/faq/), read posts like [ESP32 CSI explained](/posts/esp32-csi-explained/), or learn more [about Wavey](/about/).
