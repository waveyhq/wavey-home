# GitLab CI workflows

Modular pipeline files included from the root [`.gitlab-ci.yml`](../.gitlab-ci.yml).

| File | Purpose |
|------|---------|
| [`variables.yml`](variables.yml) | Shared `HUGO_VERSION` and environment variables |
| [`templates.yml`](templates.yml) | Hidden jobs (`.hugo:base`, `.hugo:verify`) |
| [`validate.yml`](validate.yml) | Build check on merge requests and feature branches |
| [`build.yml`](build.yml) | Production build + artifacts on `main` |
| [`deploy-netlify.yml`](deploy-netlify.yml) | Optional manual Netlify deploy |

GitLab requires the entrypoint at the repository root. Workflow modules under
`.gitlab/workflows/` are loaded via `include: local:` — any folder name works
as long as paths are relative to the project root.

## Required CI/CD variables (deploy only)

| Variable | Description |
|----------|-------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token (masked) |
| `NETLIFY_SITE_ID` | Netlify site ID (masked) |

## Local validation

```bash
hugo --gc --minify --printPathWarnings
test -f public/index.html public/sitemap.xml public/llms.txt
```
