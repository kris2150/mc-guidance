/* Services timeline — renders content from assets/services-content-<lang>.json.
   Language is chosen by the ?lang= URL parameter (fr | en | ht). */
(function () {
  var root = document.querySelector(".svc-tl");
  if (!root) return;

  var LANGS = ["fr", "en", "ht"];
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");
  if (LANGS.indexOf(lang) === -1) lang = root.dataset.defaultLang || "fr";

  var src = root.dataset["src" + lang.charAt(0).toUpperCase() + lang.slice(1)];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function text(tag, cls, value) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    n.textContent = value;
    return n;
  }

  function langUrl(code) {
    var u = new URL(window.location.href);
    u.searchParams.set("lang", code);
    return u.pathname + u.search;
  }

  function render(c) {
    var p = c.servicesPage;
    root.setAttribute("lang", lang);
    root.innerHTML = "";
    if (c.meta && c.meta.pageTitle) document.title = c.meta.pageTitle;

    /* Language switcher */
    var switcher = el("nav", "svc-tl__langs");
    switcher.setAttribute("aria-label", "Language");
    var names = { fr: "Français", en: "English", ht: "Kreyòl" };
    LANGS.forEach(function (code) {
      var a = text("a", "svc-tl__lang" + (code === lang ? " is-active" : ""), names[code]);
      a.href = langUrl(code);
      a.setAttribute("lang", code);
      if (code === lang) a.setAttribute("aria-current", "true");
      switcher.appendChild(a);
    });

    /* Hero */
    var hero = el("header", "svc-tl__hero");
    hero.appendChild(switcher);
    // hero.appendChild(text("p", "svc-tl__eyebrow", p.eyebrow));
    hero.appendChild(text("h1", "svc-tl__title", p.title));
    hero.appendChild(text("p", "svc-tl__intro", p.intro));

    var cq = el("div", "svc-tl__cq");
    cq.appendChild(text("span", "svc-tl__cq-label", p.centralQuestionLabel));
    cq.appendChild(text("p", "svc-tl__cq-q", p.centralQuestion));
    cq.appendChild(text("p", "svc-tl__cq-note", p.centralQuestionNote));
    // hero.appendChild(cq);
    root.appendChild(hero);

    /* Layout: sidebar + steps */
    var layout = el("div", "svc-tl__layout");

    var aside = el("aside", "svc-tl__sidebar");
    var sticky = el("div", "svc-tl__sticky");
    sticky.appendChild(text("h2", "svc-tl__sidebar-title", p.sidebarTitle));
    var list = el("ol", "svc-tl__steplist");
    p.steps.forEach(function (s, i) {
      var li = el("li");
      var a = el("a", "svc-tl__steplink");
      a.href = "#svc-step-" + (i + 1);
      a.appendChild(text("span", "svc-tl__stepnum", String(i + 1)));
      a.appendChild(text("span", "svc-tl__stepname", s.title));
      li.appendChild(a);
      list.appendChild(li);
    });
    sticky.appendChild(list);
    aside.appendChild(sticky);
    layout.appendChild(aside);

    var content = el("div", "svc-tl__content");
    p.steps.forEach(function (s, i) {
      var card = el("section", "svc-tl__card");
      card.id = "svc-step-" + (i + 1);

      var head = el("div", "svc-tl__card-head");
      head.appendChild(text("span", "svc-tl__badge", String(i + 1)));
      var ht = el("div");
      ht.appendChild(text("span", "svc-tl__kicker", p.stepLabel + " " + (i + 1)));
      ht.appendChild(text("h2", "svc-tl__card-title", s.title));
      head.appendChild(ht);
      card.appendChild(head);

      card.appendChild(text("p", "svc-tl__desc", s.description));

      if (s.questions && s.questions.length) {
        var qb = el("div", "svc-tl__block svc-tl__block--questions");
        qb.appendChild(text("h3", "svc-tl__block-title", p.keyQuestionsLabel));
        var ul = el("ul");
        s.questions.forEach(function (q) {
          ul.appendChild(text("li", null, q));
        });
        // qb.appendChild(ul);
        // card.appendChild(qb);
      }

      (s.tips || []).forEach(function (t) {
        var tb = el("div", "svc-tl__block svc-tl__block--tip");
        tb.appendChild(text("span", "svc-tl__block-label", p.tipLabel));
        tb.appendChild(text("p", null, t));
        // card.appendChild(tb);
      });

      (s.faq || []).forEach(function (f) {
        var fb = el("div", "svc-tl__block svc-tl__block--faq");
        fb.appendChild(text("span", "svc-tl__block-label", p.faqLabel));
        fb.appendChild(text("p", "svc-tl__faq-q", f.q));
        fb.appendChild(text("p", "svc-tl__faq-a", f.a));
        // card.appendChild(fb);
      });

      content.appendChild(card);
    });

    /* Summary */
    var sum = el("section", "svc-tl__summary");
    sum.appendChild(text("h2", null, p.summaryTitle));
    var sol = el("ol");
    p.summary.forEach(function (s) {
      sol.appendChild(text("li", null, s));
    });
    sum.appendChild(sol);
    content.appendChild(sum);

    /* Closing banner */
    var banner = el("section", "svc-tl__banner");
    banner.appendChild(text("p", "svc-tl__banner-q", p.centralQuestion));
    banner.appendChild(text("p", "svc-tl__banner-note", p.centralQuestionNote));
    content.appendChild(banner);

    /* Disclaimer */
    if (c.footer && c.footer.disclaimer) {
      content.appendChild(text("p", "svc-tl__disclaimer", c.footer.disclaimer));
    }

    layout.appendChild(content);
    root.appendChild(layout);

    scrollSpy();
  }

  function scrollSpy() {
    var links = root.querySelectorAll(".svc-tl__steplink");
    var cards = root.querySelectorAll(".svc-tl__card");
    if (!("IntersectionObserver" in window) || !links.length) return;

    var byId = {};
    links.forEach(function (l) {
      byId[l.getAttribute("href").slice(1)] = l;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.remove("is-current");
          });
          var link = byId[entry.target.id];
          if (link) {
            link.classList.add("is-current");
            link.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    cards.forEach(function (c) {
      observer.observe(c);
    });
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
