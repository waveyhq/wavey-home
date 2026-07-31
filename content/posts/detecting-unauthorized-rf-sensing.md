---
title: "Detecting Unauthorized RF Sensing: A Layered Approach"
date: 2026-07-30T12:00:00Z
lastmod: 2026-07-31T12:00:00Z
draft: false
sitemap:
  priority: 0.8
description: "Five detection layers for unauthorized RF sensing — from emitter inventory to behavioral baselines. What works today on ESP32 mesh, what remains open research, and why passive sniffer detection is the hardest problem."
keywords:
  - detect WiFi sensing
  - RF sensing detection
  - unauthorized CSI collection
  - RF anomaly detection
  - wireless intrusion detection
tags:
  - detection
  - RF privacy
  - security
  - research
categories:
  - Research
---

If someone is using WiFi signals to observe your space, can you detect them? The answer depends heavily on
**what kind of attacker** — active emitters are tractable; pure passive receivers may be undetectable. This
post maps five detection layers, assesses each against published research, and identifies what is shippable
on commodity hardware today.

For the attacks these layers defend against, see
[WiFi sensing attacks](/posts/wifi-sensing-attacks-leakybeam-bfid/). For the obfuscation-based alternative,
see [defenses and limits](/posts/rf-privacy-defenses-and-limits/).

## Layer 1: RF emitter inventory

**Detect RF devices that transmit.**

The most concrete, near-term layer. Scan for:

- Unknown BSSIDs and hidden SSIDs
- Probe requests and probe responses from unrecognized MACs
- Beacon anomalies (unexpected intervals, vendor OUIs associated with sensing hardware)
- New MAC addresses appearing in the environment
- Channel hopping patterns inconsistent with normal WiFi clients
- Espressif devices operating in mesh or CSI-extraction modes

**Hardware:** ESP32 nodes in promiscuous mode, RTL-SDR for sub-GHz protocols, existing WIDS infrastructure
for WiFi management frames.

**What it catches:** Rogue APs, rogue ESP32 sensing nodes, SDR transmitters, active radar emitters. Any
attacker who must **transmit** to collect CSI (e.g., injecting sounding frames, operating a rogue hotspot for
WindTalker-style attacks).

**What it misses:** Pure passive BFI sniffing (LeakyBeam). The attacker's NIC receives but never transmits.
WIDS sees nothing because there is nothing to see at the management-frame level.

**Feasibility:** High. Shippable on ESP32 mesh with existing promiscuous-mode APIs. This is the foundation
of an RF timeline — *"Device X appeared on channel 6 at 14:32."*

## Layer 2: RF fingerprinting

**Identify hardware, not just MAC addresses.**

MAC addresses are trivially spoofed. RF fingerprinting extracts hardware-intrinsic characteristics from the
transmitted waveform:

- IQ imbalance
- Carrier frequency offset
- Phase noise profile
- Power amplifier nonlinearity
- Clock skew

These features persist even when the attacker rotates MAC addresses, allowing detection of **returning
hardware** that presents as a new device.

**Research foundation:** Mature literature in IEEE TIFS and IEEE Communications Magazine. See the
[RF fingerprinting survey](https://arxiv.org/abs/2201.00680) and
[Junqing Zhang's RFFI work](https://junqing-zhang.github.io/research/rffi/rffi-pub-topics/) for WiFi-specific
methods including channel-robust extraction (Channel2Channel, IEEE JSAC 2025).

**What it catches:** Spoofed MACs on known surveillance hardware. Rogue ESP32 boards that reappear with
different addresses. SDR platforms with distinctive transmitter impairments.

**What it misses:** Passive receivers (no waveform to fingerprint). Novel hardware with no baseline entry.

**Feasibility:** Medium. Requires labeled hardware datasets and per-environment calibration. Useful as a
Layer 1 enhancement — when a "new" MAC exhibits a known RF fingerprint, confidence increases. Not standalone.

## Layer 3: Environmental anomaly detection

**Detect the effects of sensing, not the sensor.**

Instead of finding the attacker, monitor whether the RF environment itself behaves abnormally:

- Sudden CSI variance spikes without corresponding occupancy
- Abnormal channel occupancy patterns
- Unexpected RSSI distribution shifts
- Multipath structure changes inconsistent with known activity
- Persistent low-amplitude RF perturbations (attacker's body/equipment in the channel)

**Methods:** Isolation Forest, autoencoders, temporal transformers, Bayesian changepoint detection — applied
to CSI statistics, spectrum occupancy, and cross-node correlation from a distributed mesh.

**What it catches:** Scenarios where the attacker's presence or equipment **changes the channel** even if
the attacker is receive-only. A person sitting in a car with a monitor-mode laptop still perturbs local
multipath. Sustained CSI polling at unusual rates (active sensing nodes) creates detectable traffic patterns.

**What it misses:** A well-positioned passive sniffer that adds no multipath perturbation and collects BFI
from traffic the victim's own devices generate. LeakyBeam's attacker at 20 meters may be invisible to
in-room anomaly detectors.

**Feasibility:** Medium. Leverages the same baseline and change-point expertise Wavey uses for occupancy
detection — but inverted. Instead of detecting human perturbation, detect perturbation that **does not match
known occupancy**. Promising research direction; not yet validated against BFI-specific passive attacks.

## Layer 4: Distributed sensing mesh

**Multiple nodes for triangulation, localization, and confidence.**

A single ESP32 sees one channel geometry. A mesh of nodes sees:

- Spatial correlation of anomalies across locations
- Direction-of-arrival estimates from phase differences
- Confidence scores that increase with node agreement
- Source localization for active emitters

**What it catches:** Active emitters (Layers 1+4 combined enable triangulation). Environmental anomalies
visible from multiple vantage points. RF heatmaps showing unexpected signal sources.

**What it misses:** Passive sniffers outside the mesh coverage area (e.g., LeakyBeam attacker across the
street). Mesh nodes inside the building cannot detect a receiver that never transmits and sits beyond the
building envelope.

**Feasibility:** Medium. Requires multi-node deployment — which Wavey's architecture already supports. High
value for enterprise (offices, data centers, secure facilities) where node density is feasible.

## Layer 5: Behavioral baseline

**Build normal RF behavior; alert on deviations.**

Long-term RF timeline for a space:

- Expected WiFi clients and their traffic patterns
- Normal BLE, Zigbee, and IoT device inventory
- Typical beacon frequencies and channel usage
- Baseline CSI polling rates from legitimate sensing systems

Alert when:

- A new RF source appears that was never seen during baseline period
- Beacon frequency changes on a known device (firmware update vs. compromise)
- CSI extraction signatures appear (Espressif mesh coordination, rapid channel scans)
- Hidden network detected where none existed before
- Unusual timing patterns in management frame sequences

**What it catches:** Everything Layers 1 and 3 catch, plus **slow changes** — an attacker who appears
gradually, a sensing node deployed over weeks, a neighbor's new ESP32 project that starts polling your channel.

**What it misses:** An attacker who mimics normal traffic patterns from the start (unlikely for CSI
collection, which has distinctive signatures). Pure passive BFI sniffing with zero local footprint.

**Feasibility:** High. This is an RF SIEM — inventory plus timeline plus alerting. The most shippable
component of an RF privacy platform and the closest to what [goop-veil](https://github.com/kobepaw/goop-veil)
implements today.

## The passive sniffer problem

The hardest case: attacker with a monitor-mode NIC, receive-only, well-shielded, positioned outside the
building.

**Can they be detected directly?** Current research says probably not.

- LO leakage exists but is microvolts at meters — indistinguishable from ambient noise in a WiFi-noisy office
- No management frames to capture — WIDS blind
- No RF fingerprint — nothing transmitted
- No channel perturbation if the receiver is outside the sensing mesh

**Can they be detected indirectly?** Partially.

- If they piggyback on **your** infrastructure (BFI from your clients), the attack leaves no local trace —
  the victim's own devices generate the leaked signal
- If they deploy **active** sensing (ESP32 transmitter, rogue AP), Layers 1, 2, and 5 catch them
- If their **body or equipment** perturbs the local channel, Layer 3 may flag an anomaly

Honest product framing: *"We detect active and semi-active RF sensing. Passive collection from outside the
building remains an open research problem with fundamental physical limits."*

## Recommended detection stack

For a practical RF privacy deployment, prioritize:

| Priority | Layer | Deliverable |
|----------|-------|-------------|
| Now | 1 + 5 | RF inventory + timeline with alerts |
| Next | 3 | Anomaly detection on CSI/multipath statistics |
| Then | 2 | RF fingerprinting for spoofed-device detection |
| Later | 4 | Multi-node localization and confidence scoring |
| Research | Passive sniffer | Publish or perish; do not productize |

The fastest path to a demo: **"RF timeline for a room"** — every emitter that appeared, every anomaly in
CSI polling or beacon behavior, with alerts like *"Unknown WiFi observer signature detected on channel 6 for
47 minutes."*

## Further reading

- [RF privacy overview](/posts/rf-privacy-the-flip-side-of-wifi-sensing/)
- [WiFi sensing attacks](/posts/wifi-sensing-attacks-leakybeam-bfid/)
- [Defenses and limits](/posts/rf-privacy-defenses-and-limits/)
- [goop-veil](https://github.com/kobepaw/goop-veil) — open-source detection + countermeasure research preview
- [Awesome-WS-Security](https://github.com/Intelligent-Perception-Lab/Awesome-WS-Security) — full literature database
