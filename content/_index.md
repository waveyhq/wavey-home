---
title: "Wavey | WiFi CSI Sensing System (Device-Free, No Cameras)"
description: "Wavey is an open-source WiFi CSI sensing system using ESP32 Channel State Information for device-free occupancy, motion, and presence detection - no cameras or wearables."
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
    answer: "WiFi CSI is sensitive enough to detect the chest motion of breathing, and research has demonstrated respiration-rate estimation from CSI. Reliability depends on range, environment, and signal quality, and Wavey treats this as awareness rather than a medical device."
  - question: "Does WiFi sensing work through walls?"
    answer: "Partially. WiFi passes through many interior walls, so CSI sensing can detect motion and presence in non-line-of-sight conditions better than cameras. Accuracy drops with thicker or denser materials, and detailed through-wall reconstruction remains a research topic."
---

Homepage for Wavey, an open-source WiFi CSI sensing project.
