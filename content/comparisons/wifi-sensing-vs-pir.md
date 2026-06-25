---
title: "WiFi CSI Sensing vs PIR Motion Sensors"
linkTitle: "WiFi sensing vs PIR"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 30
schema_type: "TechArticle"
description: "WiFi CSI sensing vs PIR motion sensors: why WiFi detects still occupants, covers more area, and avoids the 'empty room' false-off that plagues PIR."
keywords:
  - WiFi sensing vs PIR
  - PIR false off
  - presence vs motion sensor
  - still occupant detection
faq:
  - question: "Why do PIR sensors turn the lights off when I'm still?"
    answer: "PIR sensors only detect changes in infrared from motion. If you sit still, the PIR sees no change and reports the room as empty - the well-known 'false-off' problem. WiFi CSI sensing detects micro-motion like breathing, so it knows you're still there."
  - question: "Is PIR still useful?"
    answer: "Yes - PIR is extremely cheap, simple, and low-power, and it's great as a basic motion trigger. WiFi sensing is the better choice when you need true presence (not just motion), wider coverage, or detection of a still person."
---

PIR (passive infrared) motion sensors are cheap and everywhere - and they share one famous flaw: they only
see **motion**, not **presence**. **WiFi CSI sensing** fixes exactly that.

## At a glance

**Still occupants**
- *PIR:* a motionless person reads as an empty room (the "false-off"). Documented as a real limitation of PIR occupancy sensing ([research overview](https://www.diva-portal.org/smash/get/diva2:2003023/FULLTEXT01.pdf)).
- *Wavey (WiFi CSI):* detects [breathing-level micro-motion](/use-cases/presence-detection/), so a still person still counts.

**Coverage**
- *PIR:* a single cone of view; needs line of sight.
- *Wavey:* whole-room coverage from a node or two; works around obstacles.

**Multiple people / detail**
- *PIR:* binary motion; can't distinguish multiple people.
- *Wavey:* richer signal for motion, activity, and occupancy.

**Cost & power**
- *PIR:* extremely cheap and low-power.
- *Wavey:* low-cost ESP32 nodes, reusing existing WiFi.

## Why it matters

The "lights turning off while I sit still" problem is a PIR limitation, not an automation bug. By sensing
the whole radio environment instead of a single infrared cone, Wavey reports **true occupancy** - ideal for
[smart-home automation](/use-cases/smart-home-automation/) and lighting/HVAC control.

## The bottom line

Use PIR for the cheapest possible motion trigger. Use [Wavey](/how-it-works/) when "is someone *there*?"
matters more than "did something *move*?" Compare the rest in [comparisons](/comparisons/).
