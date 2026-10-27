# CLAUDE.md — website repo

Static site for squaddle.org. Plain HTML/CSS (+ minimal vanilla JS for the invite page). No frameworks unless asked,
no third-party scripts, fonts or analytics — everything self-hosted.

## Rules
- The invite page `/j/*` must never send the URL fragment anywhere: no fetch with it, no logging, `Referrer-Policy: no-referrer`.
  It may copy the full link to the clipboard (for the app's deferred deep link) and offer store/F-Droid links.
- `/j/*`'s "Open in browser" button points at `https://client.squaddle.org` (`webclient`'s own origin,
  not a path under this site - ADR-0009 in `../spec/adr/`, so widening this site's own strict CSP for
  webclient's sake is never needed).
- OG tags on `/j/*` are generic ("You've been invited to a Squaddle room") — the server only sees the path.
- `assetlinks.json` must list the SHA-256 of the upload key AND the Play App Signing key.
- Headers (set in server config): `Strict-Transport-Security: max-age=31536000; includeSubDomains`,
  CSP `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`.
