---
title: "Smart-Home Automation with WiFi Presence Sensing"
linkTitle: "Smart-home automation"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
weight: 60
schema_type: "TechArticle"
description: "Trigger lights, climate, and scenes from real presence - not motion timeouts - using device-free WiFi CSI sensing. How Wavey powers smart-home automation."
keywords:
  - WiFi presence sensing smart home
  - smart home occupancy sensor
  - presence based automation
  - device-free smart home
  - Home Assistant WiFi sensing
faq:
  - question: "Why is WiFi presence sensing better for automation than motion sensors?"
    answer: "Motion sensors turn lights off when you stop moving, so you end up waving at the ceiling. WiFi CSI sensing detects that you are still present - even sitting still - so automations stay on while the room is genuinely occupied and turn off when it is truly empty."
  - question: "Can Wavey integrate with my smart-home setup?"
    answer: "Wavey is open source and emits presence and motion events, which makes it well suited to feed automation platforms and custom integrations. Check the GitHub project for current integration options."
---

The most annoying thing in a "smart" home is lights that switch off while you're sitting still. The fix is
**presence**, not just motion - and that's exactly what **WiFi CSI sensing** provides, device-free.

## Automate on real presence

Wavey detects whether a room is genuinely [occupied](/use-cases/occupancy-detection/) -
including a [still, breathing person](/use-cases/presence-detection/) - and emits events you can wire into
automations:

- Lights that stay on while you're present and off when the room is empty
- Climate and HVAC that follow real occupancy for energy savings
- Scenes that respond to [movement and activity](/use-cases/motion-activity-detection/)
- Whole-home occupancy without a sensor in every fixture

## Why device-free matters at home

No wearables, no phone dependency, and no [cameras](/comparisons/wifi-sensing-vs-cameras/) in living spaces.
A couple of inexpensive ESP32 nodes can cover a room, which is far cheaper than
[mmWave radar](/comparisons/wifi-sensing-vs-mmwave-radar/) in every zone. Because Wavey is open source, you
can adapt the events to your platform of choice.

## Get started

See [how Wavey works](/how-it-works/), follow [getting started](/getting-started/), and join the build on
[Discord](https://discord.gg/m2zUjED3) or [GitHub](https://github.com/trywavey).
