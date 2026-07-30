// честный демо-экран оплаты вместо заглушки-тоста на кнопке «Оформить заказ».
// поверх открытой корзины показываем сводку заказа, дальше — короткий
// спиннер и понятное подтверждение. деньги нигде не списываются.

import { money } from "./data.js";
import { getCartSnapshot, clearCart, closeCart } from "./cart.js";

let overlay = null;

function orderNumber() {
  return "FZ-" + (1000 + Math.floor(Math.random() * 9000));
}

function render() {
  const { items, total } = getCartSnapshot();

  overlay = document.createElement("div");
  overlay.className = "payment-overlay";
  overlay.innerHTML = `
    <div class="payment-card">
      <button class="payment-close" data-payment-close aria-label="Закрыть">✕</button>
      <h3 class="payment-title">Проверьте заказ</h3>
      <div class="payment-items">
        ${items.map(it => `
          <div class="payment-row">
            <span class="payment-row__name">${it.name} × ${it.qty}</span>
            <span class="payment-row__price">${money(it.price * it.qty)}</span>
          </div>`).join("")}
      </div>
      <div class="payment-total"><span>Итого</span><span>${money(total)}</span></div>
      <div class="payment-demo">
        <span class="payment-demo__label">Демо-режим</span>
        <span>Оплата не проводится — это учебный проект портфолио, а не рабочий магазин.</span>
      </div>
      <button class="btn btn--primary payment-pay" type="button">Оплатить (демо)</button>
    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("is-in"));
  document.body.style.overflow = "hidden";

  overlay.addEventListener("click", e => {
    if (e.target === overlay || e.target.closest("[data-payment-close]")) close();
  });
  overlay.querySelector(".payment-pay").addEventListener("click", pay);
}

function pay() {
  const btn = overlay.querySelector(".payment-pay");
  btn.disabled = true;
  btn.classList.add("is-loading");
  btn.innerHTML = `<span class="payment-spinner"></span>`;

  setTimeout(() => {
    const number = orderNumber();
    const card = overlay.querySelector(".payment-card");
    card.innerHTML = `
      <div class="payment-done">
        <span class="payment-done__ico">✓</span>
        <h3 class="payment-title">Заказ оформлен</h3>
        <p class="payment-done__num">№ ${number}</p>
        <p class="payment-done__hint">Заказ существует только внутри демо: деньги не списаны, курьер не приедет.</p>
        <button class="btn btn--primary payment-close-btn" type="button">Готово</button>
      </div>`;
    card.querySelector(".payment-close-btn").addEventListener("click", () => {
      clearCart();
      close();
      closeCart();
    });
  }, 900);
}

function close() {
  if (!overlay) return;
  overlay.classList.remove("is-in");
  document.body.style.overflow = "";
  overlay.addEventListener("transitionend", () => overlay?.remove(), { once: true });
  setTimeout(() => { overlay?.remove(); overlay = null; }, 400);
}

export function initPayment() {
  const checkoutBtn = document.getElementById("cart-checkout");
  checkoutBtn?.addEventListener("click", render);
}
