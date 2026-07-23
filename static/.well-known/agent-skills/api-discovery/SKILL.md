---
name: api-discovery
description: Discover Wavey public APIs, status endpoints, and machine-readable catalogs for automated integration.
---

# Wavey API Discovery

Use this skill when an agent needs to find Wavey APIs, health checks, or service documentation.

## Discovery entry points

- API catalog (RFC 9727): https://wavey.nopejs.me/.well-known/api-catalog
- LLM site map: https://wavey.nopejs.me/llms.txt
- OAuth protected resource metadata: https://wavey.nopejs.me/.well-known/oauth-protected-resource
- OAuth authorization server metadata: https://wavey.nopejs.me/.well-known/oauth-authorization-server
- OpenID Connect discovery: https://wavey.nopejs.me/.well-known/openid-configuration
- MCP server card: https://wavey.nopejs.me/.well-known/mcp/server-card.json
- Agent skills index: https://wavey.nopejs.me/.well-known/agent-skills/index.json

## Public APIs

### Status page API

- Base: https://status.wavey.nopejs.me/
- Health JSON: https://status.wavey.nopejs.me/index.json
- Accept: `application/json`

### Wavey Console

- Web UI and authenticated APIs: https://console.wavey.nopejs.me
- Human docs: https://wavey.nopejs.me/getting-started/

## Authentication

Protected Console APIs use OAuth/OIDC via the Wavey authorization server. See https://wavey.nopejs.me/auth.md for agent registration flows.
