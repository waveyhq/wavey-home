---
title: "WiFi Motion & Activity Detection"
linkTitle: "Motion & activity detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 20
schema_type: "TechArticle"
description: "Human activity recognition on WiFi CSI — CSI-speed modeling, dual-stream transformers, spectrogram classifiers, and cross-site transfer."
keywords:
  - WiFi motion detection
  - WiFi human activity recognition
  - CSI spectrogram classifier
  - HAR WiFi sensing
---

Movement is the strongest signal in CSI. Limb acceleration creates broadband energy in the 1–5 Hz band,
variance spikes across subcarriers, and the channel changes within a single packet window. Detecting *that
something moved* is straightforward. Classifying *what* happened is where a decade of published systems
disagree on approach.

## From motion to activity

**Motion detection** is a threshold on variance or spectral power — binary, fast, environment-agnostic within
a single deployment.

**Activity recognition (HAR)** has three generations in the literature:

### Generation 1: physics-linked models (CARM, MobiCom 2015)

Before deep learning dominated, CARM built quantitative models:

- **CSI–speed** — amplitude change frequency maps to limb speed via Doppler (path-length change of one
  wavelength = 2π phase shift).
- **CSI–activity** — activities differ by which body parts move at which speeds (legs periodic in walking,
  torso impulse in falling).

Features: PCA denoising, discrete wavelet transform, HMM per activity for state transitions. >96% on COTS
WiFi using **amplitude**, not phase — CFO on commodity hardware makes raw phase unusable for macro-motion
HAR. Still a strong baseline because features encode mechanism, not just correlation.

### Generation 2: spectrogram CNNs

STFT tiles (time × frequency) fed to CNNs. Learns motion textures without explicit speed models. Works when
you have labels; brittle cross-room without adaptation.

### Generation 3: dual-stream transformers (THAT, AAAI 2021)

CSI has two informative axes:

| Stream | What it captures | Missed by LSTM-only |
|--------|------------------|---------------------|
| Channel-over-time | How each subcarrier evolves | — |
| Time-over-channel | Subcarrier correlation at one instant | ✓ |

THAT's Multi-scale Convolution Augmented Transformer (MCAT) processes both streams with Gaussian range
encoding. +2.2 pts accuracy over ABLSTM, 1.8–3.4× faster — because a single temporal sample is too
elementary to represent a CSI pattern.

## The cross-room transfer problem

CrossSense (MobiCom 2018) showed gesture recognition accuracy collapse from >90% in-room to ~20% cross-site
with a single global model. Their fix: a **roaming model** that synthesizes target-environment training data
from a small calibration set, plus a **mixture-of-experts** runtime selector (DTW-based) that routes signals
to specialized models.

Separately, the EI framework (MobiCom 2018) uses adversarial training — feature extractor vs domain
discriminator — to strip environment-specific information before classification.

Without one of these (or per-site fine-tuning), do not deploy a model trained elsewhere. See the
[sensing pipeline](/sensing-pipeline/) for the full adaptation landscape.

## What Wavey targets

Wavey emits motion events (intensity, duration) as the primary output. Coarse activity classes are supported
where labeled data from the deployment environment justifies a classifier. Multi-person 3D pose (CVPR 2024:
~92–125 mm joint error with dense WiFi nodes in a 4×3.5 m rig) is research territory — not ESP32 territory.
See the [detection ladder](/detection/), rung 4.

For building a classifier from scratch, read
[building an activity classifier on CSI](/posts/wifi-motion-detection-without-camera/).

## Further reading

- [Detection ladder](/detection/) — HAR feasibility and limits
- [Security & intrusion](/use-cases/security-intrusion-detection/) — motion as a zone alarm
- [Getting started](/getting-started/)
