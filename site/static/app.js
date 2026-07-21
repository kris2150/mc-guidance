// Scroll-spy: highlight the current step in the sidebar while scrolling.
(function () {
  const links = document.querySelectorAll(".step-link");
  const cards = document.querySelectorAll(".step-card");
  if (!links.length || !cards.length) return;

  const byId = {};
  links.forEach((l) => (byId[l.getAttribute("href").slice(1)] = l));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("current"));
          const link = byId[entry.target.id];
          if (link) {
            link.classList.add("current");
            link.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  cards.forEach((c) => observer.observe(c));
})();
