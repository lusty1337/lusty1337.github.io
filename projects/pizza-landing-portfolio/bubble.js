// пузырёк желтой жидкости, летящий от кнопки «В корзину» к иконке корзины.
// путь — кубическая безье; к моменту удара капля разгоняется и расплющивается о корзину.

const DURATION = 540;
const SIZE = 18;

function cbez(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
}
function cbezD(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return 3*u*u*(p1-p0) + 6*u*t*(p2-p1) + 3*t*t*(p3-p2);
}
// ускорение к цели — капля влетает в корзину на полной скорости, а не тормозит перед ней
function easeIn(t) { return t * t; }

// брызги, разлетающиеся от точки удара веером «назад» от стенки корзины
function splash(cx, cy, hitAngle) {
  const back = (hitAngle + 180) * Math.PI / 180; // отскок против направления полёта
  const count = 4 + Math.floor(Math.random() * 3); // 4–6 капель
  for (let i = 0; i < count; i++) {
    const p  = document.createElement('div');
    p.className = 'cart-bubble';
    const sz  = 3 + Math.random() * 5;
    const dir = back + (Math.random() - 0.5) * 2.4; // ±~70° разброс
    const dist = 14 + Math.random() * 26;
    const vx = Math.cos(dir) * dist;
    const vy = Math.sin(dir) * dist;
    p.style.width  = sz + 'px';
    p.style.height = sz + 'px';
    p.style.left   = (cx - sz / 2) + 'px';
    p.style.top    = (cy - sz / 2) + 'px';
    p.style.boxShadow = 'none';
    document.body.appendChild(p);

    const start = performance.now();
    const dur   = 200 + Math.random() * 160;
    function tick(ts) {
      const t = Math.min((ts - start) / dur, 1);
      const e = 1 - (1 - t) * (1 - t);          // ease-out
      p.style.left    = (cx - sz / 2 + vx * e) + 'px';
      p.style.top     = (cy - sz / 2 + vy * e + 46 * t * t) + 'px'; // гравитация
      p.style.opacity = (1 - t * t).toString();
      if (t < 1) requestAnimationFrame(tick); else p.remove();
    }
    requestAnimationFrame(tick);
  }
}

export function flyToCart(btnEl, cartEl, onImpact) {
  const br = btnEl.getBoundingClientRect();
  const cr = cartEl.getBoundingClientRect();

  const x0 = br.left + br.width  / 2, y0 = br.top  + br.height / 2;
  const x3 = cr.left + cr.width  / 2, y3 = cr.top  + cr.height / 2;

  const dx = x3 - x0, dy = y3 - y0;

  // сначала вниз (капля «вытекает» из кнопки), потом дуга вверх прямо в корзину
  const x1 = x0, y1 = y0 + 180;                      // нырок вниз
  const x2 = x3 + 60, y2 = y3 + Math.abs(dy) * 0.4;  // подход снизу

  const b = document.createElement('div');
  b.className = 'cart-bubble';
  document.body.appendChild(b);

  let t0 = null;
  function frame(ts) {
    if (!t0) t0 = ts;
    const raw = Math.min((ts - t0) / DURATION, 1);
    const t   = easeIn(raw);

    const x  = cbez(t, x0, x1, x2, x3);
    const y  = cbez(t, y0, y1, y2, y3);
    const vx = cbezD(t, x0, x1, x2, x3);
    const vy = cbezD(t, y0, y1, y2, y3);

    // растяжение учитывает и производную easeIn (2*raw) — к удару капля вытягивается в струю
    const speed   = Math.sqrt(vx*vx + vy*vy) * (2 * raw);
    const angle   = Math.atan2(vy, vx) * 180 / Math.PI;
    const stretch = 1 + Math.min(speed / 1400, 2.4);

    b.style.left      = (x - SIZE / 2) + 'px';
    b.style.top       = (y - SIZE / 2) + 'px';
    b.style.transform = `rotate(${angle.toFixed(1)}deg) scaleX(${stretch.toFixed(3)})`;

    if (raw < 1) { requestAnimationFrame(frame); return; }

    // удар о стенку корзины: капля расплющивается вдоль направления полёта и гаснет
    const hitAngle = Math.atan2(vy, vx) * 180 / Math.PI;
    b.style.transition = 'transform 90ms cubic-bezier(.2,.7,.3,1), opacity 110ms ease-out';
    b.style.transform  = `rotate(${hitAngle.toFixed(1)}deg) scaleX(0.18) scaleY(2.6)`;
    b.style.opacity    = '0';
    setTimeout(() => b.remove(), 120);

    // число у корзины растёт ровно сейчас — когда капля коснулась иконки
    if (typeof onImpact === 'function') onImpact();

    splash(x3, y3, hitAngle);

    // вспышка на иконке
    cartEl.classList.remove('is-splashed');
    void cartEl.offsetWidth;
    cartEl.classList.add('is-splashed');
    cartEl.addEventListener('animationend', () => cartEl.classList.remove('is-splashed'), { once: true });
  }
  requestAnimationFrame(frame);
}
