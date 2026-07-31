---
title: "WiFi Sensing Attacks: LeakyBeam, BFId, and the BFI Side Channel"
date: 2026-07-29T12:00:00Z
lastmod: 2026-07-31T12:00:00Z
draft: false
sitemap:
  priority: 0.8
description: "NDSS 2025 and CCS 2025 proved passive WiFi surveillance is practical — occupancy detection at 20m through walls, identity inference across 197 subjects, all from plaintext beamforming feedback on commodity hardware."
keywords:
  - LeakyBeam
  - BFId
  - beamforming feedback attack
  - WiFi occupancy attack
  - passive WiFi sensing attack
  - BFI side channel
tags:
  - attacks
  - BFI
  - security
  - research
categories:
  - Research
---

Two papers published in late 2025 moved WiFi sensing from a research curiosity to a documented privacy
threat at top security venues. Both exploit the same side channel: **Beamforming Feedback Information (BFI)**
— plaintext packets that WiFi 5 and 6 clients transmit to help access points steer signals.

This post summarizes the attacks, what they demonstrate, and why they matter for RF privacy research.

## What BFI is and why it leaks

WiFi 5 (802.11ac) introduced explicit beamforming: the AP sends sounding frames, the client measures the
channel, and the client responds with **compressed beamforming feedback** describing how the signal arrived
at each antenna. The AP uses this to compute a steering matrix for directional transmission.

BFI packets are:

- **Transmitted in plaintext** — no encryption on the feedback itself
- **Present on ~86% of WiFi 5/6 devices** (LeakyBeam measurement)
- **Digitally encoded** — unlike raw analog CSI, BFI survives wall attenuation better because the
  information is in the packet payload, not the analog signal strength
- **Continuous** — clients send feedback on every sounding interval during normal operation

An attacker with a monitor-mode NIC captures these packets passively. No rogue AP, no association, no
special firmware.

## LeakyBeam: silent occupancy detection (NDSS 2025)

**Paper:** [Lend Me Your Beam: Privacy Implications of Plaintext Beamforming Feedback in WiFi](https://www.ndss-symposium.org/ndss-paper/lend-me-your-beam-privacy-implications-of-plaintext-beamforming-feedback-in-wifi/)

**Attack scenario:** Attacker places a passive sniffer outside a residence. Victim's commercial WiFi clients
(laptops, phones, smart devices) communicate normally with their router. BFI packets leak through walls.
Attacker infers whether anyone is home.

**Results:**

| Metric | Value |
|--------|-------|
| True positive rate (occupancy) | 82.7% |
| True negative rate (empty) | 96.7% |
| Maximum range | 20 meters |
| Detects stationary occupants | Yes (including breathing) |
| Hardware required | Commodity WiFi NIC in monitor mode |

**Why it works when raw CSI fails:** Direct CSI measurements suffer heavy attenuation through walls — SNR
drops, phase noise increases, and the signal becomes unusable at distance. BFI encodes channel information
digitally in the packet. Wall attenuation reduces packet capture rate but does not corrupt the encoded
channel description. The attacker gets fewer packets but each packet retains full spatial information.

**Real-world motivation:** 86% of burglars avoid encounters with occupants. Knowing whether a house is empty
is actionable reconnaissance. LeakyBeam demonstrates this is feasible with a $30 WiFi adapter left in a
car across the street.

**Defense proposed:** AP-side BFI obfuscation — the access point modifies feedback before retransmission,
preserving beamforming utility while destroying occupancy-relevant spatial structure. Minimal hardware
changes; clients unaffected.

## BFId: identity inference at scale (CCS 2025)

**Paper:** [BFId: Identity Inference Attacks Utilizing Beamforming Feedback Information](https://doi.org/10.1145/3719027.3765062)

**Authors:** Julian Todt, Felix Morsbach, Thorsten Strufe — Karlsruhe Institute of Technology (KASTEL)

**Attack scenario:** Attacker passively collects BFI from individuals walking through a WiFi-covered area.
Machine learning model trained on BFI features identifies **who** is present, not just **that** someone is
present.

**Results:**

| Metric | Value |
|--------|-------|
| Identity accuracy | ~99.5% |
| Subjects in dataset | 197 |
| Perspectives tested | Multiple (different walking styles, device locations) |
| Hardware required | Standard WiFi device |

**Two identity signals in BFI:**

1. **Static signal** — per-subcarrier circular-variance profile encoding body geometry (height, build)
2. **Dynamic signal** — temporal autocorrelation of BFI angle sequences encoding gait rhythm

Both are extractable from passive BFI capture without the subject carrying any device or participating in
any way. The [KIT press release](https://www.kit.edu/kit/english/pi_2025_069_the-spy-who-came-in-from-the-wifi-beware-of-radio-network-surveillance.php)
explicitly warns about authoritarian surveillance applications.

**Defense proposed:** WalkAnon — circular-variance equalization on the client side (~2% throughput loss) and
temporal PNSS obfuscation on the AP side (zero throughput loss, no client firmware changes).

## Earlier attacks that established the pattern

These papers predate BFI-specific work but demonstrate the broader CSI attack surface:

| Attack | Venue | What it infers | Method |
|--------|-------|---------------|--------|
| [WindTalker](https://dl.acm.org/doi/10.1145/2976749.2978397) | CCS 2016 | Mobile PINs | Attacker runs public WiFi hotspot, collects CSI during password entry |
| [CSIPose](https://doi.org/10.1109/tmc.2025.3571469) | IEEE TMC 2025 | Human pose skeletons | Passive through-wall pose estimation via commodity WiFi |
| [WiIntruder](https://doi.org/10.1109/tdsc.2025.3642287) | IEEE TDSC 2025 | Disrupts sensing systems | Adversarial perturbation — 72.9% accuracy drop on DL classifiers |

WindTalker is particularly instructive: the attacker needs only a **public WiFi hotspot** and traffic metadata
(IP addresses of payment apps) to know when to analyze CSI. No proximity to the victim, no visual access,
no malware.

## What these attacks share

Every successful WiFi sensing attack exploits the same properties:

1. **CSI/BFI is not encrypted** at the physical layer — unlike packet payloads protected by WPA
2. **Sensing works passively** — the attacker's receiver never needs to transmit
3. **Commodity hardware suffices** — no SDR, no custom firmware, no research-grade equipment
4. **Through-wall operation** — sub-7 GHz signals penetrate drywall, plaster, wooden doors
5. **No consent mechanism exists** — victims cannot opt out of ambient RF leakage

These are not theoretical. LeakyBeam and BFId include real-world evaluations with commercial devices in
residential settings.

## Implications for detection

These attacks define what an RF privacy platform must address:

- **BFI sniffing is invisible to WIDS** — the attacker receives only; no rogue AP, no probe requests
- **Active emitter detection (Layer 1) misses pure passive attacks** — but semi-passive BFI collection still
  requires the victim's devices to transmit feedback, which creates observable traffic patterns
- **Environmental anomaly detection (Layer 3) may catch collateral effects** — the attacker's body and
  equipment perturb the channel even while passively receiving
- **The strongest near-term defense is obfuscation, not detection** — LeakyBeam and BFId both propose
  AP-side countermeasures; see [defenses and limits](/posts/rf-privacy-defenses-and-limits/)

Detection and mitigation are complementary. Detection answers *"is someone watching?"* Mitigation answers
*"make watching ineffective."* Both are needed.

## Further reading

- [RF privacy overview](/posts/rf-privacy-the-flip-side-of-wifi-sensing/) — the research series introduction
- [Detecting unauthorized RF sensing](/posts/detecting-unauthorized-rf-sensing/) — detection layer feasibility
- [802.11bf privacy gap](/posts/ieee-80211bf-privacy-gap/) — why the standard does not fix this
- [LeakyBeam NDSS talk (YouTube)](https://www.youtube.com/watch?v=0dOP8zpyVzA)
- [BFIAttack — CSI reconstruction from BFI (arXiv 2026)](https://arxiv.org/html/2604.04179v1)
