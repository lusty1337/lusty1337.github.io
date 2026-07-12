// сборка карточек меню по категориям + плавное переключение табов

import { CATEGORIES, money } from "./data.js";
import { initSpin, initSway } from "./spin.js";

function cardHTML(item, dir, anim) {
  return `
    <article class="card" data-anim="${anim}">
      <div class="card__media">
        <span class="card__shadow"></span>
        <img class="card__img" src="./assets/${dir}/${item.img}.webp" alt="${item.name}" loading="eager">
      </div>
      <h3 class="card__title">${item.name}</h3>
      <p class="card__desc">${item.desc}</p>
      <div class="card__footer">
        <span class="card__price">${money(item.price)}</span>
        <button class="card__btn" type="button" data-add="${item.img}"><span class="card__btn-txt">В корзину</span></button>
      </div>
    </article>`;
}

export function initMenu() {
  const tabs   = document.getElementById("tabs");
  const panels = document.getElementById("panels");

  tabs.innerHTML   = "";
  panels.innerHTML = "";

  // строим все панели
  CATEGORIES.forEach((cat, i) => {
    tabs.insertAdjacentHTML("beforeend",
      `<button class="tabs__btn${i === 0 ? " is-active" : ""}" data-tab="${cat.key}">${cat.label}</button>`);

    const grid = document.createElement("div");
    grid.className    = "menu__grid";
    grid.dataset.panel = cat.key;
    if (i !== 0) grid.hidden = true;
    grid.innerHTML    = cat.items.map((it, j) => cardHTML(it, cat.dir, cat.anim)).join("");
    panels.appendChild(grid);

    const cards = grid.querySelectorAll(".card");
    if (cat.anim === "spin") initSpin(cards);
    else if (cat.anim === "sway") initSway(cards);
  });

  // ── плавное переключение: fade-out → swap → fade-in ──────────────────────
  const FADE = 200; // мс
  let busy = false;

  tabs.addEventListener("click", e => {
    const btn = e.target.closest(".tabs__btn");
    if (!btn || btn.classList.contains("is-active") || busy) return;

    const key  = btn.dataset.tab;
    const cur  = panels.querySelector(".menu__grid:not([hidden])");
    const next = panels.querySelector(`[data-panel="${key}"]`);
    if (!next || cur === next) return;

    busy = true;

    // обновляем активный таб сразу
    tabs.querySelector(".is-active")?.classList.remove("is-active");
    btn.classList.add("is-active");

    // fade OUT текущей панели
    cur.style.opacity    = "0";
    cur.style.transition = `opacity ${FADE}ms ease`;

    setTimeout(() => {
      cur.hidden         = true;
      cur.style.cssText  = ""; // сбрасываем inline-стили

      // показываем следующую панель прозрачной
      next.hidden          = false;
      next.style.opacity   = "0";
      next.style.transition = "none";

      // один rAF — браузер видит opacity:0; следующий — включаем переход
      requestAnimationFrame(() => requestAnimationFrame(() => {
        next.style.transition = `opacity ${FADE}ms ease`;
        next.style.opacity    = "1";

        setTimeout(() => {
          next.style.cssText = ""; // сбрасываем inline-стили
          busy = false;
        }, FADE);
      }));
    }, FADE);
  });
}
