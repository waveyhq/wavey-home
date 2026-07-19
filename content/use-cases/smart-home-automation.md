---
title: "Smart-Home Automation with WiFi Presence Sensing"
linkTitle: "Smart-home automation"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 60
schema_type: "TechArticle"
description: "WiFi presence sensing for home automation — presence-hold vs motion-pulse events, debouncing, hysteresis, and why occupancy beats PIR for HVAC and lighting scenes."
keywords:
  - WiFi smart home automation
  - presence based automation
  - occupancy sensor smart home
  - WiFi presence sensing
---

The most common smart-home failure is lights switching off while you are sitting still. The root cause is
using **motion pulses** where **presence holds** are needed. WiFi CSI provides the hold signal.

## Presence-hold vs motion-pulse

| Event type | Semantics | Good for |
|------------|-----------|----------|
| Motion pulse | Something moved, now | Triggering on entry, security alerts |
| Presence hold | Someone is here, still | Keeping lights on, HVAC running |
| Absence clear | Space is empty | Shutting down scenes, energy savings |

PIR emits motion pulses. When motion stops, the pulse ends and the automation assumes empty. CSI occupancy
and [presence detection](/use-cases/presence-detection/) emit holds — the space remains "occupied" while a
still person breathes in it.

Automation platforms should subscribe to hold/clear events, not motion edges, for anything that should
persist while a person is present.

## Debouncing and hysteresis

Raw CSI flickers at detection boundaries — a person near the edge of coverage, environmental noise, or
multipath fading can toggle occupancy rapidly. Production automations need:

- **Entry debounce** — require N consecutive occupied samples before declaring presence (prevents false
  triggers from brief noise).
- **Exit hysteresis** — require M consecutive empty samples before clearing (prevents lights-off while
  you pause between keystrokes).
- **Minimum hold time** — once occupied, maintain hold for at least T seconds regardless of brief dips.

These are application-layer concerns on top of Wavey's raw events. The [sensing pipeline](/sensing-pipeline/)
produces the signal; your automation logic defines the UX.

## HVAC and scene design

Occupancy-aware HVAC needs a sustained signal, not a motion trigger. A home office occupied for three hours
of focused work should not cycle ventilation off because the occupant stopped typing.

Wire occupancy holds to climate zones. Use motion pulses for entry scenes ("arrived home" triggers). Layer
[activity detection](/use-cases/motion-activity-detection/) only when you need behavior-responsive scenes,
not for basic presence.

## Integration surface

Wavey emits structured events — occupancy state, motion intensity, presence confidence — suitable for
Home Assistant, custom MQTT bridges, or direct API integration. The open-source stack on
[GitHub](https://github.com/waveyhq) documents current event schemas.

## Further reading

- [Occupancy detection](/use-cases/occupancy-detection/) — the hold signal source
- [Getting started](/getting-started/) — deployment architecture
- [Comparisons](/comparisons/wifi-sensing-vs-pir/) — why PIR fails for presence holds
