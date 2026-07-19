---
title: "WiFi CSI Sensing Pipeline: Signal Processing and ML"
linkTitle: "Sensing pipeline"
date: 2026-06-26T12:00:00Z
lastmod: 2026-07-19T00:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "TechArticle"
description: "How a WiFi CSI sensing pipeline works — preprocessing, phase sanitization, feature extraction, and machine learning from classical HAR to domain adaptation. The engineering spine behind Wavey."
keywords:
  - WiFi CSI pipeline
  - CSI signal processing
  - WiFi sensing machine learning
  - phase sanitization
  - human activity recognition WiFi
  - domain adaptation WiFi sensing
---

Raw CSI from a commodity WiFi link is not inference-ready. The gap between a research demo and a deployment
that works in someone's living room is almost entirely signal processing and honest ML engineering. This page
covers that layer — what happens between packet capture and a detection event.

For the physics of *why* bodies show up in CSI, see [how it works](/how-it-works/). For what tasks are
feasible at each difficulty level, see the [detection ladder](/detection/).

## Why raw CSI fails

Every CSI sample arrives wrapped in hardware and protocol artifacts:

- **Packet boundaries** — each measurement is tied to one received frame, so timing jitter between packets
  looks like motion even when nothing moved.
- **Carrier frequency offset (CFO)** — slight clock mismatch between transmitter and receiver rotates phase
  unpredictably across packets.
- **Sampling offset (SFO)** — misalignment between the receiver's sample clock and the transmitted symbol
  timing shifts phase per subcarrier.
- **Per-antenna phase offsets** — on multi-antenna setups, each RF chain has its own static phase bias.

These effects dominate the phase of individual subcarriers. On COTS WiFi, carrier frequency offset can reach
100 kHz — enough to rotate phase by tens of radians between consecutive packets. CARM (MobiCom 2015) showed
that for activity recognition on commodity hardware, **CSI signal power (amplitude)** is the reliable path;
raw phase is effectively unusable for macro-motion HAR without specialized hardware sync.

A chest moving 5 mm during a breath produces a signal orders of magnitude smaller than CFO drift. Phase
sanitization — removing linear trends across subcarriers, working with phase differences, pairing antennas
to cancel static offsets — can recover micro-motion in controlled setups. Amplitude still needs outlier
rejection (Hampel filters, moving medians) but tolerates packet jitter far better.

Match preprocessing to the task: occupancy and HAR on ESP32 should lean on amplitude dynamics; respiration
needs sanitized phase, close range, and high SNR.

## Feature families

Once CSI is cleaned, you need representations that highlight motion while suppressing environment drift.

### Time-domain statistics

The simplest features still work as baselines:

- **Subcarrier variance** over a sliding window — spikes when any body part accelerates.
- **Correlation structure** across subcarriers — changes when a scatterer enters or leaves the channel.
- **Entropy** of amplitude distributions — rises with unpredictable multipath change.

These are fast, interpretable, and sufficient for binary occupancy and coarse motion triggers.

### Time-frequency representations

For activity recognition, the literature converges on **spectrograms** — short-time Fourier transforms (STFT)
applied to CSI amplitude or sanitized phase along the time axis, producing a 2D tile of (time × frequency).

Walking produces broadband energy in the 1–5 Hz band. Breathing concentrates near 0.1–0.5 Hz. Sitting down
creates a brief impulse. Convolutional models trained on these tiles can separate activities that look
identical in a single variance number.

The subcarrier dimension adds a third axis: which frequencies moved. Stacking subcarrier spectrograms or
treating (time × subcarrier) as an image is the representation behind most deep learning HAR pipelines.

### Environment fingerprint

An **empty-room baseline** is a reference CSI fingerprint — mean amplitude/phase profile and typical
variance levels when no one is present. Live CSI compared against this baseline powers change-point
detection for occupancy.

Baselines drift when furniture moves, doors open, or HVAC cycles change multipath. Production systems need
either periodic re-baselining, slow adaptive updates, or explicit scene-change detection to trigger a reset.

## Machine learning progression

WiFi sensing ML is not one model — it is a ladder of representations and complexity, built over a decade of
published systems.

### Classical: model the physics first

The foundational approach (CARM, MobiCom 2015) does not jump straight to deep learning. It builds two
quantitative models:

- **CSI–speed model** — amplitude change frequency maps to limb movement speed (one wavelength of path-length
  change = 2π phase rotation; Doppler frequency converts to speed).
- **CSI–activity model** — different activities are characterized by which body parts move at which speeds
  (walking = periodic leg motion; falling = rapid vertical acceleration).

Features come from PCA denoising (exploiting subcarrier correlations from body motion while rejecting impulse
noise from rate adaptation), discrete wavelet transform (DWT), then Hidden Markov Models per activity
capture state transitions (walk → stop → sit). Activity boundaries are detected from PCA eigenvector
smoothness. Reported >96% accuracy on COTS WiFi with >80% on new person and new environment without
retraining — because features encode *why* activities differ physically, not just that they differ
statistically. The system recommends ~800 CSI samples per second; packet-limited ESP32 deployments operate
well below that, which caps fine-grained HAR resolution.

This is still a valid baseline before reaching for a CNN.

### Convolutional models on spectrograms

Treat CSI spectrograms as images. A small CNN learns motion textures — the frequency spread of a stride, the
impulse of a sit-down, the narrowband signature of respiration. The workhorse for HAR once you have labeled
windows.

### Two-stream architectures: time-over-channel *and* channel-over-time

Most early deep HAR models (LSTM on CSI sequences) only extract **channel-over-time** features — how each
subcarrier evolves. They miss **time-over-channel** structure — how subcarriers correlate at a single instant.

THAT (AAAI 2021) runs both streams in parallel through a Multi-scale Convolution Augmented Transformer
(MCAT), with Gaussian range encoding to preserve spatial ordering across subcarriers. Result: +2.2 points
accuracy over the best LSTM baseline, and 1.8–3.4× faster inference — because a single temporal point is too
granular to represent a meaningful CSI pattern; you need both axes.

### Domain adaptation and cross-site transfer

A model trained in one room fails in another because multipath fingerprints differ. Three distinct
approaches from the literature:

**Roaming synthesis (CrossSense, MobiCom 2018).** Train an offline roaming model on a small calibration set
from source and target sites. It synthesizes CSI training samples as if they were collected in the target
environment — then fine-tune activity experts on the synthetic data. For gesture recognition, this boosted
accuracy from ~20% to >90% cross-site. At runtime, a mixture-of-experts selector uses DTW similarity to pick
which expert handles the current signal — one model cannot cover diverse inputs at scale.

**Adversarial environment stripping (EI, MobiCom 2018).** A feature extractor, activity recognizer, and
domain discriminator play a minimax game: the extractor learns features that maximize activity accuracy while
minimizing the discriminator's ability to identify which room or subject produced the sample. Produces
environment- and subject-independent features — validated across WiFi, ultrasound, mmWave, and visible light.

**Consensus adversarial adaptation (CADA, AAAI 2019).** Both source and target encoders embed into a shared
invariant space until they "achieve consensus" — neither room's fingerprint dominates. F-CADA extends this
for few-shot labeled target data. Tested on WiFi gesture recognition under spatial dynamics; relevant when
you have labeled data from several rooms and need one model for a new deployment.

Mitigations that work in practice for Wavey-scale deployments:

- **Per-site baselines** before any classifier runs.
- **Few-shot calibration** — a handful of labeled examples from the target room (BeamSense's cross-domain FSL
  improved accuracy 30–80% over prior transfer methods using beamforming feedback, not raw CSI).
- **Fine-tuning** the last layers on target-room data.

Cross-site generalization remains one of the hardest open problems. Treating it as an afterthought is how
demos become products that only work in the lab they were trained in.

### Beyond raw CSI: beamforming feedback

City-scale measurements show CSI extraction is available on a tiny fraction of deployed WiFi chipsets. Most
commercial APs already transmit **compressed beamforming reports (CBR)** as part of standard 802.11ac/ax
operation — no firmware hack required.

BeamSense (SIGCOMM 2023) maps bidirectional CBR to multipath channels via fingerprint matching, then runs
existing CSI-based algorithms on the reconstructed signal. Reported ~10% accuracy gain over CSI-only methods,
with better cross-environment generalization. This is the commodity path forward as 802.11bf matures — sensing
from what routers already emit, not from ESP32 CSI alone.

### Multimodal fusion and label bootstrapping

WiFi-only labels are expensive. The field bootstraps classifiers by training with richer modalities and
deploying WiFi-only:

**Decision-level fusion (WiVi, CVPR Workshop 2019).** A WiFi CNN (100×114 CSI frames at 100 pkt/s) and a
vision C3D model each produce softmax outputs; a 4-layer DNN fuses at the decision level — not feature level.
Combined accuracy 97.5%; WiFi alone 95.83%. Under lights-off, vision drops to 46.67% while WiFi holds
95.83%. Brightness and SNR thresholds disable each modality independently — useful pattern for any
multimodal deployment where one sensor can fail.

**Cross-modal supervision (MM-Fi, NeurIPS 2023).** 320k+ synchronized frames across WiFi CSI, mmWave,
LiDAR, depth, and RGB; 40 subjects, 27 action classes, 4 environment domains. Train with vision/mmWave
labels, deploy WiFi-only. Not Wavey's default path, but it explains why published HAR numbers often assume
training pipelines you do not have at the edge.

## Wavey's pragmatic stack

Wavey is built as an open pipeline, not a black-box API:

1. **Capture** — ESP32 nodes stream timestamped CSI to a host.
2. **Clean** — outlier rejection, filtering, phase sanitization.
3. **Baseline** — learn and maintain an empty-room reference per deployment.
4. **Features** — variance, spectral energy, and spectrogram tiles depending on the detection task.
5. **Infer** — lightweight models for occupancy, motion, and presence; heavier classifiers where labeled data
   justifies them.
6. **Emit** — events to the [Console](https://console.wavey.nopejs.me) and downstream automations.

What is shipped vs experimental changes as the project matures — the [GitHub repo](https://github.com/waveyhq)
is the source of truth for current capabilities. The architecture is designed so you can swap a variance
threshold for a spectrogram classifier without reworking capture or preprocessing.

## Related reading

- [How WiFi CSI sensing works](/how-it-works/) — the physics layer
- [Detection ladder](/detection/) — what each task requires and how hard it is
- [Getting started](/getting-started/) — deployment architecture
- Deep dives: [building an activity classifier](/posts/wifi-motion-detection-without-camera/) and
  [baselines and generalization](/posts/device-free-occupancy-sensing-explained/)
