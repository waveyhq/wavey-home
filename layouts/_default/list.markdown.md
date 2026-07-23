# {{ .Title }}

{{ with .Description }}
> {{ . | plainify }}
{{ end }}

{{ .Content }}

## Pages in this section

{{ range .Pages.ByWeight }}
- [{{ .Title }}]({{ .Permalink }}): {{ .Description }}
{{ end }}
