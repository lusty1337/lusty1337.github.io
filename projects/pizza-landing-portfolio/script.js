import { initMenu } from "./menu.js";
import { initCart } from "./cart.js";
import { wirePortfolioButtons } from "./toast.js";
import { initHeroPoints } from "./hero.js";
import { initScrollReveal, observeReveal } from "./reveal.js";
import { initTouchCards } from "./touch-cards.js";

initScrollReveal(); // io создаётся первым — иначе observeReveal ниже получит null
initMenu();
initCart();
wirePortfolioButtons();
initHeroPoints();
initTouchCards();

// подключаем карточки меню к тому же IO — каскадная задержка по индексу внутри грида
document.querySelectorAll(".card").forEach(card => {
  const idx = [...card.parentElement.children].indexOf(card);
  card.style.setProperty("--card-delay", "0ms");
  observeReveal(card);
});

// бургер-меню
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function closeNav() {
  burger.classList.remove("is-open");
  nav.classList.remove("is-open");
}

burger.addEventListener("click", () => {
  burger.classList.toggle("is-open");
  nav.classList.toggle("is-open");
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") closeNav();
});
// тап вне nav и бургера закрывает меню
document.addEventListener("pointerdown", e => {
  if (nav.classList.contains("is-open") &&
      !e.target.closest("#nav") &&
      !e.target.closest("#burger")) closeNav();
}, { passive: true });

// уплотняем шапку после небольшого скролла
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
addEventListener("scroll", onScroll, { passive: true });
