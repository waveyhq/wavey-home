---
title: "Privacy-First Occupancy Analytics with WiFi CSI"
linkTitle: "Occupancy analytics"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 70
schema_type: "TechArticle"
description: "Anonymous occupancy analytics from WiFi CSI — temporal aggregation, utilization metrics, zone heatmaps, GDPR-safe sensing vs MAC tracking, and honest headcount limits."
keywords:
  - occupancy analytics WiFi
  - space utilization sensing
  - anonymous occupancy data
  - WiFi sensing analytics
---

Facilities teams need to know how spaces are actually used — peak hours, dead zones, desk utilization — without
installing cameras or tracking employee devices. CSI analytics provides **anonymous utilization signals**
from the radio environment.

## What to measure

Binary occupancy over time is the robust foundation. Aggregate it:

- **Utilization rate** — fraction of time a zone was occupied during business hours.
- **Peak occupancy periods** — when does this room actually fill up?
- **Dwell time** — how long does occupancy persist once triggered?
- **Zone comparison** — which floors, wings, or desks see traffic?

These metrics drive real decisions: rightsizing meeting rooms, adjusting HVAC schedules, reallocating desk
inventory. None require knowing *who* was present.

## Temporal aggregation

Raw CSI events are noisy at second-level resolution. Analytics pipelines aggregate over minutes to hours:

1. Apply debounce/hysteresis at the event layer (same as [smart-home automation](/use-cases/smart-home-automation/)).
2. Bucket into time windows (15-minute, hourly, daily).
3. Compute utilization = occupied_samples / total_samples per window.
4. Visualize as heatmaps, trend lines, or zone rankings.

Motion intensity adds a secondary axis — high-traffic vs low-traffic occupancy — when
[activity detection](/use-cases/motion-activity-detection/) is available.

## Anonymous CSI vs MAC analytics

MAC-address tracking logs device identifiers. Problems:

- One person, three devices → inflated count.
- Five people, one shared screen → undercount.
- Device identifiers may be personal data under GDPR.

CSI analytics reads how bodies disturb the signal. No identifiers are captured or stored. The output is
zone-level utilization, not individual tracking. For regulatory context, this is closer to a people-counter
beam than a WiFi probe request log.

## Honest limits on headcount

Binary occupancy per zone is reliable. **Exact person count** is not — multipath superposition from multiple
bodies creates ambiguous CSI patterns without spatial diversity. WiFree achieved 92.8% crowd-count accuracy
with transfer-kernel learning on building-scale CSI, but that required calibrated multi-AP infrastructure,
not a single ESP32 node. The [detection ladder](/detection/) places person count at rung 7.

Design dashboards around utilization and presence trends, not "47 people on floor 3." Estimates are possible
with multiple nodes and calibration, but treat them as approximate.

## Further reading

- [Occupancy detection](/use-cases/occupancy-detection/) — the underlying signal
- [Baselines and generalization](/posts/device-free-occupancy-sensing-explained/) — keeping analytics stable
- [Getting started](/getting-started/)
