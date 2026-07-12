// плавное появление блоков по мере прокрутки — включаем только на узких экранах
// (телефоны/планшеты-портрет) и уважаем настройку «меньше движения»

let io = null;

export function initScrollReveal() {
  const narrow  = matchMedia("(max-width: 860px)").matches;
  const calm    = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!narrow || calm || !("IntersectionObserver" in window)) return;

  const targets = [...document.querySelectorAll(
    ".hero__content, .hero__visual, .tabs, .menu__panels, " +
    ".section-title, .promo__card, .review, .video__text, .video__thumb, .footer__inner"
  )];
  if (!targets.length) return;

  document.documentElement.classList.add("reveal-ready");
  targets.forEach(el => el.classList.add("reveal"));

  // лёгкий каскад внутри групп, чтобы соседние карточки появлялись друг за другом
  const cascade = sel =>
    document.querySelectorAll(sel).forEach((el, i) => { el.style.transitionDelay = (i * 90) + "ms"; });
  cascade(".promo__card");
  cascade(".reviews__grid .review");

  io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-visible");
      obs.unobserve(e.target);
    }
  }, { threshold: 0.05, rootMargin: "0px 0px 0px 0px" });

  targets.forEach(el => io.observe(el));
}

// подключить произвольный элемент к тому же наблюдателю
export function observeReveal(el) {
  if (!io) return;
  el.classList.add("reveal");
  io.observe(el);
}
