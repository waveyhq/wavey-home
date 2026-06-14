---
title: "Introduction to WiFi CSI Sensing"
date: 2026-06-13T12:00:00Z
draft: false
description: "How WiFi Channel State Information (CSI) can be used to passively sense physical movement and environments without cameras."
---

Welcome to Wavey! In this post, we discuss the basics of WiFi Channel State Information (CSI) and how we use it to observe spatial environments.

### What is WiFi CSI?

Channel State Information (CSI) describes how a signal propagates from the transmitter to the receiver. It represents the combined effects of scattering, fading, and power decay with distance. Unlike simple Received Signal Strength Indicator (RSSI) which only gives a single power value, CSI provides detailed information about each subcarrier in the OFDM WiFi signal.

### How Wavey Uses CSI

Wavey interfaces with low-cost ESP32 chips to extract CSI data in real-time. When a human walks between the WiFi transmitter and receiver, their body causes subtle reflections and phase shifts in the radio frequency (RF) waves. Wavey processes these signal disturbances to:

- Detect physical occupancy.
- Classify movement and activities.
- Map spatial changes without using intrusive cameras or wearables.

Stay tuned for more updates on our open-source hardware designs and Python signal processing pipelines!
