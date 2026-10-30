# squaddle.org

Static site: landing page, Impressum, privacy policy, Android App Links verification and the invite fallback page.

| Path | Purpose |
|---|---|
| `/` | Landing |
| `/impressum`, `/privacy` | Legal (DE) — required for Play Console |
| `/.well-known/assetlinks.json` | App Links verification for `org.squaddle` |
| `/j/<relay>/<room>/<invite>#<secret>` | Invite fallback: "open in app" / install / copy link. Fragment never leaves the browser. |

Served as static files (any web server / container). Required headers: HSTS, strict CSP, `Referrer-Policy: no-referrer`.

## License

Code (HTML/CSS/JS, build tooling) is [MIT](LICENSE). Page content (copy, images) is
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
