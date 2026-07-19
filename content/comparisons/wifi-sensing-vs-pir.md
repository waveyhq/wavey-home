---
title: "WiFi CSI Sensing vs PIR Motion Sensors"
linkTitle: "WiFi sensing vs PIR"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 30
schema_type: "TechArticle"
description: "WiFi CSI vs PIR — infrared motion cone vs radio channel sensing, still-detection mechanism, coverage geometry, and why PIR false-offs happen."
keywords:
  - WiFi sensing vs PIR
  - PIR false off
  - presence vs motion sensor
---

PIR and WiFi CSI both detect people without cameras. They measure completely different physical quantities.

## Sensing mechanism

**PIR** detects changes in infrared radiation within a ~120° cone. A motionless person emits constant IR —
no change, no trigger. After a timeout, the sensor reports empty. This is the "lights off while I'm sitting
still" failure mode — a fundamental property of differential IR sensing, not a firmware bug.

**WiFi CSI** detects changes in radio channel state across the whole room. A still person modulates phase
via breathing (micro-Doppler at 0.1–0.5 Hz). Macro-motion variance may be near zero while periodic
phase modulation confirms presence.

## Coverage geometry

| | PIR | WiFi CSI |
|---|-----|----------|
| Field of view | ~120° cone, line of sight | Whole room from node pair |
| Range | 5–12 m typical | Room-scale (depends on link geometry) |
| Through obstacles | No | Partial (drywall) |
| Darkness | Works (IR-based) | Works (radio-based) |
| Mounting | Aimed at zone | Placed for link geometry |

One PIR per zone, aimed carefully. Two CSI nodes cover a room regardless of furniture layout.

## Event semantics

PIR emits **motion pulses** — edge triggers when IR changes. Automations must infer presence from motion
timeouts, which fail for still occupants.

CSI supports **presence holds** — sustained occupied state while a person breathes in the space. See
[smart-home automation](/use-cases/smart-home-automation/) for event design.

## Cost and power

PIR: $2–5, microwatts standby, decades of battery life. The cheapest motion trigger available.

CSI: $5–10 per ESP32 node, milliwatts (needs power), but provides presence holds PIR cannot.

## When to choose which

**PIR:** cheapest motion trigger, outdoor lighting, zones where still-detection does not matter.

**WiFi CSI:** occupancy-aware HVAC, presence-based automation, elder-care awareness, anywhere "is someone
*here*" matters more than "did something *move*."
