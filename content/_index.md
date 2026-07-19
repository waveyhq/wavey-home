---
title: "Wavey | WiFi CSI Sensing System (Device-Free, No Cameras)"
description: "Wavey is an open-source WiFi CSI sensing system — subcarrier physics, signal processing pipelines, and deployable occupancy, motion, and presence detection on ESP32."
sitemap:
  priority: 1.0
keywords:
  - WiFi CSI sensing
  - WiFi sensing
  - Channel State Information
  - device-free occupancy detection
  - ESP32 CSI
  - WiFi motion detection
  - presence detection without camera
  - RF sensing
faq:
  - question: "Can WiFi sensing measure breathing or vital signs?"
    answer: "CSI phase can pick up the periodic chest motion of respiration (0.1–0.5 Hz) after preprocessing, but reliability depends on range, node placement, and a quiet environment. Wavey treats this as presence awareness, not clinical vitals."
  - question: "Does WiFi sensing work through walls?"
    answer: "WiFi penetrates drywall and interior partitions, so CSI can detect motion in adjacent rooms without line of sight. Dense materials like concrete block most of the signal; expect zone-level motion detection, not precise through-wall mapping."
---

Homepage for Wavey, an open-source WiFi CSI sensing project.
