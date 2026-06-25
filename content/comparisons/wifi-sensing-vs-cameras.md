---
title: "WiFi Sensing vs Cameras for Occupancy & Motion"
linkTitle: "WiFi sensing vs cameras"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 10
schema_type: "TechArticle"
description: "WiFi CSI sensing vs cameras for detecting people: privacy, lighting, coverage, and cost compared - and why WiFi sensing is a privacy-first alternative."
keywords:
  - WiFi sensing vs cameras
  - privacy-first occupancy sensing
  - camera alternative occupancy
  - device-free vs camera
faq:
  - question: "Is WiFi sensing more private than a camera?"
    answer: "Yes. A camera captures images that can identify people, which is why it is the highest-privacy-risk option for occupancy sensing. WiFi CSI sensing never captures an image - it reads how bodies disturb radio signals - so it can detect presence and motion without any identifiable visual data."
  - question: "When is a camera still the better choice?"
    answer: "When you specifically need visual detail - identifying who someone is, reading text, or precise pose - a camera is more capable. If you only need to know that a space is occupied or that something moved, WiFi sensing delivers that privately and cheaply."
---

Cameras are the most capable and the most invasive way to sense people. **WiFi CSI sensing** flips that
trade-off: a little less visual detail, dramatically more privacy.

## At a glance

**Privacy**
- *Cameras:* highest risk - capture identifiable images; sensitive in homes, bathrooms, and workplaces.
- *Wavey (WiFi CSI):* no images at all; senses the radio environment, not appearance.

**Lighting & obstacles**
- *Cameras:* need light; blocked by walls and furniture.
- *Wavey:* works in total darkness and penetrates many interior walls.

**Coverage & cost**
- *Cameras:* one device per sightline; cabling and storage add up.
- *Wavey:* a couple of low-cost ESP32 nodes can cover a room, no line of sight required.

**Detail & accuracy**
- *Cameras:* rich detail, identity, precise pose.
- *Wavey:* presence, motion, and coarse activity - anonymous by design.

## Why it matters

Industry guidance consistently rates camera-based people sensing as the **highest privacy risk**, precisely
because images can identify individuals, while non-visual sensors are treated as far lower risk
([PointGrab](https://pointgrab.com/occupancy-sensor-technologies-compared/),
[Terabee](https://www.terabee.com/count-with-caution-security-challenges-of-camera-based-people-counting-devices/)).
For occupancy, motion, and presence - the jobs most "camera" deployments are actually doing - Wavey gets you
there without the footage.

## The bottom line

Choose a camera when you genuinely need to *see*. Choose [Wavey](/how-it-works/) when you need to *know*
a space is occupied or active - privately, cheaply, and in the dark. Explore
[occupancy detection](/use-cases/occupancy-detection/) and [presence detection](/use-cases/presence-detection/),
or see the other [comparisons](/comparisons/).
