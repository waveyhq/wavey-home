---
title: "WiFi CSI Sensing vs mmWave Radar"
linkTitle: "WiFi sensing vs mmWave radar"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
weight: 20
schema_type: "TechArticle"
description: "WiFi CSI vs mmWave radar — RF front-end cost, ranging precision, fine-motion SNR, deployment scale, and when dedicated radar beats commodity WiFi."
keywords:
  - WiFi sensing vs mmWave radar
  - mmWave vs WiFi CSI
  - radar occupancy alternative
---

Both are non-visual RF sensors. The tradeoff is **dedicated ranging hardware vs commodity WiFi reuse**.

## RF front-end

mmWave radar uses a purpose-built transceiver (typically 60 GHz) with chirp modulation designed for
range-Doppler processing. Resolution: centimeter-range distance, sub-Hz Doppler for micro-motion.

WiFi CSI uses the existing 2.4/5 GHz WiFi PHY. Resolution: limited by wavelength (~6 cm at 5 GHz) and
packet-rate sampling. Fine-ranging is not the design goal.

## Fine-motion SNR

Radar front-ends are optimized for detecting sub-millimeter chest displacement — breathing and heartbeat
are first-class signals. ESP32 CSI can detect breathing after phase sanitization, but the hardware noise
floor is higher and SNR is placement-dependent.

For clinical-grade vitals, radar wins. For presence awareness ("someone is still in the room"), CSI is
often sufficient.

## Cost and scale

| | mmWave radar module | ESP32 CSI node |
|---|---------------------|----------------|
| Unit cost | $10–50+ per module | $3–8 per module |
| Dedicated hardware | Yes — radar in every zone | Reuses existing WiFi infrastructure |
| OTA upgrade | Module-specific | Standard ESP32 firmware |
| Ecosystem | Smaller, vendor-specific | Huge (Home Assistant, MQTT, etc.) |

Covering a 10-room office with radar means 10+ dedicated modules. With CSI, a few nodes per room on
hardware you may already have deployed for other purposes.

## When to choose which

**mmWave radar:** per-zone ranging, fall detection with low false-alarm requirements, vital signs in a
clinical-adjacent setting, single-room precision.

**WiFi CSI:** whole-building occupancy at scale, multi-room analytics, smart-home presence holds, security
zone detection — anywhere economics and ubiquity matter more than centimeter ranging.

See [presence detection](/use-cases/presence-detection/) for CSI micro-motion scope.
