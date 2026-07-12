# Commit message convention

## Format

```
[type] short description
- optional bullet points
```

- **First line:** type tag in square brackets, a space, then a short imperative summary.
- **Body (optional):** bullet points starting with `-` for extra detail.

## Types

| Type | Use for |
|------|---------|
| `feat` | New content, pages, or user-facing capability |
| `fix` | Bug fixes (build, layout, broken links) |
| `docs` | Documentation-only changes |
| `style` | CSS / visual tweaks without behavior change |
| `refactor` | Template or structure changes without feature/fix |
| `chore` | Tooling, CI, dependencies |
| `perf` | Performance improvements |
| `ci` | CI/CD pipeline changes |

## Examples

```
[feat] add ESP32 CSI troubleshooting post
```

```
[fix] correct canonical URL on taxonomy pages
- use .Permalink instead of .URL in opengraph partial
```

```
[ci] add hugo build workflow on pull requests
- composite actions for setup and verify
- validate on PRs, build artifacts on main
```

```
[chore] regenerate maskable PWA icons
```

## Rules

- Use imperative mood: "add" not "added"
- Keep the first line to 72 characters or fewer
- Reference issues in bullet points when helpful (e.g. `Fixes #123`)
