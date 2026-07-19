---
title: "Building an Activity Classifier on CSI"
date: 2026-06-18T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "A practical path from variance thresholds to spectrogram CNNs for WiFi HAR — label collection, training, evaluation, and why transfer learning across rooms fails without adaptation."
keywords:
  - WiFi activity classifier
  - CSI spectrogram CNN
  - human activity recognition WiFi
  - WiFi HAR training
tags:
  - machine learning
  - HAR
  - spectrogram
categories:
  - Technical
---

Detecting that something moved is a threshold problem. Classifying *what* happened is a machine learning
problem. This post walks through building an activity classifier on CSI — from the simplest baseline to a
spectrogram CNN — and explains why the hard part is not the model.

For the use-case framing, see [motion & activity detection](/use-cases/motion-activity-detection/). This is
the engineering walkthrough.

## Level 0: variance threshold

Compute subcarrier variance over a 1-second sliding window. If variance exceeds a threshold tuned on empty-room
data, declare motion. No labels needed. No ML framework needed.

This is occupancy and motion detection — not activity recognition. But it is the foundation every classifier
builds on, and it should work before you add complexity.

## Level 1: handcrafted features + classical classifier

The CARM baseline (MobiCom 2015) is still worth implementing before a CNN:

- PCA denoising on amplitude (subcarrier correlations from body motion; impulse noise rejection)
- Discrete wavelet transform features
- CSI–speed model linking amplitude change frequency to limb speed
- HMM per activity for state transitions

Or simpler per-window statistics:

- Mean and variance of amplitude across subcarriers
- Spectral energy in 1–5 Hz band (from FFT of the amplitude time series)
- Correlation between adjacent subcarriers
- Entropy of the amplitude distribution

Label windows by activity (walk, sit, stand, wave) — collected by a person performing each action in the
target room while CSI is recorded. Train an SVM or random forest. CARM reported >96% on COTS WiFi; a random
forest on handcrafted features typically hits 80–90% in-room.

Accuracy drops sharply in a different room. CrossSense showed gesture recognition collapse from >90% to ~20%
cross-site without adaptation. That is domain shift, and it is the central problem of WiFi HAR.

## Level 2: spectrogram + CNN

Convert each window to a spectrogram — STFT of the amplitude (or sanitized phase) time series per
subcarrier, or a 2D tile of (time × subcarrier) with color = amplitude:

```
Input: CSI window (T timesteps × N subcarriers)
  → STFT along time axis
  → 2D image (frequency × time) or (subcarrier × time)
  → Small CNN (3–4 conv layers + pooling + dense)
  → Softmax over activity classes
```

The CNN learns motion textures that handcrafted features miss — the frequency spread of a stride, the impulse
profile of sitting down. Expect 85–95% accuracy on in-room test data with 50+ examples per class.

Expect 50–60% in a different room without adaptation. THAT (AAAI 2021) showed that adding a time-over-channel
stream alongside channel-over-time improves in-room accuracy by +2.2 points and runs 1.8–3.4× faster than
LSTM-only — but cross-room still needs explicit adaptation. The model learned multipath textures specific to
the training environment, not activity-invariant features.

## The label collection problem

WiFi HAR has no ImageNet. Labels come from:

1. **Manual annotation** — a person performs activities on a schedule; you align timestamps with CSI recordings.
2. **Video-assisted labeling** — a camera in the room (during training only) provides activity labels synced
   to CSI. Person-in-WiFi and MM-Fi (320k frames, 5 modalities, 40 subjects, 27 actions) use this pattern:
   rich supervision during training, WiFi-only at deployment.
3. **Self-supervised pretext tasks** — predict future CSI, contrastive learning on augmented windows. Research
   direction; not yet plug-and-play.

Plan for 30–60 minutes of labeled data per activity per environment. Less than 20 examples per class and
the CNN overfits to noise.

## Why transfer fails and what to do

A model trained in Room A fails in Room B because the static channel \(H(f)\) is different. Motion is
measured as perturbation on top of that static channel. The CNN learns "what walking looks like in Room A's
multipath," not "what walking looks like in general."

Mitigations, in order of practicality:

1. **Collect labels in the target room.** Best accuracy, highest cost.
2. **Fine-tune** the last layers on 10–20 examples per class from the target room.
3. **Roaming synthesis** — train an offline model on source + target calibration data; synthesize target-site
   CSI for fine-tuning. CrossSense boosted cross-site gesture accuracy from ~20% to >90%.
4. **Adversarial environment stripping** — feature extractor vs domain discriminator minimax (EI framework).
5. **Consensus adversarial adaptation** — source and target encoders align to shared invariant space (CADA).
6. **Baseline subtraction** before classification — remove the static channel so the model sees perturbation
   only. Helps, but does not fully solve shift.

There is no free lunch. WiFi HAR without per-site data is a research problem, not a deployment shortcut.

## Evaluation discipline

- **Split by session, not by window.** Random window splits leak temporal correlation and inflate accuracy.
- **Report per-environment accuracy.** In-room and cross-room numbers tell different stories.
- **Measure latency.** Spectrogram + CNN on a Raspberry Pi host should run in < 100 ms per window for
  real-time use.

## Further reading

- [Sensing pipeline](/sensing-pipeline/) — preprocessing before the classifier sees data
- [Detection ladder](/detection/) — where HAR sits on the feasibility scale
- [Motion & activity use case](/use-cases/motion-activity-detection/)
