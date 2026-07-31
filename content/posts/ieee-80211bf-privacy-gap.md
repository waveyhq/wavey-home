---
title: "IEEE 802.11bf and the WiFi Sensing Privacy Gap"
date: 2026-07-31T12:00:00Z
lastmod: 2026-07-31T12:00:00Z
draft: false
sitemap:
  priority: 0.8
description: "802.11bf standardizes WiFi sensing but leaves privacy protection vendor-dependent. No mandatory secure-LTF for sensing NDPs, no opt-out mechanism, and BFI remains plaintext — what enterprise buyers and researchers need to know."
keywords:
  - IEEE 802.11bf
  - WiFi sensing standard
  - 802.11bf privacy
  - WLAN sensing security
  - ISAC privacy
tags:
  - 802.11bf
  - standards
  - privacy
  - research
categories:
  - Research
---

IEEE 802.11bf was ratified in September 2025. It standardizes WiFi sensing — making CSI-based occupancy,
motion, and activity detection a first-class capability in commercial WiFi hardware. For the sensing industry,
this is a milestone. For RF privacy, it is an escalation: the attack surface just became standardized.

This post covers what 802.11bf enables, what privacy protections it includes (and omits), and what
organizations evaluating WiFi sensing should demand from vendors.

For the attack papers that motivated privacy concerns, see
[WiFi sensing attacks](/posts/wifi-sensing-attacks-leakybeam-bfid/). For detection and defense approaches,
see the [RF privacy series overview](/posts/rf-privacy-the-flip-side-of-wifi-sensing/).

## What 802.11bf standardizes

802.11bf defines **WLAN Sensing** — using WiFi infrastructure to measure the wireless channel and infer
properties of the environment:

- **Sensing procedures** — null data packet (NDP) sounding, channel measurement exchange between STAs and APs
- **Sensing measurement feedback** — standardized format for reporting channel state to sensing initiators
- **Sensing applications** — motion detection, presence sensing, activity recognition (application layer
  left to implementers)
- **Multi-band support** — sensing across 2.4 GHz, 5 GHz, and 6 GHz

Most deployed WiFi 6 APs already emit beamforming feedback sufficient to reconstruct multipath. 802.11bf
formalizes the sensing-specific exchange on top of this existing capability. See
[how it works](/how-it-works/) for the physics and [glossary](/glossary/) for terminology.

## What the standard says about privacy

The 802.11bf overview paper ([IEEE Communications Magazine](https://doi.org/10.1109/mcom.001.2200806)) is
explicit about security and privacy concerns:

> A malicious eavesdropper could easily capture the CSI reports and track the user's activity without
> authorization. Worse yet, end-users may not even realize they are under attack when using
> radiofrequency-based monitoring solutions.

The standard identifies several privacy requirements:

1. **Opt-out** — individuals should be able to avoid being monitored by nearby WiFi devices
2. **Encrypted training fields** — protect sensing NDP preambles so only trusted devices can estimate CSI
   (following the 802.11az secure-LTF precedent for ranging)
3. **Robust identification** — subject identification for opt-out must resist spoofing and adverse channel
   conditions
4. **Adversarial robustness** — sensing classifiers must resist ML-based evasion

However, the standard **does not mandate** these protections. Key gaps:

### No secure-LTF for sensing NDPs

IEEE 802.11az (ranging/localization) adopted a **secure Long Training Field** — the transmitter generates a
protected LTF sequence pre-shared with authorized receivers. Eavesdroppers cannot estimate the channel from
overheard packets because they do not know the training sequence.

802.11bf does **not** require secure-LTF for sensing null data packets. Sensing measurements can be
transmitted in the clear. The confidentiality of sensing signals varies by vendor implementation.

[SECNORA's analysis](https://secnora.com/blog/wi-fi-sensing-and-the-ieee-802-11bf-privacy-gap/) notes this
explicitly: unlike 802.11az, 802.11bf leaves sensing signal confidentiality undefined at the standard level.

### BFI remains plaintext

802.11bf does not address beamforming feedback information — the side channel exploited by LeakyBeam (NDSS
2025) and BFId (CCS 2025). BFI packets from WiFi 5/6 clients continue to be transmitted unencrypted during
normal operation, independent of 802.11bf sensing procedures.

An enterprise deploying 802.11bf-compliant sensing APs gains standardized measurement exchange — but every
WiFi client in the building still leaks BFI that enables passive occupancy and identity inference.

### Sensing report overhearing

802.11bf defines sensing measurement feedback from responder to initiator. A malicious party can collect
these reports and infer target behavior directly — no need to perform their own channel estimation. The
standard acknowledges this ("sensing report overhearing") but has not finalized which cryptographic or
physical-layer protection to adopt.

Proposed approaches include encrypted channel measurement feedback and masked TRN sequences (similar to
802.11az secure-LTF), but none are mandatory in the ratified standard.

### No consent mechanism

There is no standardized way for a person to discover they are being sensed, opt out, or receive notification.
802.11bf sensing operates at the infrastructure level — the AP initiates sensing, the environment responds.
Occupants are sensed passively.

## What vendors say vs. what research shows

WiFi sensing companies position their products as privacy-preserving:

- [Origin Wireless](https://www.originwirelessai.com/how-wifi-sensing-protects-your-privacy/) — randomized
  coding, encryption, no PII collection, GDPR/CCPA compliance
- [Cognitive Systems](https://cognitivesystems.com/) — "privacy-first by design, no cameras, no wearables"

These claims address **the sensing vendor's data handling** — what Origin or Cognitive do with CSI after
capturing it. They do not address **third-party passive sniffing** of BFI or CSI from the victim's own
devices. LeakyBeam and BFId demonstrate that an attacker needs no relationship with the sensing vendor —
they exploit plaintext side channels from commodity hardware.

Enterprise buyers evaluating 802.11bf-capable devices should assess:

- Does the vendor encrypt sensing NDP training fields?
- Does the vendor obfuscate or protect BFI?
- What sensing data is stored, where, and for how long?
- Is there an opt-out mechanism for occupants?
- What firmware security and update practices apply?
- Can sensing be disabled without breaking WiFi connectivity?

## The regulatory landscape

No federal law in the US explicitly prohibits private WiFi CSI sensing. Relevant precedents:

- **Kyllo v. United States (2001)** — through-wall thermal imaging constitutes a Fourth Amendment search,
  but only constrains **government** actors, not private surveillance
- **BIPA (Illinois)** — biometric privacy law; RF-based gait/identity inference may fall under "biometric
  identifier" depending on interpretation
- **CCPA/CPRA (California)** — may apply if sensing data constitutes "personal information"
- **GDPR (EU)** — device-free sensing of identifiable individuals likely requires legal basis and data
  protection impact assessment

Policy and enforcement frameworks have not kept pace with the capability. This is both a risk (surveillance
without legal consequence) and an opportunity (first mover in compliance-oriented RF privacy tooling).

## What researchers recommend

The BFId authors (CCS 2025) argue:

> Future work on wireless sensing must account for the threats that their approaches introduce, and actively
> pursue mitigation strategies. The planned standardization of WiFi sensing in 802.11bf should strongly
> consider adding effective privacy protection, or abandon beamforming entirely.

The 802.11bf overview authors recommend:

- Encrypt training fields of data packets so only trusted devices can estimate CSI
- Develop opt-out mechanisms with spoofing-resistant subject identification
- Test sensing systems against active jamming and passive shielding adversaries
- Build adversarial robustness into DL-based sensing classifiers

The [Wireless Sensing Security survey (IEEE ComSurvT 2026)](https://arxiv.org/abs/2412.03064) identifies
"the lag in protection mechanisms" as a key challenge and highlights "proactive defense strategies" as a
future direction — aligning with an RF privacy platform that monitors before attacks succeed.

## Implications for Wavey research

802.11bf ratification changes the threat landscape:

1. **More devices will emit sensing-compatible signals** — standardized NDP sounding increases the RF
   sensing surface area in every 802.11bf-compliant deployment
2. **BFI leakage persists independently** — 802.11bf does not fix the side channel that LeakyBeam and BFId
   exploit
3. **Enterprise demand for RF privacy tooling will grow** — compliance officers evaluating 802.11bf devices
   need assessment frameworks that do not exist yet
4. **Detection + audit becomes more valuable** — as sensing becomes standardized, the ability to detect
   unauthorized sensing and document RF exposure for compliance is differentiated

Wavey's research direction — RF inventory, timeline, anomaly detection, privacy scoring — addresses the gap
that 802.11bf leaves open.

## Further reading

- [RF privacy overview](/posts/rf-privacy-the-flip-side-of-wifi-sensing/)
- [WiFi sensing attacks](/posts/wifi-sensing-attacks-leakybeam-bfid/)
- [Detecting unauthorized RF sensing](/posts/detecting-unauthorized-rf-sensing/)
- [Defenses and limits](/posts/rf-privacy-defenses-and-limits/)
- [802.11bf overview (arXiv)](https://doi.org/10.48550/arxiv.2207.04859)
- [802.11bf toward ubiquitous sensing (arXiv)](https://arxiv.org/pdf/2103.14918)
- [IEEE ComSoc Best Readings: WIFS](https://www.comsoc.org/publications/best-readings/wireless-information-forensics-security)
