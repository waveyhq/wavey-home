---
title: "ESP32 CSI Explained: A $5 Chip That Senses a Room"
date: 2026-06-24T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
description: "What ESP32 CSI is and why a low-cost ESP32 can capture WiFi Channel State Information for device-free sensing - the hardware foundation of Wavey."
keywords:
  - ESP32 CSI
  - ESP32-CSI
  - ESP32 WiFi sensing
  - CSI capture ESP32
  - cheap WiFi sensing hardware
tags:
  - ESP32
  - WiFi CSI
  - hardware
categories:
  - Fundamentals
---

One reason **WiFi sensing** has gone from research labs to hobbyist benches is a single, inexpensive chip:
the **ESP32**. Here's what **ESP32 CSI** is and why it's the hardware foundation of open-source WiFi sensing -
including Wavey.

## What is ESP32 CSI?

The ESP32 is a popular, low-cost WiFi microcontroller. Beyond just connecting to networks, it can expose
**Channel State Information (CSI)** - the detailed, per-subcarrier measurement of how a WiFi signal traveled
to it. Espressif's own [ESP-CSI](https://github.com/espressif/esp-csi) project documents this, noting that
CSI is sensitive enough to detect not just walking and running, but subtle actions like **breathing**.

Crucially, CSI is available across the whole ESP32 family - ESP32, S2, S3, C3, C5, C6 and more - so you're
not locked to one board. That breadth, plus the price, is why [ESP32-CSI](/glossary/) is the de facto base
for affordable WiFi sensing.

## Why it's a big deal

- **Cheap.** A sensing node costs a few dollars, so covering a space with several nodes is realistic.
- **Ubiquitous.** ESP32s are everywhere, with a huge community and tooling.
- **Capable.** A dual-core processor can run real-time signal processing and even lightweight ML on-device.
- **Upgradable.** Existing devices can gain CSI features via firmware updates - no new hardware.

## From chip to sensing system

A bare ESP32 streaming CSI is just raw data. The value comes from the pipeline around it: cleaning noisy CSI,
extracting features, and inferring [occupancy](/use-cases/occupancy-detection/),
[motion](/use-cases/motion-activity-detection/), and [presence](/use-cases/presence-detection/) against a
learned baseline. That's exactly what Wavey provides on top of ESP32 nodes - see
[how Wavey works](/how-it-works/) for the end-to-end flow.

## The bigger picture

ESP32 CSI sits inside a fast-moving field: academic milestones like
[DensePose-from-WiFi](https://arxiv.org/abs/2301.00250) and the emerging **IEEE 802.11bf** WiFi-sensing
standard. Affordable hardware is what brings those ideas within reach of everyone.

## Get hands-on

Wavey turns ESP32 CSI into a usable system, in the open. Follow [getting started](/getting-started/), browse
the [GitHub project](https://github.com/trywavey), or visualize live CSI in the
[Wavey Console](https://console.wavey.nopejs.me).
