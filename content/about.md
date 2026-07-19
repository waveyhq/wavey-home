---
title: "About Wavey"
date: 2026-06-13T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "Wavey is an open-source WiFi CSI sensing project making spatial awareness private, affordable, and device-free using ESP32 Channel State Information instead of cameras."
keywords:
  - about Wavey
  - WiFi CSI sensing
  - open-source RF sensing
  - device-free sensing
  - privacy-preserving sensing
---

**Wavey** is an open-source **RF sensing** system that uses **WiFi Channel State Information (CSI)** to
observe physical environments - occupancy, motion, and presence - without cameras, wearables, or active
participation from the people being sensed.

## Our mission

Spatial awareness usually means installing cameras (a privacy problem), buying expensive radar or LiDAR
(a cost problem), or asking people to carry phones and tags (a friction problem). Wavey takes a different
path: it reads the WiFi signals that already fill our spaces and turns their tiny disturbances into useful
information.

Our goal is to make spatial sensing **private by design, affordable, and genuinely device-free** using
commodity WiFi hardware. By leveraging WiFi CSI on low-cost ESP32 nodes, Wavey enables occupancy
detection, motion tracking, and behavioral inference while keeping raw signals on hardware you control.

## What makes Wavey different

- **Camera-free and image-free.** Wavey senses the radio environment, not your appearance, so there are no images to leak. See how this compares in [WiFi sensing vs cameras](/comparisons/wifi-sensing-vs-cameras/).
- **Device-free.** People don't need to carry a phone, tag, or wearable to be sensed.
- **Low-cost and open.** Built on ESP32-CSI and a Python pipeline, so anyone can inspect, self-host, and extend it.
- **Real-time.** Sensing nodes stream CSI into a processing pipeline you can watch live in the [Wavey Console](https://console.wavey.nopejs.me).

## The technology, in one paragraph

CSI describes how a WiFi signal propagates across many OFDM subcarriers - far richer than a single RSSI
value. A moving body perturbs those radio paths in consistent, measurable ways, and Wavey converts those
perturbations into spatial and motion information. If you're new to the field, start with
[how Wavey works](/how-it-works/) or the [glossary](/glossary/).

## Where Wavey fits

WiFi sensing has moved from research labs to real products and standards. Academic work such as
Carnegie Mellon's [DensePose-from-WiFi](https://arxiv.org/abs/2301.00250) showed that WiFi signals can
recover detailed human pose, and the [IEEE 802.11bf](https://en.wikipedia.org/wiki/IEEE_802.11bf) amendment
is standardizing WiFi sensing itself. Wavey lives in the open-source, ESP32-CSI corner of this space -
practical, hackable sensing you can run yourself.

## Get involved

Wavey is built in the open and we'd love your help.

- **GitHub:** [github.com/waveyhq](https://github.com/waveyhq)
- **Console:** [console.wavey.nopejs.me](https://console.wavey.nopejs.me)
- **Discord:** [Join the community](https://discord.gg/sxh9r9UTtW)
- **Email:** [mail@wavey.nopejs.me](mailto:mail@wavey.nopejs.me)
