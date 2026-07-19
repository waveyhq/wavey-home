---
title: "WiFi Sensing for Security & Intrusion Detection"
linkTitle: "Security & intrusion detection"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 50
schema_type: "TechArticle"
description: "Zone-level intrusion detection with WiFi CSI — NLOS motion through drywall, darkness-invariant sensing, device-free vs MAC tracking, and what you learn vs what you cannot."
keywords:
  - WiFi intrusion detection
  - WiFi security sensing
  - through-wall motion detection
  - device-free security
---

Security sensing needs to work when lights are off, cameras are blind, and the intruder carries nothing. WiFi
CSI detects bodies by how they disturb the radio field — device-free, darkness-invariant, and effective
through many interior walls.

## NLOS motion through building materials

WiFi at 2.4 and 5 GHz penetrates drywall, plaster, and wooden doors. An intruder moving in an adjacent
room perturbs multipath paths that traverse the wall — amplitude shifts propagate to the receiver even
without line of sight.

This is zone-level detection: "motion occurred in this area," not "person at coordinates (x, y)." Concrete,
brick, and metal-shielded walls attenuate heavily; interior drywall partitions are the practical case.

The [detection ladder](/detection/) places through-wall localization at rung 10 — partial motion detection
yes, precise reconstruction no.

## Darkness and obstacle invariance

CSI does not depend on ambient light. WiVi (CVPR Workshop 2019) demonstrated this quantitatively: a vision
classifier dropped from 95% to 46.67% accuracy with lights off, while a WiFi CSI classifier held at 95.83%.
Their system disables the vision module when brightness falls below threshold and falls back to WiFi-only —
decision-level fusion, not feature fusion, so one modality failing does not corrupt the other.

A PIR sensor in a dark corner may miss an intruder crawling below its cone. A camera needs illumination or
infrared supplementation. WiFi sensing reads the same signal at midnight and noon.

Coverage is whole-room from a node pair, not a single cone. Obstacles that block line of sight to a camera
may still allow radio paths to reach the receiver.

## Device-free vs MAC tracking

MAC-address security tracks phones and laptops — useless when the intruder carries nothing, or when you want
to detect any body regardless of device ownership. CSI sensing detects the physical perturbation of a human
body on the channel itself.

This also means CSI cannot be defeated by leaving a phone behind. The body is the signal.

## What you learn and what you do not

| Signal | Available | Not available |
|--------|-----------|---------------|
| Motion in a zone | Yes | — |
| Approximate timing | Yes | — |
| Identity | — | No (research: 91% gait ID among 20 enrolled subjects; not Wavey scope) |
| Appearance | — | No |
| Precise position | — | No (without dense node grid) |
| Through concrete walls | — | No |

Wavey baselines the protected space during known-empty periods and flags [motion](/use-cases/motion-activity-detection/)
and [presence](/use-cases/presence-detection/) that violate the baseline. Pair with conventional alarms for
verification — CSI tells you *something moved*, not *who*.

## Further reading

- [Motion & activity detection](/use-cases/motion-activity-detection/) — motion event semantics
- [Detection ladder](/detection/) — through-wall feasibility
- [Getting started](/getting-started/)
