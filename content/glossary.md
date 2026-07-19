---
title: "WiFi Sensing Glossary"
linkTitle: "Glossary"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
schema_type: "TechArticle"
description: "Technical definitions for WiFi CSI sensing — OFDM subcarriers, multipath, micro-Doppler, phase sanitization, spectrograms, domain shift, HAR, and more."
keywords:
  - WiFi sensing glossary
  - Channel State Information definition
  - CSI vs RSSI
  - phase sanitization
  - human activity recognition WiFi
---

Definitions for terms used across the Wavey documentation. For how they connect, start with
[how it works](/how-it-works/), the [sensing pipeline](/sensing-pipeline/), and the
[detection ladder](/detection/).

## Channel State Information (CSI)

A per-subcarrier measurement of how a WiFi signal traveled from transmitter to receiver — amplitude and
phase at each OFDM frequency slice. The core sensing signal. See [how it works](/how-it-works/).

## RSSI (Received Signal Strength Indicator)

A single scalar: total received power. Too coarse for micro-motion or activity recognition. CSI preserves
the per-subcarrier detail RSSI discards.

## OFDM subcarrier

One narrow frequency component of an OFDM WiFi channel. CSI is measured independently at each subcarrier,
giving dozens of parallel channel measurements per packet.

## Multipath

Radio signals arrive via multiple paths (direct, reflected, scattered). The received channel is a
superposition of these paths. Bodies add and modify paths, changing CSI.

## Micro-Doppler

Small periodic motion (breathing, heartbeat) that modulates CSI phase at low frequencies (0.1–0.5 Hz for
respiration). Far weaker than macro-motion signatures.

## Phase sanitization

Preprocessing that removes hardware-induced phase artifacts (CFO, SFO, per-antenna offsets) before inference.
Mandatory for micro-motion detection. See the [sensing pipeline](/sensing-pipeline/).

## Spectrogram

A time-frequency representation — typically STFT of CSI amplitude or phase over a sliding window. The
standard input representation for deep learning activity classifiers.

## Baseline fingerprint

A statistical model of CSI in an empty room — mean amplitude profile, variance envelope, phase reference.
Live CSI compared against the baseline powers occupancy detection.

## Domain shift

When a model or threshold trained in one environment fails in another because multipath fingerprints differ.
Cross-site generalization is a core engineering challenge. See
[baselines and generalization](/posts/device-free-occupancy-sensing-explained/).

## HAR (Human Activity Recognition)

Classifying what a person is doing (walk, sit, stand, gesture) from CSI patterns, typically via spectrogram
classifiers. Harder than binary occupancy; needs labeled data per environment.

## Beamforming feedback (CBR)

Compressed beamforming reports from standard 802.11ac/ax APs — channel quality feedback used for beam
steering. BeamSense reconstructs multipath from CBR when raw CSI is unavailable. Nearly ubiquitous on
deployed chipsets; raw CSI is not.

## Signal tendency index (STI)

Shape similarity between adjacent CSI amplitude curves. Used in FreeDetector and WiFree for occupancy
detection with greedy subcarrier selection. WiFree reported 99.1% occupancy accuracy on building-scale
deployments.

## Roaming model

An offline model (CrossSense) that synthesizes target-environment CSI training data from source-site
calibration samples, enabling cross-site activity recognition without full relabeling.

## FallNet

An autoencoder (SiFall) trained on normal daily activities. Falls detected as high reconstruction error —
anomaly detection, not fall-template classification.

## C3SL

Convex shapelet learning on 3-way CSI tensors for gait-based identification. 91% among 20 enrolled people
in controlled conditions. Distinct from anonymous occupancy sensing.

## Device-free sensing

The person being detected carries no device. Wavey reads the body's effect on WiFi directly.

## Passive sensing

Using signals already present in the environment rather than emitting a dedicated probe signal.

## ESP32-CSI

CSI capture on low-cost ESP32 WiFi microcontrollers via Espressif's ESP-CSI library. See
[commodity CSI limits](/posts/esp32-csi-explained/).

## IEEE 802.11bf

The WiFi standard amendment for native environment sensing — formalizing sensing alongside data delivery.

## Occupancy vs presence

**Occupancy** — binary: is anyone here? Most robust. **Presence** — confirms a *still* person via
micro-motion (breathing). See the [detection ladder](/detection/).

## Related reading

- [Technical deep-dives](/posts/)
- [Getting started](/getting-started/)
