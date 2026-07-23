{{- $description := .Description | default .Summary | default .Site.Params.description -}}
# {{ .Title }}

{{ if $description }}
> {{ $description | plainify }}
{{ end }}

{{ .Content }}
