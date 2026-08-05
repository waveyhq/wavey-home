---
name: api-discovery
description: Discover Wavey public APIs, status endpoints, and machine-readable catalogs for automated integration.
---

# Wavey API Discovery

Use this skill when an agent needs to find Wavey APIs, health checks, or service documentation.

## Discovery entry points

- API catalog (RFC 9727): https://waveyhq.dev/.well-known/api-catalog
- LLM site map: https://waveyhq.dev/llms.txt
- OAuth protected resource metadata: https://waveyhq.dev/.well-known/oauth-protected-resource
- OAuth authorization server metadata: https://waveyhq.dev/.well-known/oauth-authorization-server
- OpenID Connect discovery: https://waveyhq.dev/.well-known/openid-configuration
- MCP server card: https://waveyhq.dev/.well-known/mcp/server-card.json
- Agent skills index: https://waveyhq.dev/.well-known/agent-skills/index.json

## Public APIs

### Status page API

- Base: https://status.waveyhq.dev/
- Health JSON: https://status.waveyhq.dev/index.json
- Accept: `application/json`

### Wavey Console

- Web UI and authenticated APIs: https://console.waveyhq.dev
- Human docs: https://waveyhq.dev/getting-started/

## Authentication

Protected Console APIs use OAuth/OIDC via the Wavey authorization server. See https://waveyhq.dev/auth.md for agent registration flows.
