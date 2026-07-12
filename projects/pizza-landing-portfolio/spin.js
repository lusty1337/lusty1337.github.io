// анимации кадров в карточках меню.
//
// spin (пиццы, тарелки): курсор зашёл — резкий начальный ИМПУЛЬС, дальше
// кадр крутится ПО ИНЕРЦИИ, сразу замедляясь до минимальной скорости за ~1с,
// и тихонько крутится, пока курсор на карточке. ушёл — доезжает до нуля.
// никакого разгона: скорость мгновенно прыгает к импульсу и только падает.
//
// sway (напитки, ракурс 3/4): маятниковое покачивание. амплитуда плавно
// нарастает на входе и плавно гаснет на выходе — поэтому при уводе курсора
// стакан не дёргается, а мягко замирает в нуле (в отличие от CSS-анимации,
// которую нельзя аккуратно остановить посреди цикла).
//
// оба режима крутит один общий rAF, засыпающий, когда двигать нечего.

const IMPULSE = 7;    // начальный толчок, град/кадр
const IDLE = 0.4;     // минимальная скорость, до которой скатываемся за ~1с
const EASING = 0.08;  // за ~60 кадров (1с) почти достигаем цели
const STOP = 0.01;    // порог полной остановки

const SWAY_MAX = 2.2;  // амплитуда покачивания, град
const SWAY_STEP = 0.17; // прирост фазы за кадр (~0.6с период)
const AMP_EASE = 0.1;   // скорость нарастания/гашения амплитуды

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initSpin(cards) {
  if (reduce) return;
  const items = [];
  let rafId = null;

  cards.forEach(card => {
    const img = card.querySelector(".card__img");
    if (!img) return;
    const s = { img, speed: 0, angle: 0, hovered: false };
    items.push(s);
    // импульс задаётся мгновенно — отсюда «толчок» без разгона
    card.addEventListener("pointerenter", () => { s.hovered = true; s.speed = IMPULSE; wake(); });
    card.addEventListener("pointerleave", () => { s.hovered = false; wake(); });
  });

  function frame() {
    let alive = false;
    for (const s of items) {
      const target = s.hovered ? IDLE : 0;
      s.speed += (target - s.speed) * EASING;

      if (!s.hovered && Math.abs(s.speed) < STOP) s.speed = 0;
      else alive = true;

      if (s.speed !== 0) {
        s.angle = (s.angle + s.speed) % 360;
        s.img.style.transform = `rotate(${s.angle}deg)`;
      }
    }
    rafId = alive ? requestAnimationFrame(frame) : null;
  }
  function wake() { if (rafId === null) rafId = requestAnimationFrame(frame); }
}

export function initSway(cards) {
  if (reduce) return;
  const items = [];
  let rafId = null;

  cards.forEach(card => {
    const img = card.querySelector(".card__img");
    if (!img) return;
    const s = { img, amp: 0, target: 0, phase: 0 };
    items.push(s);
    card.addEventListener("pointerenter", () => { s.target = SWAY_MAX; wake(); });
    card.addEventListener("pointerleave", () => { s.target = 0; wake(); });
  });

  function frame() {
    let alive = false;
    for (const s of items) {
      s.amp += (s.target - s.amp) * AMP_EASE;

      if (s.target === 0 && s.amp < 0.01) {
        // амплитуда угасла — мягко фиксируем ноль, без рывка
        if (s.amp !== 0) { s.amp = 0; s.img.style.transform = "rotate(0deg)"; }
      } else {
        alive = true;
        s.phase += SWAY_STEP;
        s.img.style.transform = `rotate(${(s.amp * Math.sin(s.phase)).toFixed(3)}deg)`;
      }
    }
    rafId = alive ? requestAnimationFrame(frame) : null;
  }
  function wake() { if (rafId === null) rafId = requestAnimationFrame(frame); }
}
