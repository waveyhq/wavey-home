---
title: "WiFi Motion & Activity Detection (No Camera)"
linkTitle: "Motion & activity detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 20
schema_type: "TechArticle"
description: "Detect movement and infer activity from WiFi CSI - WiFi motion detection without a camera, using Wavey's ESP32 sensing nodes and signal processing."
keywords:
  - WiFi motion detection
  - WiFi motion detection without camera
  - WiFi activity recognition
  - human activity recognition WiFi
  - CSI motion detection
faq:
  - question: "Can WiFi detect motion without a camera?"
    answer: "Yes. Movement changes the WiFi multipath environment, shifting the amplitude and phase of the signal across subcarriers. Wavey reads those shifts to detect motion - no camera and no device on the moving person."
  - question: "Can WiFi tell what activity someone is doing?"
    answer: "To a degree. Coarse activities (walking, sitting down, large gestures) produce distinct CSI patterns that can be classified. Fine-grained or multi-person activity recognition is harder and is an active research area."
---

Movement is the easiest thing for WiFi to see. As a person walks, gestures, or shifts position, they
reshape the radio paths between Wavey's nodes - and that shows up immediately in the
[CSI](/glossary/). This makes **WiFi motion detection without a camera** one of Wavey's most robust
capabilities.

## From motion to activity

Raw motion ("something moved") is the foundation. On top of it, Wavey extracts features that capture *how*
the signal changed - speed, direction, and rhythm - which can be used to infer coarse **activities**. This
is the same principle behind academic WiFi activity-recognition work and CMU's
[DensePose-from-WiFi](https://arxiv.org/abs/2301.00250), which recovered full body pose from WiFi alone.

## What you can build

- Motion-triggered lighting and alerts that work in the dark
- Activity-aware [smart-home automation](/use-cases/smart-home-automation/)
- Movement logging for [occupancy analytics](/use-cases/occupancy-analytics/)
- A privacy-friendly layer for [security & intrusion detection](/use-cases/security-intrusion-detection/)

## How it compares

WiFi motion sensing covers a whole space from a couple of nodes, works in darkness and around obstacles,
and never captures an image - unlike a [camera](/comparisons/wifi-sensing-vs-cameras/). For deeper
technical context, read [how Wavey works](/how-it-works/).

## Get started

Jump into [getting started](/getting-started/), read the related post
[WiFi motion detection without a camera](/posts/wifi-motion-detection-without-camera/), or explore live signals in the
[Wavey Console](https://console.wavey.nopejs.me).
