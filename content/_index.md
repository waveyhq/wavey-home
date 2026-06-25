---
title: "Wavey - WiFi CSI Sensing System (Device-Free, No Cameras)"
description: "Wavey is an open-source WiFi CSI sensing system using ESP32 Channel State Information for device-free occupancy, motion, and presence detection - no cameras or wearables."
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
  - question: "What is Wavey?"
    answer: "Wavey is an open-source RF sensing system that uses WiFi Channel State Information (CSI) on low-cost ESP32 nodes to detect occupancy, motion, and presence in a space - without cameras, wearables, or apps."
  - question: "What is WiFi CSI sensing?"
    answer: "WiFi CSI (Channel State Information) sensing measures how a WiFi signal travels between a transmitter and receiver across many OFDM subcarriers. When a person moves through the space, their body disturbs those signals in measurable ways, so the changes can be turned into occupancy, motion, and activity information."
  - question: "Does Wavey use cameras or require people to carry a device?"
    answer: "No. Wavey is device-free and camera-free. It senses the radio environment itself, so the people being detected do not need to wear or carry anything, and no images are ever captured."
  - question: "What hardware does Wavey run on?"
    answer: "Wavey runs on low-cost ESP32 sensing nodes, which expose WiFi CSI across the ESP32 family, paired with a Python-based analysis pipeline for real-time signal processing and inference."
---

Wavey is an open-source WiFi CSI sensing system for device-free occupancy, motion, and presence detection.
