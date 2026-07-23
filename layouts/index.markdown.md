# {{ .Site.Title }}

> {{ .Site.Params.description }}

{{ .Site.Params.tagline }}

{{ .Content }}

## Start here

{{ range slice "/how-it-works" "/getting-started" "/faq" "/glossary" "/about" -}}
{{- with $.Site.GetPage . }}
- [{{ .Title }}]({{ .Permalink }}): {{ .Description }}
{{- end }}
{{- end }}

## Project links

- Website: {{ .Site.BaseURL }}
- Console: {{ .Site.Params.console }}
- GitHub: {{ .Site.Params.github }}
- Status: {{ .Site.Params.status }}
- LLM summary: {{ "llms.txt" | absURL }}
- API catalog: {{ "/.well-known/api-catalog" | absURL }}

For the full structured site index, see {{ "llms.txt" | absURL }}.
