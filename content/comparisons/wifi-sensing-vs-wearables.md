---
title: "WiFi CSI Sensing vs Wearables & Phone Tracking"
linkTitle: "WiFi sensing vs wearables"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 40
schema_type: "TechArticle"
description: "WiFi CSI vs wearables and MAC tracking — device-free body sensing vs opt-in device telemetry, coverage completeness, and data model differences."
keywords:
  - device-free vs wearable
  - WiFi sensing vs phone tracking
  - MAC address tracking privacy
---

Wearables and phone tracking sense **devices**. WiFi CSI senses **bodies**. The coverage and data models
are fundamentally different.

## What gets detected

| | Wearable / phone tracking | WiFi CSI |
|---|--------------------------|----------|
| Signal source | BLE beacon, UWB tag, WiFi probe/MAC | Body perturbation of radio channel |
| Requires cooperation | Yes — person carries device | No — device-free |
| Misses | Anyone without the device | No one in RF coverage |
| Identity | Device ID (often personal data) | Anonymous — no identifiers |

A guest, child, intruder, or elder who forgot their pendant is invisible to device tracking. CSI detects
any body that perturbs the channel.

## Data model

Phone/MAC analytics produce device-level events: "MAC xx:xx connected," "beacon seen." Counting people
requires mapping devices to humans — one person with three devices inflates count; five people sharing one
laptop undercounts.

CSI analytics produce space-level events: "zone occupied," "motion intensity 0.7." No device mapping
needed. See [occupancy analytics](/use-cases/occupancy-analytics/).

## Privacy and compliance

MAC addresses and persistent device identifiers can constitute personal data under GDPR. CSI occupancy
data — zone-level utilization without identifiers — sits in a different regulatory category, closer to
anonymous people-counting beams.

## Maintenance burden

Wearables: charging, pairing, replacement, compliance ("please wear this"). Per-person operational cost
scales with occupancy.

CSI nodes: fixed installation, zero per-person maintenance. Operational cost is per-zone, not per-person.

## When to choose which

**Wearable:** opt-in personal health metrics (heart rate, steps, SpO2), workforce safety with assigned
devices, clinical trials with consenting participants.

**WiFi CSI:** space-level occupancy, elder-care ambient monitoring, security, building analytics — anywhere
you need to sense *everyone in a zone* without asking them to carry anything.

See [elder-care monitoring](/use-cases/elder-care-monitoring/) and
[security & intrusion](/use-cases/security-intrusion-detection/).
