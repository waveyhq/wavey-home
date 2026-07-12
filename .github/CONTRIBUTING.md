# Contributing to Wavey Home

Thank you for helping improve [wavey.nopejs.me](https://wavey.nopejs.me).

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) **0.145.0** (matches `netlify.toml`)
- Git

## Local development

```bash
git clone https://github.com/trywavey/wavey-home.git
cd wavey-home
hugo server -D
```

Open http://localhost:1313

Production-like build:

```bash
hugo --gc --minify
```

Output is written to `public/` (gitignored).

## Project structure

| Path | Purpose |
|------|---------|
| `content/` | Markdown pages, posts, use-cases |
| `layouts/` | Hugo templates |
| `static/` | Images, JS, CSS, PWA assets |
| `hugo.toml` | Site config |
| `netlify.toml` | Netlify build settings |
| `.gitlab/workflows/` | Modular GitLab CI pipeline modules |
| `.github/workflows/` | GitHub Actions workflows |

## Making changes

1. Fork / branch from `main`
2. Follow [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)
3. Open a pull request (GitHub) or merge request (GitLab)
4. Ensure CI passes (`hugo --gc --minify`)

## Content guidelines

- Use clear, technical but accessible language
- Add `description` front matter for SEO
- Place images in `static/images/`
- Run `./scripts/generate-pwa-icons.sh` only when PWA icon sources change

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security

Do **not** open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
