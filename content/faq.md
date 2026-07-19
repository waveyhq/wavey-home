---
title: "WiFi CSI Sensing FAQ"
linkTitle: "FAQ"
date: 2026-06-20T12:00:00Z
lastmod: 2026-06-25T12:00:00Z
draft: false
sitemap:
  priority: 0.9
schema_type: "FAQPage"
description: "Frequently asked questions about WiFi CSI sensing and Wavey - how it works, privacy, hardware, accuracy, through-wall sensing, and how it differs from cameras and WiFi tracking."
keywords:
  - WiFi CSI sensing FAQ
  - WiFi sensing questions
  - is WiFi sensing private
  - WiFi sensing through walls
  - ESP32 CSI
faq:
  - question: "What is WiFi CSI sensing?"
    answer: "WiFi CSI (Channel State Information) sensing measures how a WiFi signal travels between a transmitter and a receiver across many OFDM subcarriers. When a person moves through the space, their body disturbs those signals in measurable ways, and those changes can be turned into occupancy, motion, and activity information - all without a camera or a device on the person."
  - question: "What is Wavey?"
    answer: "Wavey is an open-source RF sensing system that uses WiFi CSI on low-cost ESP32 nodes to detect occupancy, motion, and presence. It pairs ESP32-CSI sensing nodes with a Python analysis pipeline and a live console at console.wavey.nopejs.me."
  - question: "Can WiFi really detect people without a camera?"
    answer: "Yes. The human body reflects and absorbs WiFi, so a moving person changes the signal measurably - no camera and nothing carried by the person required. Carnegie Mellon's DensePose-from-WiFi research even reconstructed human body pose from WiFi signals alone."
  - question: "Does WiFi sensing work through walls?"
    answer: "Partially. WiFi passes through many interior walls, so CSI sensing can detect motion and presence in non-line-of-sight conditions better than cameras. Accuracy drops with thicker or denser materials, and detailed through-wall reconstruction remains a research topic."
  - question: "Is WiFi CSI sensing private? Does it record images?"
    answer: "It is private by design. Wavey never captures images - it reads the radio environment, not your appearance. Industry guidance rates camera-based sensing as the highest privacy risk and non-visual sensing as far lower, which is exactly where WiFi CSI sits."
  - question: "What is the difference between CSI and RSSI?"
    answer: "RSSI is a single signal-strength number. CSI is much richer: it captures amplitude and phase across many individual subcarriers, so it can detect subtle changes - like breathing - that RSSI cannot."
  - question: "What hardware do I need to run Wavey?"
    answer: "Low-cost ESP32 modules, which expose WiFi CSI across the ESP32 family (ESP32, S2, S3, C3, C5, C6 and more), plus a host running Wavey's Python pipeline. You can start with a single sensing node and add more for coverage."
  - question: "Does the person being detected need to carry a device?"
    answer: "No. Wavey is device-free. Unlike wearables or phone/MAC-address tracking, it senses the body's effect on WiFi directly, so it detects everyone in a space - not just people carrying a specific device."
  - question: "How accurate is WiFi CSI sensing?"
    answer: "Occupancy and motion are robust and reliable; presence and breathing are achievable with good setup; precise multi-person tracking, pose, and identity are harder and improve with research. Wavey is designed to lead with the dependable signals first."
  - question: "Can Wavey tell multiple people apart?"
    answer: "Not reliably. Separating several people in one space is still an active research area. Wavey leads with occupancy and coarse motion, not exact head counts."
  - question: "How does Wavey handle multiple floors?"
    answer: "CSI is environment-specific: each floor or zone needs its own nodes and baseline. WiFi attenuates more through floors than through interior walls, so treat each level as separate coverage rather than expecting one deployment to model a whole building. Multiple nodes on a floor can extend reach within that space."
  - question: "What about busy or crowded spaces?"
    answer: "More people and motion mean more multipath change - not always a clear on/off signal. Occupancy and coarse activity remain the strongest use cases; precise counting and per-person separation get harder. Good node placement, enough nodes, and a baseline of normal activity help more than expecting camera-like precision."
  - question: "Can WiFi sensing measure breathing or vital signs?"
    answer: "WiFi CSI is sensitive enough to detect the chest motion of breathing, and research has demonstrated respiration-rate estimation from CSI. Reliability depends on range, environment, and signal quality, and Wavey treats this as awareness rather than a medical device."
  - question: "How is this different from WiFi MAC-address tracking?"
    answer: "MAC-based tracking follows device identifiers, which can be personal data and tends to miscount (one person with several devices, or many people sharing one). Wavey reads CSI - the body's effect on the signal - so it produces anonymous occupancy without tracking phones or individuals."
  - question: "Is Wavey open source, and where is the code?"
    answer: "Yes. Wavey is open source and developed in the open at github.com/waveyhq. You can follow progress there, join the community on Discord, and reach the team at mail@wavey.nopejs.me."
  - question: "What is IEEE 802.11bf?"
    answer: "IEEE 802.11bf is the amendment to the WiFi standard dedicated to WiFi sensing. Its existence signals that sensing is becoming a first-class, standardized capability of WiFi itself - the same phenomenon Wavey builds on with CSI."
  - question: "How do I get started with Wavey?"
    answer: "Start with the how-it-works explainer, then the getting-started guide for the architecture and hardware approach, and follow or contribute on GitHub. The Wavey Console lets you visualize live CSI."
---

Common questions about **WiFi CSI sensing** and **Wavey** - what it is, whether it's private, what hardware
it needs, and how it compares to cameras and WiFi tracking. New to the topic? The
[how-it-works explainer](/how-it-works/) and [glossary](/glossary/) are good next reads.
