---
title: "WiFi CSI Sensing vs Wearables & Phone Tracking"
linkTitle: "WiFi sensing vs wearables"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 40
schema_type: "TechArticle"
description: "WiFi CSI sensing vs wearables and phone/MAC tracking: why device-free sensing needs nothing on the person and avoids device-identifier privacy issues."
keywords:
  - device-free vs wearable
  - WiFi sensing vs phone tracking
  - MAC address tracking privacy
  - no-wearable sensing
faq:
  - question: "What does 'device-free' actually mean?"
    answer: "Device-free means the person being sensed carries nothing - no phone, tag, wristband, or app. Wavey detects the body's effect on WiFi signals directly, unlike wearables or phone/MAC tracking that only work if the person carries a specific device."
  - question: "Isn't WiFi tracking a privacy concern?"
    answer: "Phone/MAC-address tracking can be, because device identifiers may count as personal data. Wavey is different: it reads Channel State Information (how the body disturbs the signal), not device identifiers, so it doesn't track phones or individuals."
---

Wearables and phone-based presence work only when people **carry the right device**. **WiFi CSI sensing** is
**device-free** - it needs nothing on the person at all.

## At a glance

**What the person carries**
- *Wearables / phone tracking:* a watch, tag, or phone with the right app/radio on.
- *Wavey (WiFi CSI):* nothing - the body itself is what's sensed.

**Who it can miss**
- *Wearables:* anyone without the device (guests, kids, visitors, intruders).
- *Wavey:* detects anyone in the space, carried-device or not.

**Privacy model**
- *Phone/MAC tracking:* relies on device identifiers, which can be personal data and miscount (one person, many devices). Industry guidance flags MAC-based tracking as a privacy concern ([PointGrab](https://pointgrab.com/occupancy-sensor-technologies-compared/)).
- *Wavey:* no device IDs; reads [CSI](/glossary/), producing anonymous presence.

**Maintenance**
- *Wearables:* charging, pairing, replacing, remembering to wear.
- *Wavey:* fixed nodes; nothing for occupants to maintain.

## Why it matters

For [elder care](/use-cases/elder-care-monitoring/), the people who most need monitoring are the ones most
likely to forget a wearable. For [security](/use-cases/security-intrusion-detection/), an intruder won't
carry your tag. Device-free sensing covers everyone, which is the whole point.

## The bottom line

Wearables are great for opt-in personal metrics. For sensing a *space* and everyone in it, choose
device-free [Wavey](/how-it-works/). See more [comparisons](/comparisons/) or jump to
[occupancy analytics](/use-cases/occupancy-analytics/).
