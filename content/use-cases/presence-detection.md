---
title: "Presence & Breathing Detection with WiFi CSI"
linkTitle: "Presence & breathing detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 30
schema_type: "TechArticle"
description: "Micro-Doppler presence sensing from WiFi CSI — respiration band physics, SNR requirements, still-person detection, and why PIR cannot see periodic chest motion."
keywords:
  - WiFi presence detection
  - WiFi breathing detection
  - micro-Doppler WiFi
  - still person detection WiFi
---

The hardest sensing case for conventional sensors is a person who is not moving. PIR reports empty. Cameras
work but raise privacy concerns. CSI can detect **micro-presence** — a still body whose chest rises and
falls with respiration.

## Micro-Doppler physics

Breathing displaces the chest wall by a few millimeters at 0.1–0.5 Hz (6–30 breaths per minute). This
creates a **micro-Doppler** modulation on the CSI phase — a narrowband periodic signal far weaker than
footstep energy but structurally distinct from an empty room.

Detection requires:

1. **Clean phase** — CFO/SFO removed via sanitization; raw phase is unusable at this scale.
2. **Sufficient SNR** — the subject should be within a few meters of a link, not at the edge of coverage.
3. **Quiet environment** — another person walking nearby masks the periodic component.

Bandpass filtering in the respiration band (0.1–0.5 Hz) followed by periodicity detection (autocorrelation or
peak finding in the spectrum) confirms presence even when macro-motion variance is near zero.

A complementary approach treats the breathing spectrogram as an **image**: in-car child-presence detection
uses CSI power autocorrelation for macro motion and spectrogram enhancement + CNN for breathing classification
— 99% detection at 5 GHz with 58 subcarriers sampled at 30 Hz. The image-classification path on spectrograms
is increasingly common when packet rate and SNR are sufficient; ESP32 deployments need careful placement and
consistent traffic to reach comparable confidence.

## Still person vs empty room

The decision is SNR-dependent. An empty room has no periodic component in the respiration band. A still
person adds one. The signal-to-noise ratio depends on distance, body orientation relative to the link, and
how much multipath the torso perturbs.

This is why presence is rung 5 on the [detection ladder](/detection/) — achievable with good setup, not
guaranteed everywhere. Wavey treats it as **awareness**, not a medical vitals measurement.

## Why PIR fails here

PIR detects changes in infrared radiation within a narrow cone. A motionless person emits steady IR — no
change, no trigger. The sensor reports empty after its timeout.

CSI does not measure heat. It measures how the radio channel changes. Periodic chest displacement modulates
phase even when the person is otherwise still. This is a fundamental sensing mechanism difference, not a
software improvement on the same hardware.

## Where presence matters

- Occupancy that does not time out on a still reader, sleeper, or worker
- [Elder-care monitoring](/use-cases/elder-care-monitoring/) — confirming someone is in the room
- [Smart-home automation](/use-cases/smart-home-automation/) — lights and climate that hold while you are present

## Further reading

- [Sensing pipeline](/sensing-pipeline/) — phase sanitization before micro-motion inference
- [How it works](/how-it-works/) — macro vs micro-Doppler bands
- [Getting started](/getting-started/)
