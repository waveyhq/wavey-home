---
title: "Privacy-First Occupancy Analytics with WiFi CSI"
linkTitle: "Occupancy analytics"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 70
schema_type: "TechArticle"
description: "Understand how spaces are used - without cameras or device tracking. How Wavey's WiFi CSI sensing enables anonymous, privacy-first occupancy analytics."
keywords:
  - occupancy analytics
  - people counting privacy
  - space utilization sensing
  - anonymous occupancy data
  - WiFi sensing analytics
faq:
  - question: "Is WiFi CSI analytics the same as WiFi MAC-address tracking?"
    answer: "No, and that distinction matters. MAC-based analytics track device identifiers, which can be personal data under regulations like GDPR. Wavey's CSI sensing reads how bodies disturb the signal, not device identifiers, so it can produce occupancy insight without tracking individuals or their phones."
  - question: "Can it count people?"
    answer: "WiFi CSI can estimate occupancy and detect activity well; precise multi-person counting is harder and an active research area. Wavey focuses on robust occupancy and utilization signals rather than exact head counts."
---

To use space well, you need to know how it's actually used - but most analytics tools either watch people
with [cameras](/comparisons/wifi-sensing-vs-cameras/) or track their phones. **WiFi CSI sensing** offers a
**privacy-first** alternative: anonymous occupancy insight with no images and no device identifiers.

## What you can learn

- When and how often spaces are occupied
- Utilization patterns for rooms, desks, and zones
- Activity and movement trends over time, built on [motion detection](/use-cases/motion-activity-detection/)
- Real [occupancy signals](/use-cases/occupancy-detection/) for energy and facilities decisions

## The privacy advantage

Crucially, Wavey does not rely on **MAC-address tracking**. Device-identifier analytics can constitute
personal data and trigger compliance obligations, and they miscount (one person, three devices; five people,
one shared laptop). Because Wavey reads [CSI](/glossary/) - the body's effect on the signal - it produces
**anonymous** occupancy data by design. Compare the privacy profiles in
[WiFi sensing vs cameras](/comparisons/wifi-sensing-vs-cameras/).

## Honest scope

WiFi sensing is strong for occupancy and utilization trends. Exact people-counting is harder than binary
occupancy, so treat counts as estimates and design dashboards around robust signals.

## Get started

Begin with [how Wavey works](/how-it-works/), then [get started](/getting-started/) or explore data live in
the [Wavey Console](https://console.wavey.nopejs.me).
