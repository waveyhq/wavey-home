---
title: "How WiFi CSI Sensing Works"
linkTitle: "How it works"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "A clear explainer of how WiFi CSI sensing works - what Channel State Information is, how a moving body changes WiFi signals, and how Wavey turns ESP32 CSI into occupancy and motion detection."
keywords:
  - how WiFi CSI sensing works
  - WiFi CSI explained
  - Channel State Information
  - CSI vs RSSI
  - ESP32 CSI
  - device-free sensing
  - WiFi sensing pipeline
---

WiFi CSI sensing lets you detect people and motion in a space using only the WiFi signals already
bouncing around it - no cameras, no wearables, and nothing for the people being sensed to carry. This page
explains how that works and how **Wavey** turns it into a practical, open-source system.

## What is WiFi CSI sensing?

Every WiFi link constantly measures the **channel** between a transmitter and a receiver so it can decode
data reliably. That measurement is called **Channel State Information (CSI)**. CSI describes how the signal
actually traveled - its **amplitude, phase, and delay** - across the dozens of frequency slices
(**OFDM subcarriers**) that make up a modern WiFi channel.

Because radio waves reflect off walls, furniture, and people, the CSI you measure is a fingerprint of the
physical environment. Move something in the room and the fingerprint changes. **WiFi CSI sensing** is the
practice of reading those changes and inferring what happened - someone entered, someone moved, someone is
simply present and breathing.

This is a form of **device-free** (or **passive**) sensing: the subject doesn't carry a device. It is the
foundation of Wavey. (New to the terms here? See the [glossary](/glossary/).)

## CSI vs RSSI: why CSI is the useful signal

Most people have seen **RSSI** - the "signal strength" bars on a device. RSSI collapses the whole channel
into one number. CSI keeps the detail:

- **RSSI:** one value per packet. Coarse. Good for "is the signal strong?"
- **CSI:** amplitude and phase for *each* subcarrier. Fine-grained. Good for "what just changed in the room?"

That richness is what makes CSI sensitive enough to pick up not only walking and running, but subtle motion
like breathing - something a single RSSI value cannot reliably do.

## Why a moving body changes WiFi signals

A WiFi signal reaches the receiver along many paths at once - some direct, many reflected. This is called
**multipath**. A human body is mostly water, so it reflects and absorbs radio energy. When a person moves,
they change the lengths and strengths of those paths, which shifts the **amplitude and phase** of the
received signal across subcarriers.

Those shifts are consistent and measurable. With enough signal processing (and, for harder tasks, machine
learning), they can be mapped back to what caused them: presence, direction of motion, activity, even
respiration.

## How Wavey works, end to end

Wavey is built as a pipeline from raw radio to usable events:

1. **Sense (ESP32 nodes).** Low-cost ESP32 sensing nodes capture CSI from WiFi packets. All major ESP32 chips expose CSI, so nodes stay cheap and easy to deploy.
2. **Capture & sync.** Nodes stream timestamped CSI to a host. Multiple nodes can form a small mesh to cover a larger area or improve robustness.
3. **Preprocess.** Raw CSI is noisy. Wavey cleans it - filtering, phase sanitization, and amplitude normalization - to make changes meaningful and comparable over time.
4. **Extract features.** The pipeline derives features that highlight motion and presence (for example, variance over time, subcarrier correlation, and Doppler-like shifts).
5. **Infer.** Features drive detection: occupancy (is anyone here?), motion/activity, and fine presence such as breathing. A baseline of the empty environment helps separate "something changed" from normal drift.
6. **Visualize & act.** Results stream to the [Wavey Console](https://console.wavey.nopejs.me) for real-time visualization, and can trigger automations or analytics.

```text
ESP32 CSI nodes ──▶ capture & sync ──▶ preprocess ──▶ features ──▶ inference ──▶ console / automation
```

## What Wavey can detect

WiFi CSI sensing works on a spectrum from coarse to fine:

- **Occupancy** - is the space empty or occupied? (Most robust.) See [occupancy detection](/use-cases/occupancy-detection/).
- **Motion & activity** - movement, direction, and coarse activity classification. See [motion & activity](/use-cases/motion-activity-detection/).
- **Presence & micro-motion** - detecting a still person by their breathing. See [presence detection](/use-cases/presence-detection/).
- **Scene change** - RF fingerprinting to notice the layout of a space changed.

## Accuracy, range, and honest limitations

WiFi sensing is powerful but not magic. A few realities worth knowing:

- **Environment-specific.** CSI patterns depend on the room. Systems usually learn a baseline for each deployment, and large rearrangements may need re-baselining.
- **Coarse before fine.** Presence and motion are far easier and more reliable than precise pose or identity.
- **Material-dependent through walls.** WiFi penetrates drywall well, dense materials less so.
- **Multi-person is hard.** Separating several people at once is an active research problem.

Wavey is designed to be honest about this: start with the robust signals (occupancy, motion) and build up.

## The research and standards behind it

WiFi sensing is a real, fast-moving field:

- **DensePose-from-WiFi** (Carnegie Mellon, [arXiv:2301.00250](https://arxiv.org/abs/2301.00250)) mapped WiFi amplitude and phase to full human body pose, demonstrating how much information CSI carries.
- **Person-in-WiFi** ([arXiv:1904.00276](https://arxiv.org/abs/1904.00276)) showed fine-grained person perception from WiFi.
- **IEEE 802.11bf** is the WiFi standard amendment dedicated to WiFi sensing, signaling that this is becoming a first-class capability of WiFi itself.
- On the hardware side, Espressif's [ESP-CSI](https://github.com/espressif/esp-csi) project documents CSI capture across the ESP32 family.

Wavey brings these ideas into an open-source system you can actually run.

## Next steps

- [Get started with Wavey](/getting-started/)
- [Explore use cases](/use-cases/)
- [Compare WiFi sensing to cameras, radar, and wearables](/comparisons/)
- [Browse the glossary](/glossary/) or [read the FAQ](/faq/)
- From the blog: [Introduction to WiFi CSI](/posts/introduction-to-wifi-csi/) and [ESP32 CSI explained](/posts/esp32-csi-explained/)
- Common questions: [WiFi CSI sensing FAQ](/faq/)
- Star or contribute on [GitHub](https://github.com/waveyhq)
