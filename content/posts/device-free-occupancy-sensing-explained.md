---
title: "Baselines, Drift, and Generalization"
date: 2026-06-22T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.7
description: "Empty-room CSI fingerprinting, furniture drift, cross-site domain shift, adaptive baselines, and when to re-baseline — the engineering behind reliable occupancy sensing."
keywords:
  - WiFi CSI baseline
  - occupancy sensing drift
  - cross-site WiFi sensing
  - CSI environment fingerprint
tags:
  - baseline
  - occupancy
  - domain shift
categories:
  - Technical
---

Every occupancy system depends on knowing what "empty" looks like. This post covers how baselines are built,
how they drift, why models trained in one room fail in another, and when to reset.

For the detection mechanism, see [occupancy detection](/use-cases/occupancy-detection/). This is the
stability engineering layer.

## Building an empty-room fingerprint

During a known-empty period (nights, scheduled away times, or initial setup), collect CSI for 5–30 minutes.
Compute:

- **Mean amplitude profile** per subcarrier: \(\bar{A}[k] = \text{mean}_t(|CSI[k,t]|)\)
- **Variance envelope** per subcarrier: typical fluctuation range when empty
- **Phase reference** (sanitized): mean phase structure after CFO/SFO removal
- **Shape similarity (STI)** — for each subcarrier, how much does the amplitude curve's shape change when
  someone enters? Greedy subcarrier selection picks the most responsive frequencies. This is the FreeDetector
  / WiFree approach; WiFree reported 99.1% occupancy on building-scale deployments.

This fingerprint is the **baseline**. Live CSI compared against it powers change-point detection: if the
current window's statistics deviate beyond the empty-room envelope, declare occupied.

The baseline is not a single snapshot. It is a statistical model of empty-room behavior, including normal
environmental noise (HVAC fans, passing cars, neighbor WiFi).

## Sources of drift

Baselines go stale. Common causes:

| Drift source | Effect | Timescale |
|-------------|--------|-----------|
| Furniture moved | Static multipath fingerprint shifts | Instant |
| Door left open | New propagation path added | Instant |
| Seasonal changes | Humidity/temperature affect materials | Weeks |
| New large object | Permanent multipath change | Instant |
| Neighbor WiFi traffic | Interference pattern changes | Hours |
| Node repositioned | Entire channel geometry changes | Instant |

Slow drift (temperature, seasonal) can be tracked with exponential moving averages on the baseline —
adapting during confirmed-empty periods. Fast drift (furniture, doors) requires explicit re-baselining.

## Scene-change detection

Before comparing live CSI to the baseline, check whether the baseline itself is still valid. Monitor the
static channel profile over long empty windows:

- If the mean amplitude profile shifts gradually while occupancy is declared empty, update the baseline
  slowly (adaptive tracking).
- If the profile shifts suddenly, trigger a **scene-change event** — someone moved furniture, or the node
  was bumped. Require explicit re-baselining before occupancy detection resumes.

This prevents false occupancy from a stale baseline and false empty from a shifted environment.

## Cross-site domain shift

Training a classifier or setting thresholds in Room A and deploying in Room B fails because the baseline
fingerprint and the perturbation patterns are both environment-specific. This is not overfitting — it is a
fundamental property of multipath channels.

Cross-site strategies:

1. **Per-site baseline** (mandatory) — every deployment learns its own empty-room fingerprint.
2. **Per-site thresholds** — deviation thresholds tuned on the target environment's noise floor.
3. **Transfer kernel learning** — WiFree used this for crowd counting across rooms (92.8% accuracy); less
   critical for binary occupancy.
4. **Roaming synthesis** — CrossSense's offline model translates source-site CSI into synthetic target-site
   training data from a small calibration set. Primarily for gesture/HAR, but the principle applies.
5. **Fine-tune** feature extractors on 10–20 labeled examples from the target room.

There is no universal baseline. A system that works in every room without per-site calibration does not
exist yet on commodity hardware.

## When to re-baseline

- **After furniture rearrangement** — always.
- **After node repositioning** — always.
- **After prolonged absence** (vacation home, seasonal property) — recommended.
- **When false-alarm rate increases** without explanation — check baseline staleness first.
- **Automatically** — during scheduled known-empty windows (nights, business hours off), if occupancy has
  been clear for N hours.

Automated re-baselining during confirmed-empty periods is the production pattern. Manual re-baselining after
known layout changes is the safety net.

## Further reading

- [Sensing pipeline](/sensing-pipeline/) — preprocessing that stabilizes baselines
- [Occupancy analytics](/use-cases/occupancy-analytics/) — aggregating stable occupancy signals
- [Detection ladder](/detection/) — scene change at rung 1
