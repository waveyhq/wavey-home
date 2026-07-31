---
title: "RF Privacy: The Flip Side of WiFi Sensing"
date: 2026-07-28T12:00:00Z
lastmod: 2026-07-31T12:00:00Z
draft: false
sitemap:
  priority: 0.8
description: "WiFi CSI sensing works both ways — the same physics that detects occupancy without cameras also lets an attacker observe a room without consent. What the research says and why RF privacy is an unserved problem."
keywords:
  - RF privacy
  - WiFi CSI surveillance
  - unauthorized WiFi sensing
  - wireless physical security
  - device-free sensing privacy
tags:
  - RF privacy
  - security
  - CSI
  - research
categories:
  - Research
---

Wavey reads WiFi Channel State Information to infer occupancy, motion, and presence — device-free and
camera-free. That is the legitimate use case. The same physics works in reverse: anyone who can observe the
radio environment can infer the same things about you, often without your knowledge and without specialized
hardware.

This post is the first in a research series on **RF privacy** — detecting, auditing, and mitigating
unauthorized RF sensing. It covers why the problem exists, what current wireless security products miss, and
where the research frontier sits.

For how Wavey uses CSI legitimately, see [how it works](/how-it-works/) and the [detection ladder](/detection/).
This series covers the adversarial mirror.

## The same channel, two roles

WiFi sensing exploits a simple fact: a human body perturbs multipath propagation. Amplitude and phase across
OFDM subcarriers shift in measurable, repeatable ways. A baseline empty-room fingerprint plus live deviation
detects occupancy. Motion adds Doppler spread. Stillness leaves a breathing signature in the 0.1–0.5 Hz band.

An attacker does not need Wavey, an ESP32 mesh, or a research lab. They need:

- A WiFi receiver in monitor mode (any laptop, Raspberry Pi, or commodity NIC)
- Access to CSI or an equivalent side channel (BFI, beamforming feedback, pilot symbols)
- Enough SNR to extract signal from noise through walls

No camera. No wearable. No network compromise. The attack surface is the **physics of the channel itself**.

## What wireless security products actually cover

Enterprise WIDS/WIPS — Cisco, Aruba RFProtect, Juniper Mist, Extreme AirDefense — focus on:

- Rogue access points and evil twins
- Deauthentication and disassociation attacks
- Rogue clients and MAC spoofing
- Channel interference and spectrum abuse
- WPA handshake capture and credential attacks

These are network-layer and link-layer threats. They answer: *"Is someone attacking our WiFi infrastructure?"*

They do not answer: *"Is someone using our ambient RF to observe people in this room?"*

That gap is real and growing. As CSI extraction moves from research firmware hacks to standardized APIs
(IEEE 802.11bf) and commodity chipsets (ESP32 family, Raspberry Pi BCM43455), the cost of passive
surveillance drops toward zero.

## Why this matters now

Three converging trends make RF privacy urgent:

**1. Attack papers at top security venues.** NDSS 2025 ([LeakyBeam](https://www.ndss-symposium.org/ndss-paper/lend-me-your-beam-privacy-implications-of-plaintext-beamforming-feedback-in-wifi/))
demonstrated passive occupancy detection at 20 meters through walls using plaintext beamforming feedback.
CCS 2025 ([BFId](https://doi.org/10.1145/3719027.3765062)) showed identity inference across 197 subjects
with ~99.5% accuracy — no special hardware required.

**2. Standards ratification without mandatory privacy.** IEEE 802.11bf standardizes WiFi sensing as a
first-class capability but does not mandate encrypted sensing null data packets the way 802.11az mandates
secure-LTF for ranging. Privacy protection is vendor-dependent. See
[802.11bf and the privacy gap](/posts/ieee-80211bf-privacy-gap/).

**3. Open-source attack tooling.** [Espressif esp-csi](https://github.com/espressif/esp-csi) provides
official CSI capture and sensing demos on ESP32. [goop-veil](https://github.com/kobepaw/goop-veil) is the
first open-source tool aimed at detecting and countering CSI surveillance. The tooling exists on both sides;
the defense ecosystem does not.

## The threat model in one paragraph

Attackers range from **active** (rogue AP, ESP32 transmitter, SDR emitter — relatively detectable via WIDS)
to **passive** (monitor-mode sniffer, receive-only, never transmits — extremely hard to detect directly).
Semi-passive attackers piggyback on legitimate infrastructure: they sniff BFI packets from normal WiFi 5/6
clients or collect CSI from ambient traffic without deploying their own transmitter.

The hardest case — a well-shielded passive receiver — may emit nothing detectable at room scale. Physics sets
a fundamental floor on direct detection. The practical response is layered: detect active emitters, fingerprint
hardware, monitor environmental anomalies, and build RF timelines — not promise omniscient passive-sniffer
detection.

## What an RF privacy platform would do

Instead of building another sensing demo, an RF privacy platform asks different questions:

- **What is transmitting** in this space, on every protocol and frequency?
- **What appeared** that was not there yesterday?
- **Is this RF behavior normal** for this room at this time?
- **How much occupancy information leaks** outside the building perimeter?
- **Can we degrade unauthorized sensing** without breaking legitimate WiFi?

Modules map to research layers:

| Layer | Capability | Near-term feasibility |
|-------|-----------|----------------------|
| 1 | RF inventory — unknown BSSIDs, hidden SSIDs, new MACs | High |
| 2 | RF fingerprinting — identify hardware, not just MAC | Medium |
| 3 | Environmental anomaly — CSI variance, multipath drift | Medium |
| 4 | Distributed mesh — triangulation, confidence scores | Medium (needs multi-node) |
| 5 | Behavioral baseline — alert on new RF sources, polling spikes | High |

Layers 1 and 5 are shippable on ESP32 mesh today. Layer 3 leverages the same baseline expertise Wavey already
uses for occupancy. Passive sniffer detection remains an open research problem.

## Wavey's angle

Wavey understands CSI sensing deeply because we built it — baselines, subcarrier selection, multipath
fingerprints, environment drift. That knowledge is the foundation for detecting when someone else is sensing
you. The open-source CSI stack is proof of expertise; the RF privacy platform is the product direction.

This series will cover:

- [Real attack papers](/posts/wifi-sensing-attacks-leakybeam-bfid/) — LeakyBeam, BFId, WindTalker, CSIPose
- [Detection approaches](/posts/detecting-unauthorized-rf-sensing/) — what works, what does not, and why
- [Defenses and their limits](/posts/rf-privacy-defenses-and-limits/) — obfuscation, metasurfaces, CSI fuzzing
- [802.11bf and the privacy gap](/posts/ieee-80211bf-privacy-gap/) — standards, vendor responsibility, enterprise buyers

## Further reading

- [A Survey on Secure WiFi Sensing Technology (MDPI Sensors, 2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11946332/) — attack/defense taxonomy
- [RF Sensing Security Survey (arXiv, 2025)](https://arxiv.org/abs/2504.10969) — comprehensive overview
- [Awesome-WS-Security](https://github.com/Intelligent-Perception-Lab/Awesome-WS-Security) — 430+ papers, Victim/Weapon/Shield taxonomy
- [Detection ladder](/detection/) — what CSI can detect (the attacker's target list)
