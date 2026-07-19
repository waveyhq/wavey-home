---
title: "WiFi CSI Detection Ladder: Tasks, Feasibility, and Limits"
linkTitle: "Detection"
date: 2026-06-26T12:00:00Z
lastmod: 2026-07-19T00:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "What WiFi CSI can detect — from occupancy and motion to breathing, falls, and pose. An honest feasibility ladder with signal signatures, failure modes, and what Wavey targets today."
keywords:
  - WiFi detection capabilities
  - WiFi sensing feasibility
  - WiFi human activity recognition
  - WiFi breathing detection
  - WiFi fall detection
  - WiFi pose estimation
---

Not every sensing task is equally reachable with commodity WiFi CSI. This page is the authoritative map:
what each detection level requires in the signal, what breaks it in practice, and where Wavey sits on the
ladder.

For how signals are processed before inference, see the [sensing pipeline](/sensing-pipeline/). For the
underlying physics, see [how it works](/how-it-works/).

## The ladder

Detection difficulty increases as you move from coarse environment change to fine per-person detail. Each
level builds on the ones below it.

### 1. Scene / layout change

**Signal:** slow shift in the static multipath fingerprint — mean amplitude and phase profile across
subcarriers drift when furniture moves, doors open, or large objects enter the channel.

**Fails when:** the change is gradual (seasonal furniture rearrangement) and no explicit re-baseline trigger
exists.

**Wavey:** re-baseline trigger — detects environment drift and prompts or auto-resets the empty-room
reference.

---

### 2. Binary occupancy

**Signal:** deviation from empty-room baseline — any human body perturbs multipath enough to exceed a
change-point threshold. The Berkeley occupancy lineage (FreeDetector, WiFree) uses **signal tendency index
(STI)** — shape similarity between adjacent CSI amplitude curves — rather than a single variance number.
Greedy subcarrier selection picks the frequencies most responsive to human presence. WiFree reported 99.1%
occupancy detection and 92.8% crowd-count accuracy on building-scale deployments with transfer-kernel
learning across rooms. Tolerates noise because the question is binary.

**Fails when:** baseline is stale, multiple people create ambiguous superposition, or the person is behind
heavy shielding.

**Wavey:** core capability — occupancy events against a learned baseline. See
[occupancy detection](/use-cases/occupancy-detection/).

---

### 3. Motion intensity and trajectory

**Signal:** broadband energy increase in the 1–5 Hz band; Doppler spread across subcarriers when limbs
accelerate. Variance and spectral power rise sharply above baseline.

**Fails when:** motion is very slow (creeping) or the person is at the edge of coverage with low SNR.

**Wavey:** motion detection and intensity scoring — the most reliable layer after occupancy. See
[motion & activity](/use-cases/motion-activity-detection/).

---

### 4. Activity recognition (HAR)

**Signal:** distinct time-frequency patterns — but the best systems do not treat HAR as pure pattern matching.
CARM (MobiCom 2015) links CSI amplitude dynamics to limb speeds via a quantitative CSI–speed model, then maps
body-part speeds to activities. THAT (AAAI 2021) adds dual-stream time-over-channel and channel-over-time
features. Both outperform naive LSTM-on-CSI because they respect CSI's 2D structure.

**Fails when:** activities are similar (sit vs stand), labels are scarce, or the model was trained in a
different room without adaptation — cross-site accuracy can drop from >90% to ~20% without roaming synthesis
or adversarial environment stripping.

**Wavey:** coarse activity classes where labeled data exists; not a general-purpose pose engine. See
[motion & activity](/use-cases/motion-activity-detection/) and the
[activity classifier deep-dive](/posts/wifi-motion-detection-without-camera/).

---

### 5. Micro-presence / respiration

**Signal:** narrowband periodic modulation at 0.1–0.5 Hz from chest displacement — a micro-Doppler signature
far smaller than footstep energy. Requires clean phase, good SNR, and a still environment.

An alternative detection pattern treats the spectrogram as an **image**: in-car child-presence detection
(MobiCom 2024) uses CSI power autocorrelation for macro motion and a spectrogram-enhancement + CNN pipeline
for breathing at 5 GHz / 58 subcarriers / 30 Hz — 99% detection, 3% false alarm across 25 vehicle models.
The spectrogram-as-image approach generalizes beyond vehicles when SNR and sampling rate are sufficient.

**Fails when:** range is too great, another person is moving nearby (masking the periodic component), or
phase sanitization is insufficient.

**Wavey:** presence awareness — confirms a still person is in the space. Not a medical vitals device. See
[presence detection](/use-cases/presence-detection/).

---

### 6. Fall events

**Signal:** most published fall detectors treat falls as a *classification* label — train on fall vs non-fall
examples. That assumes falls produce reproducible CSI patterns. They often do not: a fall is an accident, and
its impact varies with surface, body orientation, and furniture.

A better framing (SiFall, SenSys 2022): learn the distribution of **normal, repeatable activities** with an
autoencoder (FallNet). Front-end: CSI amplitude → conjugate multiplication denoising → channel dynamics via
cosine similarity across subcarrier vectors → acceleration threshold (Θ = 2.5 m/s²) → STFT → FallNet
reconstruction. A fall appears as high reconstruction error — an outlier from the person's routine
distribution, not a matched template. Self-supervised incremental learning adapts the normal-activity model
online per environment and per user. Reported 98.3% in real-world tests, 94.1% over 3-day continuous
monitoring with one false alarm.

**Fails when:** only one person in a multi-person home (current systems are largely single-room), training
lacks real elderly fall samples (most datasets use simulated falls), or routine activities (dropping onto a
couch) spike reconstruction error.

**Wavey:** research direction for elder-care — not a certified medical alert system. See
[elder-care monitoring](/use-cases/elder-care-monitoring/).

---

### 7. Person count

**Signal:** superposition of multiple scatterers creates complex interference patterns. With spatial
diversity (multiple nodes at different geometry), rough count estimation is possible.

**Fails when:** people overlap in space, only one TX-RX link exists, or the room geometry creates ambiguous
multipath.

**Wavey:** not a primary target — occupancy yes, exact headcount no. See
[occupancy analytics](/use-cases/occupancy-analytics/) for honest scope.

---

### 8. Pose / keypoints

**Signal:** the human body acts as a distributed scatterer — limb positions change which paths dominate.
The problem is **ill-posed**: Person-in-WiFi (ICCV 2019) notes that 9 TX-RX antenna pairs × 30 subcarriers
yield ~270 scalar equations per frame to recover a high-dimensional body — so the system learns segmentation
masks and joint heatmaps from video labels (OpenPose), not from CSI geometry alone.

Progression in the literature — note the hardware gap at each step:

| System | Hardware | Method | Reported accuracy |
|--------|----------|--------|-------------------|
| Person-in-WiFi (ICCV 2019) | 2× Intel 5300, 3×3 antennas | Multi-task DNN → masks + heatmaps + PAFs | PCK ~78% vs camera 89% |
| WiPose (MobiCom 2020) | Distributed antennas | 3D velocity profile + skeleton prior + RNN | 2.83 cm joint error |
| GoPose (SenSys 2021) | Multi-receiver commodity WiFi | 2D AoA spectrum → CNN spatial + LSTM temporal | 4.5–4.7 cm; works NLOS |
| Person-in-WiFi 3D (CVPR 2024) | Dense WiFi grid, ~4×3.5 m | Transformer set-prediction + Hungarian matching | 91.7 mm (1 person), 125.3 mm (3 people) |
| DensePose-from-WiFi (CMU) | 2 routers, 3×3 antennas | CSI→image modality translation → DensePose-RCNN | UV body regions, multi-person |

The 2.83 cm to 125 mm spread is not contradiction — it reflects different setups, tasks, and person counts.
None of these run on a single-antenna ESP32 at 50 pkt/s.

**Fails when:** commodity hardware (single ESP32 antenna, low packet rate), unconstrained environments, or
scenes with more than a few overlapping bodies.

**Wavey:** not a goal for the open-source ESP32 stack. Pose is demonstrated with research rigs, not $5 nodes.

---

### 9. Identity

**Signal:** gait and habitual motion create person-specific CSI signatures. Two distinct research lines:

- **CSI-native identification (C3SL, AAAI 2018)** — convex shapelet learning on 3-way CSI tensors as gait
  fingerprints. 91% accuracy among 20 people on an OpenWrt IoT platform. Requires enrollment and controlled
  conditions.
- **Cross-modal matching (XModal-ID, MobiCom 2019)** — simulates WiFi CSI from video 3D mesh, compares gait
  features to real through-wall CSI magnitude. 85% same-person accuracy without prior CSI training on that
  person; top-3 ranking 97%. Requires candidate video footage — not identification from CSI alone.

Both are technically feasible in controlled settings; ethically and legally fraught in homes and workplaces.

**Fails when:** the person changes gait (injury, carrying objects), clothing changes body reflectivity, or
regulatory constraints prohibit identification.

**Wavey:** explicitly not a goal. Wavey detects *that someone is present*, never *who*.

---

### 10. Through-wall localization

**Signal:** WiFi penetrates drywall and detects motion in non-line-of-sight conditions — amplitude changes
propagate through walls. XModal-ID demonstrated through-wall gait matching at 85% accuracy using magnitude
CSI only. Precise position reconstruction behind walls requires dense spatial sampling and calibrated
propagation models.

**Fails when:** walls are concrete or metal-shielded, or the task requires centimeter-level position rather
than "motion occurred in this zone."

**Wavey:** zone-level motion detection through interior walls — yes. Precise through-wall mapping — no. See
[security & intrusion](/use-cases/security-intrusion-detection/).

## How to read this ladder

Start at the bottom. Occupancy and motion are engineering problems with known solutions. Presence and HAR
need careful preprocessing and often per-site tuning. Everything above person count is research territory
or explicitly out of scope for Wavey.

The [sensing pipeline](/sensing-pipeline/) explains the processing that makes the lower rungs reliable.
[Getting started](/getting-started/) walks through deploying for your first detection task.
