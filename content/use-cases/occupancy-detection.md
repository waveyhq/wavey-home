---
title: "Device-Free Occupancy Detection with WiFi CSI"
linkTitle: "Occupancy detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 10
schema_type: "TechArticle"
description: "Detect whether a room is empty or occupied using WiFi CSI - no cameras, no wearables, no PIR blind spots. How Wavey does device-free occupancy detection."
keywords:
  - device-free occupancy detection
  - WiFi occupancy sensing
  - occupancy detection without camera
  - WiFi CSI occupancy
faq:
  - question: "How is WiFi occupancy detection different from a PIR motion sensor?"
    answer: "A PIR sensor only fires on motion and heat, so a still person can make it report an empty room (a 'false-off'). WiFi CSI sensing reacts to the whole radio environment, so it can detect a present-but-still person by subtle motion like breathing, and it can cover a larger area than a single PIR cone."
  - question: "Does occupancy detection identify who is in the room?"
    answer: "No. Wavey detects that a space is occupied, not who is in it. There are no images and no identity - just presence, which is exactly what most occupancy use cases need."
---

The most fundamental question in spatial sensing is also the most useful: **is anyone here?**
**Device-free occupancy detection** answers it without cameras, without asking people to carry a device,
and without the blind spots of a single motion sensor.

## How Wavey detects occupancy

Wavey learns what a space's WiFi looks like when it's empty - a **baseline** of
[Channel State Information (CSI)](/glossary/). When a person enters, their body perturbs the radio paths
and the live CSI diverges from that baseline. Wavey flags the change as occupancy. Because CSI is sensitive
to even small movements, a person who is sitting still but breathing can still register as present - the
classic weakness of PIR sensors. (See [how it works](/how-it-works/) for the full pipeline.)

## Why it's better than the usual options

- **vs cameras:** no images, so no privacy exposure. [Compare &rarr;](/comparisons/wifi-sensing-vs-cameras/)
- **vs PIR:** no "empty room" false-offs when someone is still; broader coverage per node. [Compare &rarr;](/comparisons/wifi-sensing-vs-pir/)
- **vs wearables/phone presence:** truly device-free - nothing to carry or install on the person. [Compare &rarr;](/comparisons/wifi-sensing-vs-wearables/)

## Where it's used

- Lighting and HVAC control that doesn't switch off on a still occupant
- Meeting-room and desk availability
- Energy savings in homes and offices
- A reliable trigger for [smart-home automation](/use-cases/smart-home-automation/)

## Get started

Read [how Wavey works](/how-it-works/), the related post
[device-free occupancy sensing, explained](/posts/device-free-occupancy-sensing-explained/), then head to
[getting started](/getting-started/) or the [GitHub repo](https://github.com/waveyhq).
