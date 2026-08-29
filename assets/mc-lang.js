/* Site-wide language bar. Reads ?lang= (fr | en | ht), shows the matching
   disclaimer, marks the active switch, and points each switch at the current
   page so changing language never loses your place. */
(function () {
  var bar = document.querySelector("[data-mc-topbar]");
  if (!bar) return;

  var LANGS = ["fr", "en", "ht"];
  var DEFAULT = "fr";

  var lang = new URLSearchParams(window.location.search).get("lang");
  if (LANGS.indexOf(lang) === -1) lang = DEFAULT;

  bar.querySelectorAll("[data-mc-note]").forEach(function (note) {
    note.hidden = note.dataset.mcNote !== lang;
  });

  bar.querySelectorAll("[data-mc-lang]").forEach(function (a) {
    var code = a.dataset.mcLang;
    var url = new URL(window.location.href);
    url.searchParams.set("lang", code);
    a.href = url.pathname + url.search + url.hash;

    var active = code === lang;
    a.classList.toggle("is-active", active);
    if (active) {
      a.setAttribute("aria-current", "true");
    } else {
      a.removeAttribute("aria-current");
    }
  });

  document.documentElement.setAttribute("data-mc-lang", lang);
})();
