/*
 * Squaddle invite fallback page.
 *
 * Hard rule (website/CLAUDE.md): never send the URL fragment anywhere. The
 * fragment (the invite secret, after '#') is never read by this file except
 * inside copyLink(), and even there it's only ever placed on the clipboard -
 * never fetched, logged, or embedded in a link we construct ourselves.
 *
 * Invite URL shape (spec/ARCHITECTURE.md §Links):
 *   https://squaddle.org/j/<relayHost>/<roomId>/<inviteId>#<inviteSecret>
 */
(function () {
  "use strict";

  // ADR-0009: webclient deploys to its own origin, not a path under squaddle.org.
  var WEBAPP_ORIGIN = "https://app.squaddle.org";

  var statusEl = document.getElementById("j-status");
  var openEl = document.getElementById("j-open");
  var webappEl = document.getElementById("j-webapp");
  var copyEl = document.getElementById("j-copy");
  var copyStatusEl = document.querySelector("[data-copy-status]");

  function parseInvitePath(pathname) {
    var parts = pathname.split("/").filter(Boolean); // ["j", relay, room, invite]
    if (parts.length !== 4 || parts[0] !== "j") {
      return null;
    }
    return { relay: parts[1], room: parts[2], invite: parts[3] };
  }

  var parsed = parseInvitePath(location.pathname);

  if (!parsed) {
    statusEl.textContent =
      "This invite link looks incomplete or malformed. Ask whoever sent it to re-share it.";
    return;
  }

  statusEl.textContent = "Open it in the app, or copy the link to share it yourself.";

  // "Open in app": Android only, per the brief. Built from the path alone,
  // deliberately never from location.hash - the intent URI never needs the
  // secret, only the app does, and the app gets it via the OS-level deep
  // link / clipboard, not from anything this script constructs.
  if (/Android/i.test(navigator.userAgent)) {
    // Fallback if the app isn't installed: land back on this same page
    // (over plain https, path only, no fragment) rather than a dead link -
    // there's no published store listing yet.
    var fallback = encodeURIComponent("https://squaddle.org" + location.pathname);
    var intentUrl =
      "intent://squaddle.org" +
      location.pathname +
      "#Intent;scheme=https;package=org.squaddle;S.browser_fallback_url=" +
      fallback +
      ";end";
    openEl.href = intentUrl;
    openEl.hidden = false;
    openEl.removeAttribute("aria-disabled");
  }

  // "Open in browser": every browser, not just Android - the no-install fallback. Built from
  // location.hash directly (client-side only, same rule as copyLink() below) since webclient's
  // own /j/* route (router.ts) needs the real invite secret to join, not just the path. This
  // never sends the fragment anywhere itself - it's placed in an href the *user* then navigates,
  // exactly like clicking any other link.
  webappEl.href = WEBAPP_ORIGIN + location.pathname + location.hash;
  webappEl.hidden = false;
  webappEl.removeAttribute("aria-disabled");

  copyEl.disabled = false;
  copyEl.addEventListener("click", function () {
    // location.href here legitimately includes the fragment - this is the
    // one and only place that's allowed, and it goes straight to the
    // clipboard API, never anywhere else.
    navigator.clipboard
      .writeText(location.href)
      .then(function () {
        copyStatusEl.textContent = "Copied!";
      })
      .catch(function () {
        copyStatusEl.textContent = "Couldn't copy automatically - select the address bar instead.";
      });
  });
})();
