---
title: "WiFi CSI Sensing FAQ"
linkTitle: "FAQ"
date: 2026-06-20T12:00:00Z
lastmod: 2026-07-19T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "FAQPage"
description: "Practical questions about WiFi CSI sensing and Wavey — hardware, privacy, accuracy, through-wall sensing, and how to get started."
keywords:
  - WiFi CSI sensing FAQ
  - WiFi sensing questions
  - ESP32 CSI
faq:
  - question: "What is WiFi CSI sensing?"
    answer: "Measuring how WiFi signals travel across OFDM subcarriers and inferring environmental changes — occupancy, motion, presence — from those measurements. See how it works for the physics."
  - question: "What is Wavey?"
    answer: "An open-source WiFi CSI sensing system: ESP32 nodes capture CSI, a Python pipeline processes it, and the Console visualizes results. Code at github.com/waveyhq."
  - question: "Can WiFi really detect people without a camera?"
    answer: "Yes — bodies perturb multipath, which shifts CSI amplitude and phase. What you can detect depends on the task; see the detection ladder for feasibility by task type."
  - question: "Does WiFi sensing work through walls?"
    answer: "Partially. Interior drywall allows zone-level motion detection in adjacent rooms. Concrete and metal block most signal. Precise through-wall mapping is not realistic on commodity hardware."
  - question: "Is WiFi CSI sensing private?"
    answer: "Wavey captures no images and no device identifiers. It reads radio channel measurements, not appearance or MAC addresses."
  - question: "What is the difference between CSI and RSSI?"
    answer: "RSSI is one power number. CSI is amplitude and phase per subcarrier — dozens of measurements per packet. See the glossary."
  - question: "What hardware do I need?"
    answer: "CSI-capable ESP32 modules plus a host for the Python pipeline. Any ESP32 family chip works. Details in getting started and the GitHub repo."
  - question: "Does the person need to carry a device?"
    answer: "No. Wavey is device-free — it senses the body's effect on WiFi, not phones or wearables."
  - question: "How accurate is WiFi CSI sensing?"
    answer: "Occupancy and motion are robust with good node placement. Presence and HAR need preprocessing and often per-site tuning. Pose, identity, and headcount are research-frontier tasks."
  - question: "Can Wavey tell multiple people apart?"
    answer: "Not reliably. Multipath superposition from multiple bodies is ambiguous without dense spatial sampling."
  - question: "How does Wavey handle multiple floors?"
    answer: "Each floor needs its own nodes and baseline. WiFi attenuates heavily through concrete floors."
  - question: "What about busy or crowded spaces?"
    answer: "Occupancy and coarse motion remain strong. Per-person separation and exact counts degrade. See the detection ladder."
  - question: "Can WiFi sensing measure breathing?"
    answer: "CSI can detect periodic chest motion after phase sanitization, but reliability depends on range and environment. Awareness, not medical vitals."
  - question: "How is this different from WiFi MAC tracking?"
    answer: "MAC tracking follows device identifiers. Wavey reads CSI — how bodies disturb the signal — producing anonymous occupancy without tracking phones."
  - question: "Is Wavey open source?"
    answer: "Yes. github.com/waveyhq, Discord community, mail@waveyhq.dev."
  - question: "What is IEEE 802.11bf?"
    answer: "The WiFi standard amendment for native sensing. Signals that WiFi sensing is becoming a first-class capability."
  - question: "How do I get started?"
    answer: "Read how it works, the sensing pipeline, and getting started. Follow the GitHub repo for current setup steps."
---

Practical questions about **WiFi CSI sensing** and **Wavey**. For technical depth, see
[how it works](/how-it-works/), the [sensing pipeline](/sensing-pipeline/), the
[detection ladder](/detection/), and [technical deep-dives](/posts/).
