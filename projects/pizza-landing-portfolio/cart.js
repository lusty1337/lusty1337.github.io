// корзина: состояние в localStorage, выезжающая панель, счётчик в шапке.

import { ITEM_BY_ID, money } from "./data.js";
import { flyToCart } from "./bubble.js";

const KEY = "forno_cart";
let state = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return new Map(Object.entries(raw).filter(([id, q]) => ITEM_BY_ID.has(id) && q > 0));
  } catch { return new Map(); }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(state)));
}

const count = () => [...state.values()].reduce((a, b) => a + b, 0);
const total = () => [...state].reduce((sum, [id, q]) => sum + ITEM_BY_ID.get(id).price * q, 0);

let el = {};

export function initCart() {
  el = {
    root:    document.getElementById("cart"),
    body:    document.getElementById("cart-body"),
    foot:    document.getElementById("cart-foot"),
    total:   document.getElementById("cart-total"),
    badge:   document.getElementById("basket-count"),
    openBtn: document.getElementById("basket"),
  };

  el.openBtn.addEventListener("click", open);
  el.root.addEventListener("click", e => {
    if (e.target.closest("[data-cart-close]")) close();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  el.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id  = btn.closest(".cart-row").dataset.id;
    const act = btn.dataset.act;
    if (act === "inc") change(id, +1);
    if (act === "dec") change(id, -1);
    if (act === "del") { state.delete(id); commit(); }
  });

  // кнопки «В корзину» по всей странице
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (!add) return;
    addToCart(add.dataset.add, add);
  });

  renderBadge();
  renderBody();
}

function addToCart(id, btnEl) {
  if (!ITEM_BY_ID.has(id)) return;

  if (btnEl) {
    // налив жёлтым — только для мыши; на тач-экранах кнопка «вдавливается» через :active
    if (matchMedia("(hover: hover)").matches) {
      btnEl.classList.add("is-draining");
      btnEl.addEventListener("animationend", () => btnEl.classList.remove("is-draining"), { once: true });
    }
    // счётчик увеличиваем в колбэке — ровно когда капля врежется в корзину
    flyToCart(btnEl, el.openBtn, () => { change(id, +1); bump(); });
  } else {
    change(id, +1);
    bump();
  }
}

function change(id, delta) {
  const next = (state.get(id) || 0) + delta;
  if (next <= 0) state.delete(id);
  else state.set(id, next);
  commit();
}

function commit() {
  save();
  renderBadge();
  renderBody();
}

function renderBadge() {
  const c = count();
  el.badge.textContent = c;
  el.badge.hidden = c === 0;
}

function bump() {
  // «поп» именно счётчика, а не всей иконки — иначе конфликтует со всплеском краски
  el.badge.classList.remove("is-bump");
  void el.badge.offsetWidth;
  el.badge.classList.add("is-bump");
}

function renderBody() {
  if (state.size === 0) {
    el.body.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty__ico">🛒</span>
        <p>Корзина пуста</p>
        <span class="cart-empty__hint">Добавьте что-нибудь вкусное из меню</span>
      </div>`;
    el.foot.hidden = true;
    return;
  }

  el.body.innerHTML = [...state].map(([id, q]) => {
    const it = ITEM_BY_ID.get(id);
    return `
      <div class="cart-row" data-id="${id}">
        <img class="cart-row__img" src="./assets/${it.dir}/${it.img}.webp" alt="${it.name}">
        <div class="cart-row__info">
          <span class="cart-row__name">${it.name}</span>
          <span class="cart-row__price">${money(it.price)}</span>
        </div>
        <div class="cart-row__qty">
          <button data-act="dec" aria-label="Убрать одну">−</button>
          <span>${q}</span>
          <button data-act="inc" aria-label="Добавить одну">+</button>
        </div>
        <button class="cart-row__del" data-act="del" aria-label="Удалить">✕</button>
      </div>`;
  }).join("");

  el.total.textContent = money(total());
  el.foot.hidden = false;
}

function open() {
  el.root.classList.add("is-open");
  el.root.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function close() {
  el.root.classList.remove("is-open");
  el.root.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
