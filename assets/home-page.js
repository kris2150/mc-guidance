/* Home page — renders content from assets/home-content-<lang>.json.
   Language comes from the ?lang= URL parameter (fr | en | ht), matching
   the services page. Internal links carry the active language forward. */
(function () {
  var root = document.querySelector(".mc-home");
  if (!root) return;

  var LANGS = ["fr", "en", "ht"];
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");
  if (LANGS.indexOf(lang) === -1) lang = root.dataset.defaultLang || "fr";

  var src = root.dataset["src" + lang.charAt(0).toUpperCase() + lang.slice(1)];
  var urls = {
    services: root.dataset.urlServices || "/pages/services",
    contact: root.dataset.urlContact || "/pages/contact",
    home: root.dataset.urlHome || "/",
  };

  /* Keep the chosen language when moving between pages. */
  function withLang(path) {
    return path + (path.indexOf("?") === -1 ? "?" : "&") + "lang=" + lang;
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function text(tag, cls, value) {
    var n = el(tag, cls);
    n.textContent = value;
    return n;
  }

  function link(cls, label, href) {
    var a = text("a", cls, label);
    a.href = href;
    return a;
  }

  function container(parent) {
    var c = el("div", "mc-home__container");
    parent.appendChild(c);
    return c;
  }

  function heading(parent, data, center) {
    var h = el("div", "mc-home__heading" + (center ? " mc-home__heading--center" : ""));
    if (data.eyebrow) h.appendChild(text("span", "mc-home__eyebrow", data.eyebrow));
    h.appendChild(text("h2", "mc-home__h2", data.title));
    if (data.intro) h.appendChild(text("p", "mc-home__lede", data.intro));
    parent.appendChild(h);
  }

  function media(label, note) {
    var m = el("div", "mc-home__media");
    m.setAttribute("role", "img");
    m.setAttribute("aria-label", label + " — " + note);
    var box = text("div", "mc-home__media-label", label);
    box.appendChild(text("small", null, note));
    m.appendChild(box);
    return m;
  }

  function render(c) {
    var p = c.home;
    root.setAttribute("lang", lang);
    root.innerHTML = "";
    if (c.meta && c.meta.pageTitle) document.title = c.meta.pageTitle;

    /* ---- Hero ---- */
    var hero = el("section", "mc-home__hero");
    var hg = el("div", "mc-home__container mc-home__hero-grid");
    hero.appendChild(hg);

    var copy = el("div");
    copy.appendChild(text("span", "mc-home__eyebrow", p.hero.eyebrow));
    copy.appendChild(text("h1", "mc-home__title", p.hero.title));
    copy.appendChild(text("p", "mc-home__hero-intro", p.hero.intro));

    var actions = el("div", "mc-home__hero-actions");
    actions.appendChild(
      link("mc-home__btn mc-home__btn--primary", p.hero.ctaPrimary, withLang(urls.services))
    );
    actions.appendChild(link("mc-home__btn mc-home__btn--secondary", p.hero.ctaSecondary, "#mc-journey"));
    copy.appendChild(actions);

    var trust = el("div", "mc-home__trust");
    trust.appendChild(text("span", "mc-home__trust-mark", "✓"));
    trust.appendChild(text("span", null, p.hero.trust));
    copy.appendChild(trust);

    hg.appendChild(copy);
    hg.appendChild(media(p.hero.imageLabel, p.hero.imageNote));
    root.appendChild(hero);

    /* ---- Intro card ---- */
    var intro = el("section", "mc-home__section");
    var ic = container(intro);
    var card = el("div", "mc-home__intro-card");
    card.appendChild(text("h2", null, p.intro.title));
    card.appendChild(text("p", null, p.intro.body));
    ic.appendChild(card);
    root.appendChild(intro);

    /* ---- Journey ---- */
    var journey = el("section", "mc-home__section mc-home__section--soft");
    journey.id = "mc-journey";
    var jc = container(journey);
    heading(jc, p.journey, true);
    var jgrid = el("div", "mc-home__journey-grid");
    p.journey.steps.forEach(function (s, i) {
      var a = el("article", "mc-home__journey-card");
      a.appendChild(text("span", "mc-home__step-num", String(i + 1)));
      a.appendChild(text("h3", null, s.title));
      a.appendChild(text("p", null, s.description));
      jgrid.appendChild(a);
    });
    jc.appendChild(jgrid);
    var jcta = el("div", "mc-home__center");
    jcta.appendChild(link("mc-home__btn mc-home__btn--secondary", p.journey.cta, withLang(urls.services)));
    jc.appendChild(jcta);
    root.appendChild(journey);

    /* ---- Services ---- */
    var services = el("section", "mc-home__section");
    services.id = "mc-services";
    var sc = container(services);
    heading(sc, p.services);
    var sgrid = el("div", "mc-home__services-grid");
    p.services.cards.forEach(function (card) {
      var a = el("article", "mc-home__service-card");
      var icon = text("div", "mc-home__service-icon", card.icon);
      icon.setAttribute("aria-hidden", "true");
      a.appendChild(icon);
      a.appendChild(text("h3", null, card.title));
      a.appendChild(text("p", null, card.description));
      a.appendChild(link("mc-home__btn mc-home__btn--text", card.cta, withLang(urls.services)));
      sgrid.appendChild(a);
    });
    sc.appendChild(sgrid);
    var scta = el("div", "mc-home__center");
    scta.appendChild(link("mc-home__btn mc-home__btn--primary", p.services.cta, withLang(urls.services)));
    sc.appendChild(scta);
    root.appendChild(services);

    /* ---- Story ---- */
    var story = el("section", "mc-home__section mc-home__section--soft mc-home__story");
    story.id = "mc-about";
    var stc = el("div", "mc-home__container mc-home__story-grid");
    story.appendChild(stc);
    stc.appendChild(media(p.story.imageLabel, p.story.imageNote));
    var scopy = el("div", "mc-home__story-copy");
    scopy.appendChild(text("span", "mc-home__eyebrow", p.story.eyebrow));
    scopy.appendChild(text("h2", "mc-home__h2", p.story.title));
    scopy.appendChild(text("p", null, p.story.body));
    var ql = el("ul", "mc-home__qualities");
    p.story.qualities.forEach(function (q) {
      ql.appendChild(text("li", null, q));
    });
    scopy.appendChild(ql);
    scopy.appendChild(link("mc-home__btn mc-home__btn--secondary", p.story.cta, withLang(urls.contact)));
    stc.appendChild(scopy);
    root.appendChild(story);

    /* ---- Closing CTA ---- */
    var closing = el("section", "mc-home__section");
    var cc = container(closing);
    var cta = el("div", "mc-home__cta-card");
    var ctaCopy = el("div");
    ctaCopy.appendChild(text("h2", null, p.closing.title));
    ctaCopy.appendChild(text("p", null, p.closing.body));
    cta.appendChild(ctaCopy);
    cta.appendChild(link("mc-home__btn", p.closing.cta, withLang(urls.services)));
    cc.appendChild(cta);
    root.appendChild(closing);

    /* ---- Legal disclaimer ---- */
    if (c.footer && c.footer.legal) {
      var legal = el("section", "mc-home__endnote");
      var lc = container(legal);
      lc.appendChild(text("p", "mc-home__legal", c.footer.legal));
      root.appendChild(legal);
    }
  }

  fetch(src)
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(render)
    .catch(function (e) {
      root.innerHTML =
        '<p style="padding:2rem;text-align:center;">Unable to load content (' + e.message + ").</p>";
    });
})();
