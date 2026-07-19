---
title: "WiFi Sensing vs Cameras for Occupancy & Motion"
linkTitle: "WiFi sensing vs cameras"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 10
schema_type: "TechArticle"
description: "WiFi CSI vs cameras — sensing mechanism, data payload, latency, coverage geometry, and when each modality fits occupancy vs identification tasks."
keywords:
  - WiFi sensing vs cameras
  - camera alternative occupancy
  - non-visual occupancy sensing
---

Cameras and WiFi CSI solve overlapping but not identical problems. The choice is about what data you need
from the sensor, not just privacy preferences.

## Sensing mechanism

| | Camera | WiFi CSI |
|---|--------|----------|
| Signal | Visible light (photons) | Radio channel (amplitude + phase per subcarrier) |
| Output | Image frames (pixels) | Channel measurements (complex vectors) |
| Identity | Trivial (face recognition) | Not available by design |
| Pose | Direct (keypoint models) | Research frontier; not on commodity ESP32 |

A camera answers "what does this look like?" CSI answers "how did the radio channel change?"

## Coverage geometry

Cameras need line of sight per zone — one camera per sightline, blind behind furniture and walls. CSI
propagates through drywall and around obstacles; a node pair can cover a whole room without aiming.

Cameras win when you need per-pixel detail in a specific field of view. CSI wins for whole-room, NLOS,
darkness-invariant occupancy and motion.

## Latency and compute

Camera pipelines: capture → decode frame → run vision model → emit event. Typical end-to-end 50–200 ms on
edge hardware, higher if frames go to cloud.

CSI pipelines: capture packet → preprocess → feature extract → infer. Comparable latency on the same host,
but the input is orders of magnitude smaller (kilobytes of complex numbers vs megapixel frames).

## Deployment cost

A room with four sightlines needs four cameras, cabling, storage, and often cloud processing. The same room
needs two ESP32 nodes and a host running the Python pipeline. No video storage, no bandwidth for frame upload.

## When to choose which

**Camera:** identity verification, reading text, precise pose in a controlled FOV, forensic video.

**WiFi CSI:** anonymous occupancy, motion in the dark, whole-room presence, energy analytics, elder-care
awareness without surveillance.

See [occupancy detection](/use-cases/occupancy-detection/) and the [detection ladder](/detection/) for what
CSI delivers without images.
