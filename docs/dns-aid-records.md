# DNS for AI Discovery (DNS-AID) records

Wavey agent discovery metadata is published on the website (`/.well-known/*`, Link headers, and `llms.txt`). DNS-AID records must be added at your DNS provider for **waveyhq.dev** so validating resolvers can discover agent entrypoints over DNS.

These records cannot be committed to the Hugo site repository — configure them where **waveyhq.dev** DNS is managed.

## Requirements

- Publish `_index._agents` (and optionally `_a2a._agents`) under the site domain
- Use HTTPS or SVCB records with `alpn` and `port` parameters (RFC 9460)
- Enable and sign the zone with **DNSSEC** so validating resolvers receive authenticated data

## Suggested records

Replace TTL values as appropriate for your provider.

```dns
; Primary agent discovery index (HTTPS ServiceMode)
_index._agents.waveyhq.dev. 3600 IN HTTPS 1 waveyhq.dev. alpn="h3,h2" port=443

; Optional A2A-style entrypoint (SVCB)
_a2a._agents.waveyhq.dev. 3600 IN SVCB 1 waveyhq.dev. alpn="h3,h2" port=443 mandatory=alpn,port
```

## Verification

After publishing and DNSSEC-signing the zone, verify with DNS-over-HTTPS:

```bash
curl -s "https://cloudflare-dns.com/dns-query?name=_index._agents.waveyhq.dev&type=HTTPS" \
  -H "accept: application/dns-json"
```

Or run the [isitagentready.com](https://isitagentready.com) scan against `https://waveyhq.dev/` and confirm `checks.discoverability.dnsAid.status` is `"pass"`.

## References

- [DNS-AID draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
- [RFC 9460 (SVCB/HTTPS)](https://www.rfc-editor.org/rfc/rfc9460)
- Website discovery: `https://waveyhq.dev/.well-known/agent-skills/index.json`
