// позиционирует жёлтые точки ровно на пунктирном кольце героя.
// считаем радиус из размеров .hero__stage (не из .hero__ring, потому что
// ring вращается, и getBoundingClientRect у квадратного элемента меняется
// при повороте, а у stage — нет).

export function initHeroPoints() {
  const visual = document.querySelector('.hero__visual');
  const stage  = document.querySelector('.hero__stage');
  const points = [...document.querySelectorAll('.hero__point')];

  // показываем визуал только после загрузки картинки — до этого stage невидим
  const pizzaImg = stage?.querySelector('.hero__pizza');
  if (pizzaImg) {
    const reveal = () => stage.classList.add('is-loaded');
    if (pizzaImg.complete) reveal();
    else { pizzaImg.addEventListener('load', reveal); pizzaImg.addEventListener('error', reveal); }
  }
  if (!visual || !stage || !points.length) return;

  // y-доли должны совпадать с тем, что нарисовано в HTML
  const fracs = [0.15, 0.39, 0.61, 0.85];

  function place() {
    const vr = visual.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();

    // ring задан через inset: -4% от stage → 8% шире с каждой стороны
    // радиус визуального круга = 54% от ширины stage
    const R  = sr.width * 0.54;
    const cx = sr.left + sr.width  / 2 - vr.left;
    const cy = sr.top  + sr.height / 2 - vr.top;

    points.forEach((pt, i) => {
      const y  = vr.height * fracs[i];
      const dy = y - cy;

      if (Math.abs(dy) >= R - 1) { pt.style.visibility = 'hidden'; return; }

      // x-координата на левом крае окружности (центр пунктирной линии)
      const dotX = cx - Math.sqrt(R * R - dy * dy);

      // translateY(-50%): top элемента = y, центр элемента = y → dot (top:50%) тоже на y
      // right - 4: right-край dot = dotX + 4, центр dot (width:8px) = dotX
      pt.style.top        = (y / vr.height * 100) + '%';
      pt.style.transform  = 'translateY(-50%)';
      pt.style.right      = (vr.width - dotX - 4) + 'px';
      pt.style.visibility = '';
    });
  }

  // два rAF: дожидаемся, пока aspect-ratio и transform отработают
  requestAnimationFrame(() => requestAnimationFrame(place));

  const ro = new ResizeObserver(() => requestAnimationFrame(place));
  ro.observe(visual);
  ro.observe(stage);
}
