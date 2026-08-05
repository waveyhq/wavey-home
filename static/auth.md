# auth.md

You are an agent. This document describes how to authenticate with Wavey services on behalf of a user.

Wavey publishes public documentation at **https://waveyhq.dev/** (no auth required). The **Wavey Console** at **https://console.waveyhq.dev** provides authenticated access to live CSI data and account features.

## Step 1 — Discover

Fetch protected resource metadata:

```http
GET https://waveyhq.dev/.well-known/oauth-protected-resource
```

Then fetch authorization server metadata:

```http
GET https://waveyhq.dev/.well-known/oauth-authorization-server
```

The `agent_auth` block in the authorization server response lists supported identity flows and endpoints.

## Step 2 — Public site (no credentials)

Most Wavey documentation, llms.txt, and the status API are public:

- Site summary: https://waveyhq.dev/llms.txt
- Status JSON: https://status.waveyhq.dev/index.json

No access token is required for these resources.

## Step 3 — Console access (user claimed flow)

When the user needs Console access:

1. Direct the user to sign in at https://console.waveyhq.dev
2. For programmatic Console API access, the user must create credentials in the Console (when available) or contact **mail@waveyhq.dev**
3. Agents may use the `service_auth` identity type at `POST https://console.waveyhq.dev/agent/identity` once the Console agent registration endpoint is enabled

## Step 4 — Exchange for access token

After obtaining an identity assertion from the authorization server:

```http
POST https://console.waveyhq.dev/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&...
```

Supported grant types are listed in `/.well-known/oauth-authorization-server`.

## Step 5 — Call protected APIs

Send the access token on Console API requests:

```http
Authorization: Bearer ACCESS_TOKEN
```

## Scopes

| Scope | Access |
| --- | --- |
| `site.read` | Read public Wavey documentation |
| `feedback.submit` | Submit site feedback forms |
| `console.read` | Read CSI streams and dashboards |
| `console.write` | Configure nodes and pipelines |

## Revocation and support

- Token revocation: `POST https://console.waveyhq.dev/oauth/revoke`
- Security issues: see https://waveyhq.dev/SECURITY.md
- Community: https://discord.gg/sxh9r9UTtW
- Email: mail@waveyhq.dev

## Related discovery

- API catalog: https://waveyhq.dev/.well-known/api-catalog
- Agent skills: https://waveyhq.dev/.well-known/agent-skills/index.json
- MCP server card: https://waveyhq.dev/.well-known/mcp/server-card.json
