---
title: "WiFi Sensing Glossary"
linkTitle: "Glossary"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
schema_type: "TechArticle"
description: "Plain-English definitions of WiFi sensing terms - CSI, RSSI, OFDM, subcarriers, device-free sensing, multipath, ESP32-CSI, IEEE 802.11bf, and more."
keywords:
  - WiFi sensing glossary
  - Channel State Information definition
  - CSI vs RSSI
  - device-free sensing definition
  - ESP32 CSI
  - IEEE 802.11bf
---

A plain-English glossary of the **WiFi sensing** terms used across this site. For how these fit together,
read [how Wavey works](/how-it-works/).

## Channel State Information (CSI)

A fine-grained measurement of how a WiFi signal travels from transmitter to receiver - its **amplitude and
phase across many OFDM subcarriers**. CSI is far richer than RSSI and is the core signal Wavey uses for
sensing. Because it's sensitive to tiny changes, CSI can pick up motion as small as breathing.

## RSSI (Received Signal Strength Indicator)

A single number describing overall received signal strength. Useful for "how strong is the signal?" but too
coarse for detailed sensing - it collapses the whole channel into one value, unlike [CSI](/glossary/).

## OFDM (Orthogonal Frequency-Division Multiplexing)

The modulation scheme modern WiFi uses, which splits a channel into many narrow frequency slices called
**subcarriers**. CSI is measured per subcarrier, which is what gives it such rich detail.

## Subcarrier

One of the many narrow frequency components of an OFDM WiFi channel. Measuring amplitude and phase across
dozens of subcarriers is what lets CSI sense subtle environmental changes.

## Device-free sensing

Sensing in which the person being detected carries **no device** - no phone, tag, or wearable. Wavey is
device-free: it reads the body's effect on WiFi directly. Contrast with
[wearables and phone tracking](/comparisons/wifi-sensing-vs-wearables/).

## Passive sensing

Sensing that uses signals already present in the environment rather than emitting a special probe. WiFi CSI
sensing is passive in the sense that it leverages ordinary WiFi traffic to perceive a space.

## Multipath

The fact that a radio signal reaches the receiver via many paths at once - direct and reflected. People and
objects change these paths, and those changes are exactly what CSI captures.

## Baseline

A learned reference of what a space's CSI looks like when empty. Wavey compares live signals against the
baseline to decide what changed - the foundation of [occupancy detection](/use-cases/occupancy-detection/).

## ESP32-CSI

The use of low-cost **ESP32** WiFi chips to capture CSI. The entire ESP32 family supports CSI, which makes
it the popular, affordable hardware base for open-source WiFi sensing - including Wavey.

## RF sensing

"Radio-frequency sensing" - inferring information about a physical space from radio signals. WiFi CSI
sensing is one form of RF sensing; radar is another.

## IEEE 802.11bf

The amendment to the WiFi standard dedicated to **WiFi sensing**, formalizing how WiFi devices can sense
their environment. Its existence shows sensing is becoming a native capability of WiFi.

## Occupancy vs presence

**Occupancy** asks "is anyone here?" and is the most robust signal. **Presence** goes further to confirm a
**still** person is there (for example, by [breathing](/use-cases/presence-detection/)), which is where CSI
clearly beats motion-only sensors.
