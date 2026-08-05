# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` branch (production site) | Yes |
| Older tags / forks | Best effort |

## Reporting a vulnerability

**Do not** open a public GitHub issue for security vulnerabilities.

Email **mail@waveyhq.dev** with:

- Description of the issue
- Steps to reproduce
- Impact assessment
- Any suggested fix (optional)

We aim to acknowledge reports within **72 hours** and provide a remediation
timeline when a vulnerability is confirmed.

## Scope

All Wavey products and infrastructure are in scope, including:

- This repository (`wavey-home`) — Hugo site, static assets, and client-side scripts
- [waveyhq.dev](https://waveyhq.dev) and related public endpoints
- [Wavey Console](https://console.waveyhq.dev) — backend APIs, authentication, and data handling
- [Status page](https://status.waveyhq.dev/) and operational infrastructure
- ESP32 sensing nodes, firmware, and the signal-processing pipeline
- CI/CD pipelines (GitLab CI, GitHub Actions, Netlify deploys)
- Third-party integrations (such as Netlify) when misconfigured in a way that affects Wavey
- Misconfigurations that expose secrets, credentials, or private data

## Safe harbor

We support good-faith security research that follows this policy and avoids
privacy violations or service disruption.
