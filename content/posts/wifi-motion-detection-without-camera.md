---
title: "WiFi Motion Detection Without a Camera"
date: 2026-06-18T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "How WiFi motion detection works without a camera - using Channel State Information to sense movement in the dark, around corners, and without tracking devices."
keywords:
  - WiFi motion detection
  - WiFi motion detection without camera
  - motion detection in the dark
  - CSI motion sensing
tags:
  - WiFi CSI
  - motion detection
  - privacy
categories:
  - Use cases
---

Can you detect motion in a room without a camera, without a wearable, and even in complete darkness? With
**WiFi** - yes. Here's how **WiFi motion detection without a camera** actually works, and why it's often a
better fit than the usual sensors.

## The core idea

WiFi signals fill a room, bouncing off walls, furniture, and people. When someone moves, they change those
reflected paths, which shows up as shifts in the WiFi link's [Channel State Information (CSI)](/glossary/) -
the amplitude and phase across many subcarriers. Read those shifts and you've detected motion, no image
required. This is **device-free** sensing: nothing on the person, just the radio environment itself.

## Why no camera is a feature, not a limitation

- **Works in the dark.** Radio doesn't need light, so detection is identical at midnight and noon.
- **Sees around obstacles.** WiFi penetrates many interior walls, covering non-line-of-sight areas a camera can't.
- **Private by design.** There's no footage to leak - a major reason camera-based sensing is rated the highest privacy risk in occupancy guidance.
- **Whole-room coverage.** A couple of [ESP32 nodes](/getting-started/) can watch an entire room instead of one camera angle.

## From "something moved" to "what moved"

Basic motion ("the signal changed") is the robust foundation. Layer on signal processing and machine
learning and you can start to characterize movement - speed, direction, rhythm - and infer coarse
[activities](/use-cases/motion-activity-detection/). The ceiling is high: CMU's
[DensePose-from-WiFi](https://arxiv.org/abs/2301.00250) recovered full human pose from WiFi signals alone.

## How it compares to PIR

The motion sensor in most rooms is a **PIR** detector. PIR is cheap but only reacts to motion within a
narrow cone and goes blind the moment you hold still - the classic "lights off while I'm sitting here"
problem. WiFi sensing covers the whole space and, via [presence detection](/use-cases/presence-detection/),
even notices a still person. See the full [WiFi sensing vs PIR](/comparisons/wifi-sensing-vs-pir/) breakdown.

## Try it with Wavey

Wavey is an open-source system for exactly this. Read [how it works](/how-it-works/), follow
[getting started](/getting-started/), or explore the code on [GitHub](https://github.com/waveyhq).
