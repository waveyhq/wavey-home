# GitHub Actions workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`ci.yml`](ci.yml) | PR + push | Validate on PRs; build artifact on `main` |
| [`deploy-netlify.yml`](deploy-netlify.yml) | `workflow_dispatch` | Optional manual Netlify deploy |

## Composite actions

| Action | Purpose |
|--------|---------|
| [`../actions/setup-hugo`](../actions/setup-hugo) | Install Hugo Extended (pinned version) |
| [`../actions/verify-site`](../actions/verify-site) | Assert required build outputs exist |

## Required secrets (deploy only)

| Secret | Description |
|--------|-------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token |
| `NETLIFY_SITE_ID` | Netlify site ID |

Netlify already deploys on push via `netlify.toml`; the deploy workflow is a
manual fallback.
