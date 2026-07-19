---
title: "Device-Free Occupancy Detection with WiFi CSI"
linkTitle: "Occupancy detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 10
schema_type: "TechArticle"
description: "Binary occupancy from WiFi CSI change-point detection on an empty-room baseline — why it tolerates noise, how it differs from MAC counting, and HVAC control semantics."
keywords:
  - device-free occupancy detection
  - WiFi occupancy sensing
  - CSI change-point detection
  - WiFi baseline occupancy
---

The most useful sensing question is also the easiest to answer reliably: **is anyone here?** Binary occupancy
asks for a single bit — empty or occupied — which tolerates noise far better than counting people or
classifying pose.

## Change-point detection on a baseline

Wavey learns an **empty-room baseline**: the mean amplitude profile, typical subcarrier variance, and phase
structure when no one is in the space. Live CSI compared against this reference uses **change-point
detection** — when the deviation exceeds a threshold sustained over a window, occupancy is declared.

An alternative feature family from the building-energy literature uses **signal tendency index (STI)** —
shape similarity between adjacent CSI amplitude curves — with greedy subcarrier selection to pick frequencies
most responsive to human presence. WiFree reported 99.1% occupancy detection on building-scale deployments.
The mechanism differs from a single variance threshold, but the decision is the same: is the current CSI
pattern consistent with an empty room?

The signal does not need to be clean. It needs to be *different from empty*. A person sitting still perturbs
multipath enough to shift the baseline; breathing adds a periodic micro-Doppler component that an empty room
never produces.

Threshold selection trades sensitivity against false triggers from environmental drift (HVAC cycling, a door
opening). Hysteresis — requiring sustained deviation before flipping state, and sustained return before
clearing — prevents flickering at the boundary.

## Why binary occupancy is the sweet spot

Occupancy is robust because the decision boundary is wide:

- **Noise tolerance** — you do not need to classify *what* happened, only *that something* happened.
- **Single-link sufficiency** — one TX-RX pair can detect presence in the channel; spatial diversity helps
  but is not required.
- **Low label burden** — empty vs occupied is easy to label or self-supervise from known-empty periods.

This is why building energy systems and smart-home HVAC start here. The [detection ladder](/detection/)
places occupancy at rung 2 — the first task that works reliably on commodity hardware.

## Not the same as phone counting

MAC-address analytics count devices, not people. One person with a phone, watch, and laptop registers as
three. Five people sharing one laptop register as one. Device identifiers can constitute personal data under
GDPR.

CSI occupancy reads how bodies disturb the radio field — no identifiers, no device dependency. Everyone in
the space is detected whether or not they carry anything. For analytics semantics, see
[occupancy analytics](/use-cases/occupancy-analytics/).

## Building and HVAC control

Occupancy-aware HVAC does not need person count. It needs a reliable signal that the space is in use —
including when occupants are still. A conference room with six people sitting quietly should not trigger
ventilation shutdown because no one is waving.

CSI occupancy provides that hold signal. Pair it with motion for activity-responsive scenes in
[smart-home automation](/use-cases/smart-home-automation/).

## Further reading

- [Baselines and generalization](/posts/device-free-occupancy-sensing-explained/) — drift, cross-site transfer
- [Sensing pipeline](/sensing-pipeline/) — preprocessing before occupancy inference
- [Getting started](/getting-started/)
