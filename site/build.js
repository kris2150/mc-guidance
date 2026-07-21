#!/usr/bin/env node
/**
 * Static site builder for MC Guidance.
 *
 * Reads content/<locale>.json and generates:
 *   dist/index.html                  -> redirects to the default locale
 *   dist/<locale>/index.html         -> redirects to services (until Home exists)
 *   dist/<locale>/services/index.html
 *   dist/static/*                    -> copied as-is
 *
 * Usage: node build.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const LOCALES = ["fr", "en", "ht"];
const DEFAULT_LOCALE = "fr";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function loadContent(locale) {
  const file = path.join(ROOT, "content", `${locale}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function langSwitcher(current, pagePath) {
  const links = LOCALES.map((code) => {
    const c = loadContent(code);
    const active = code === current ? ' aria-current="true" class="lang-link active"' : ' class="lang-link"';
    return `<a href="/${code}/${pagePath}"${active} lang="${code}">${esc(c.meta.langName)}</a>`;
  }).join("");
  return `<nav class="lang-switcher" aria-label="Language">${links}</nav>`;
}

function header(c, locale, pagePath) {
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/${locale}/">${esc(c.meta.siteName)}</a>
      <nav class="main-nav" aria-label="Main">
        <a href="/${locale}/">${esc(c.nav.home)}</a>
        <a href="/${locale}/services/" class="active">${esc(c.nav.services)}</a>
        <a href="/${locale}/contact/">${esc(c.nav.contact)}</a>
      </nav>
      ${langSwitcher(locale, pagePath)}
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
    </div>
  </header>`;
}

function footer(c) {
  return `
  <footer class="site-footer">
    <div class="container">
      <p class="disclaimer">${esc(c.footer.disclaimer)}</p>
      <p class="copyright">© ${new Date().getFullYear()} ${esc(c.footer.copyright)}</p>
    </div>
  </footer>`;
}

function hreflangLinks(pagePath) {
  const alts = LOCALES.map(
    (code) => `<link rel="alternate" hreflang="${code}" href="/${code}/${pagePath}">`
  ).join("\n  ");
  return `${alts}\n  <link rel="alternate" hreflang="x-default" href="/${DEFAULT_LOCALE}/${pagePath}">`;
}

function servicesPage(c, locale) {
  const p = c.servicesPage;

  const sidebarItems = p.steps
    .map(
      (s, i) => `
        <li><a href="#etape-${i + 1}" class="step-link" data-step="${i + 1}">
          <span class="step-num">${i + 1}</span>
          <span class="step-name">${esc(s.title)}</span>
        </a></li>`
    )
    .join("");

  const stepSections = p.steps
    .map((s, i) => {
      const questions = s.questions.length
        ? `<div class="block block-questions">
             <h3>${esc(p.keyQuestionsLabel)}</h3>
             <ul>${s.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
           </div>`
        : "";
      const tips = s.tips.length
        ? s.tips
            .map(
              (t) => `<div class="block block-tip">
             <span class="block-label">${esc(p.tipLabel)}</span>
             <p>${esc(t)}</p>
           </div>`
            )
            .join("")
        : "";
      const faq = s.faq.length
        ? s.faq
            .map(
              (f) => `<div class="block block-faq">
             <span class="block-label">${esc(p.faqLabel)}</span>
             <p class="faq-q">${esc(f.q)}</p>
             <p class="faq-a">${esc(f.a)}</p>
           </div>`
            )
            .join("")
        : "";
      return `
      <section class="step-card" id="etape-${i + 1}">
        <div class="step-head">
          <span class="step-badge">${i + 1}</span>
          <div>
            <span class="step-kicker">${esc(p.stepLabel)} ${i + 1}</span>
            <h2>${esc(s.title)}</h2>
          </div>
        </div>
        <p class="step-desc">${esc(s.description)}</p>
        ${questions}
        ${tips}
        ${faq}
      </section>`;
    })
    .join("");

  const summaryItems = p.summary.map((s) => `<li>${esc(s)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.meta.pageTitle)}</title>
  <meta name="description" content="${esc(c.meta.pageDescription)}">
  ${hreflangLinks("services/")}
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  ${header(c, locale, "services/")}

  <main>
    <section class="hero">
      <div class="container">
        <p class="eyebrow">${esc(p.eyebrow)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="intro">${esc(p.intro)}</p>
        <div class="central-question">
          <span class="cq-label">${esc(p.centralQuestionLabel)}</span>
          <p class="cq-question">${esc(p.centralQuestion)}</p>
          <p class="cq-note">${esc(p.centralQuestionNote)}</p>
        </div>
      </div>
    </section>

    <div class="container layout">
      <aside class="sidebar">
        <div class="sidebar-sticky">
          <h2 class="sidebar-title">${esc(p.sidebarTitle)}</h2>
          <ol class="step-list">${sidebarItems}</ol>
        </div>
      </aside>

      <div class="content">
        ${stepSections}

        <section class="summary-card">
          <h2>${esc(p.summaryTitle)}</h2>
          <ol>${summaryItems}</ol>
        </section>

        <section class="cq-banner">
          <p class="cq-question">${esc(p.centralQuestion)}</p>
          <p class="cq-note">${esc(p.centralQuestionNote)}</p>
        </section>
      </div>
    </div>
  </main>

  ${footer(c)}
  <script src="/static/app.js"></script>
</body>
</html>`;
}

function redirectPage(to) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="${to}"></head>
<body><a href="${to}">Redirecting…</a></body></html>`;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Root -> default locale
  fs.writeFileSync(path.join(DIST, "index.html"), redirectPage(`/${DEFAULT_LOCALE}/services/`));

  for (const locale of LOCALES) {
    const c = loadContent(locale);
    const dir = path.join(DIST, locale, "services");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), servicesPage(c, locale));
    // Locale root -> services (until the Home page exists)
    fs.writeFileSync(path.join(DIST, locale, "index.html"), redirectPage(`/${locale}/services/`));
  }

  // Static assets
  fs.cpSync(path.join(ROOT, "static"), path.join(DIST, "static"), { recursive: true });

  console.log(`Built ${LOCALES.length} locales -> ${DIST}`);
}

build();
