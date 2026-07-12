// на тач-экранах у карточки нет ховера, поэтому имитируем его: тап даёт мягкий
// подъём-возврат (как навели курсор и на пике убрали) и стойкое свечение.
// у кнопки «В корзину» — волна от точки касания и свечение границ, пока палец на ней.
// всё вешаем на pointerdown, чтобы отклик был мгновенным, без задержки click.

export function initTouchCards() {
  if (!matchMedia("(hover: none)").matches) return;

  let pressed = null, startY = 0;

  function selectCard(card) {
    document.querySelectorAll(".card.is-selected").forEach(c => {
      if (c !== card) c.classList.remove("is-selected");
    });
    if (!card) return;
    card.classList.add("is-selected");
    card.classList.remove("is-popping");
    void card.offsetWidth; // перезапуск анимации подскока
    card.classList.add("is-popping");
  }

  function rippleButton(btn, e) {
    btn.classList.add("is-pressed");
    const clear = () => btn.classList.remove("is-pressed");
    btn.addEventListener("pointerup", clear, { once: true });
    btn.addEventListener("pointerleave", clear, { once: true });
    btn.addEventListener("pointercancel", clear, { once: true });

    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - r.left - size / 2) + "px";
    ripple.style.top  = (e.clientY - r.top  - size / 2) + "px";
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  document.addEventListener("pointerdown", e => {
    // кнопку добавления ведём отдельно (волна), карточку при этом не выделяем
    const btn = e.target.closest(".card__btn");
    if (btn) { rippleButton(btn, e); return; }

    const card = e.target.closest(".card");
    pressed = card;
    startY  = e.clientY;
    selectCard(card); // тап по пустому месту (card=null) просто снимает выделение
  }, { passive: true });

  // если жест превратился в прокрутку — отменяем подскок и выделение этой карточки
  document.addEventListener("pointermove", e => {
    if (pressed && Math.abs(e.clientY - startY) > 8) {
      pressed.classList.remove("is-selected", "is-popping");
      pressed = null;
    }
  }, { passive: true });

  document.addEventListener("pointerup",     () => { pressed = null; }, { passive: true });
  document.addEventListener("pointercancel", () => { pressed = null; }, { passive: true });

  document.addEventListener("animationend", e => {
    if (e.target.classList && e.target.classList.contains("is-popping")) {
      e.target.classList.remove("is-popping");
    }
  });
}
