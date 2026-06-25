---
title: "Device-Free Occupancy Sensing, Explained"
date: 2026-06-22T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "What device-free occupancy sensing is, why it beats PIR and cameras for 'is anyone here?', and how WiFi CSI makes it private and affordable with Wavey."
keywords:
  - device-free occupancy detection
  - occupancy sensing
  - occupancy sensing without camera
  - WiFi occupancy detection
tags:
  - occupancy
  - WiFi CSI
  - privacy
categories:
  - Use cases
---

"Is anyone in this room?" sounds simple, but the way you answer it has big consequences for **privacy, cost,
and reliability**. **Device-free occupancy sensing** answers it without cameras and without asking anyone to
carry a device.

## What "device-free" means

Device-free means the people being detected carry **nothing** - no phone, badge, or wearable. The sensor
perceives the body's effect on the environment directly. With WiFi, that effect is the change a person
creates in [Channel State Information (CSI)](/glossary/) as their body reshapes the radio paths in a room.

This is fundamentally different from **phone/MAC-address tracking**, which only detects people carrying a
device and relies on identifiers that can count as personal data. Device-free sensing detects *everyone* and
stays [anonymous](/use-cases/occupancy-analytics/).

## Why occupancy is the sweet spot

Of all WiFi-sensing tasks, occupancy is the most robust. You're asking a binary question - empty or
occupied - which tolerates noise far better than precise pose or counting. Wavey learns a
[baseline](/glossary/) of the empty space and flags meaningful deviations as occupancy. Because CSI is
sensitive to [breathing-level micro-motion](/use-cases/presence-detection/), it can even register a person
who's sitting perfectly still - the exact case where PIR sensors fail.

## How it stacks up

- **vs PIR:** no "empty room" false-off on a still person; wider coverage. [Details &rarr;](/comparisons/wifi-sensing-vs-pir/)
- **vs cameras:** no images, no privacy exposure. [Details &rarr;](/comparisons/wifi-sensing-vs-cameras/)
- **vs wearables:** nothing for occupants to carry or charge. [Details &rarr;](/comparisons/wifi-sensing-vs-wearables/)

## Where it pays off

Occupancy-aware lighting and HVAC, meeting-room and desk availability, energy savings, and reliable triggers
for [smart-home automation](/use-cases/smart-home-automation/) - all without a camera in the room.

## Build it with Wavey

Wavey is open source. Start with [how it works](/how-it-works/) and
[occupancy detection](/use-cases/occupancy-detection/), then [get started](/getting-started/) or join us on
[Discord](https://discord.gg/sxh9r9UTtW).
