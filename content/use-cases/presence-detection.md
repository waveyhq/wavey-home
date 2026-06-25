---
title: "Presence & Breathing Detection with WiFi CSI"
linkTitle: "Presence & breathing detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 30
schema_type: "TechArticle"
description: "Detect a still person - even by their breathing - using WiFi CSI. How Wavey does device-free presence and micro-motion sensing without cameras or wearables."
keywords:
  - presence detection without camera
  - WiFi breathing detection
  - WiFi presence sensing
  - micro-motion sensing
  - vital sign sensing WiFi
faq:
  - question: "Can WiFi detect a person who is sitting still?"
    answer: "Yes - this is where WiFi CSI shines compared to PIR. The tiny, periodic motion of breathing modulates the WiFi signal, so Wavey can detect a still-but-present person that a motion-only sensor would miss."
  - question: "Can WiFi sensing measure breathing rate?"
    answer: "WiFi CSI is sensitive enough to pick up the chest motion of breathing, and research has demonstrated respiration-rate estimation from CSI. Reliability depends on distance, environment, and signal quality."
---

The hardest case for most sensors is a person who isn't moving. **Presence detection** with WiFi CSI solves
it by reading **micro-motion** - the subtle, continuous disturbances a body creates even when sitting still,
including the rise and fall of **breathing**.

## Why CSI can sense breathing

[Channel State Information](/glossary/) captures amplitude and phase across many subcarriers, which makes it
sensitive to motion far smaller than a footstep. The periodic chest movement of respiration produces a
small, rhythmic signature in the CSI. Wavey isolates that rhythm to confirm a person is present even when
they appear motionless - something a single [RSSI](/glossary/) value or [PIR sensor](/comparisons/wifi-sensing-vs-pir/)
cannot reliably do.

## Where presence sensing matters

- Occupancy that doesn't time out on a still person (reading, sleeping, working)
- [Elder-care monitoring](/use-cases/elder-care-monitoring/) where stillness can matter
- Comfort automation that keeps lights and climate on while you're present
- More dependable [occupancy detection](/use-cases/occupancy-detection/)

## A note on accuracy

Micro-motion sensing is more demanding than detecting walking. Range, room layout, and interference all
affect it, and results improve with good node placement and a clean baseline. See
[how Wavey works](/how-it-works/) for the signal-processing details.

## Get started

Try it via [getting started](/getting-started/), or visualize live CSI in the
[Wavey Console](https://console.wavey.nopejs.me).
