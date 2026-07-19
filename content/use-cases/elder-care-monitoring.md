---
title: "Elder-Care Monitoring with WiFi Sensing"
linkTitle: "Elder-care monitoring"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 40
schema_type: "TechArticle"
description: "Ambient elder-care sensing with WiFi CSI — anomaly-based fall detection, inactivity monitoring, online adaptation, and non-medical boundaries."
keywords:
  - WiFi fall detection
  - elder care monitoring WiFi
  - aging in place sensing
  - inactivity monitoring WiFi
---

Aging in place needs continuous awareness without cameras in bedrooms and without wearables that get left on
the nightstand. WiFi CSI offers ambient monitoring — presence, movement patterns, and fall-like events —
from nodes already in the home.

## Why fall is not a classification problem

Most early RF fall detectors train a classifier: fall vs walk vs sit. That assumes falls produce reproducible
CSI signatures you can label and match. In practice, falls are accidents — impact varies with surface, body
angle, and what they hit. Labeling enough real elderly falls to train a classifier is ethically and practically
hard; most training data is simulated.

SiFall (SenSys 2022) reframes the problem:

1. **Learn normal** — an autoencoder (FallNet) models the distribution of repeatable daily activities
   (walking, sitting, standing) for this person in this room.
2. **Front-end signal chain** — CSI amplitude (not phase) → conjugate multiplication denoising → channel
   dynamics via cosine similarity across subcarrier vectors → acceleration threshold (Θ = 2.5 m/s²) to
   segment candidate events → STFT → FallNet input.
3. **Detect abnormal** — a fall produces a CSI segment with high reconstruction error because it does not
   match any learned normal pattern.
4. **Adapt online** — self-supervised incremental learning updates the normal-activity model as routines
   evolve, without requiring fall labels.

Reported 98.3% in real-world tests, 94.1% over 3-day continuous monitoring with one false alarm. This is
fundamentally different from spike-plus-immobility heuristics. It handles variable fall kinematics because
anything outside the routine distribution triggers — not because it matched a fall template.

Limitations from the published system: largely single-room operation, simulated fall data, and unvalidated on
subjects over 60. False positives from unusual but non-fall activities (dropping onto a couch) remain a
tuning problem.

## Inactivity monitoring

Less dramatic but equally useful: **prolonged absence of expected motion**. If someone who normally moves
through the kitchen every morning has not triggered motion by noon, that is a signal worth surfacing — built
on [presence detection](/use-cases/presence-detection/) and motion baselines, not fall classification.

Routine patterns emerge from temporal aggregation over days: typical wake time, movement frequency, room
transitions. Deviations from routine are the alert, not a single event classifier.

## What Wavey is not

Wavey is an **awareness layer**, not a medical device:

- No certified fall detection with regulatory clearance.
- No clinical-grade respiration rate or heart rate.
- No identity — the system does not know *who* fell, only *that* an anomaly occurred in a zone.

For the full feasibility picture, see fall detection at rung 6 on the [detection ladder](/detection/).

## Deployment considerations

- **Node placement** — links should cross high-traffic areas (hallway, bedroom doorway) where falls are most
  likely to perturb CSI.
- **Baseline stability** — furniture changes and new occupants require re-baselining.
- **Multi-person homes** — superposition makes per-person fall attribution unreliable without spatial diversity.

## Further reading

- [Presence detection](/use-cases/presence-detection/) — confirming someone is still in the room
- [Motion & activity](/use-cases/motion-activity-detection/) — activity patterns over time
- [Getting started](/getting-started/)
