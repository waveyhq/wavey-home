---
title: "WiFi Sensing for Security & Intrusion Detection"
linkTitle: "Security & intrusion detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 50
schema_type: "TechArticle"
description: "Detect intruders by the way they disturb WiFi - device-free, camera-free security sensing that works in the dark and around corners. How Wavey enables it."
keywords:
  - WiFi intrusion detection
  - WiFi security sensing
  - motion detection in the dark
  - device-free security
  - WiFi burglar alarm
faq:
  - question: "Can WiFi sensing work as a security sensor in the dark?"
    answer: "Yes. WiFi sensing does not rely on light, so it detects motion in complete darkness and around obstacles where cameras and PIR struggle. An intruder disturbs the WiFi field whether the lights are on or off."
  - question: "Can someone defeat it by not carrying a phone?"
    answer: "WiFi CSI sensing is device-free, so it does not depend on the intruder carrying anything. It detects the body's effect on the signal itself, unlike systems that only track phones or device MAC addresses."
---

A burglar won't carry a tracker for you - which is exactly why **device-free** sensing is valuable for
security. **WiFi CSI sensing** detects an intruder by how their body disturbs the radio field, with no
camera, no light, and no cooperation required.

## Why WiFi sensing suits security

- **Works in the dark.** No dependence on lighting, unlike cameras.
- **Sees around corners.** WiFi penetrates many interior walls, covering non-line-of-sight areas.
- **Device-free.** Detects the person, not their phone - so it can't be dodged by leaving a device behind.
- **No images.** Continuous monitoring without the privacy baggage of cameras.

## How Wavey approaches it

Wavey baselines the protected space and watches for [motion](/use-cases/motion-activity-detection/) and
[presence](/use-cases/presence-detection/) that shouldn't be there. Because it reads
[CSI](/glossary/) rather than pixels, it complements existing alarms as a privacy-respecting layer that
keeps working at night. See [how it works](/how-it-works/) for the detection pipeline.

## Sensible limitations

WiFi sensing tells you *that* something is moving in a space, not *who* it is. For most security use cases
that's the point - but it means WiFi sensing is best paired with other measures for verification rather
than used for identification.

## Get started

Read [how Wavey works](/how-it-works/), then [get started](/getting-started/) or explore the
[GitHub project](https://github.com/waveyhq).
