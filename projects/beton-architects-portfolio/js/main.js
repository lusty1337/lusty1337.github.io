(function () {
  'use strict';

  // медиазапрос в css глушит только css-анимации, до gsap он не достаёт —
  // поэтому при «уменьшить движение» просто не запускаем твины, а показываем всё сразу
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger) && !noMotion;
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  function initHeader() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;

    function closeMenu() {
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // на десктопной ширине бургер скрыт стилями, но меню могло остаться открытым при ресайзе
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  // набор меток клонируем столько раз, сколько нужно, чтобы он перекрыл экран:
  // при фиксированном числе копий на широком мониторе в конце цикла видно пустоту
  function initTicker() {
    var ticker = document.querySelector('.ticker');
    var track = document.getElementById('ticker-track');
    if (!ticker || !track) return;

    var baseItems = Array.prototype.slice.call(track.children);
    if (!baseItems.length) return;

    var PX_PER_SEC = 55;

    function fill(times) {
      track.innerHTML = '';
      for (var i = 0; i < times; i++) {
        baseItems.forEach(function (el) {
          var copy = el.cloneNode(true);
          // озвучиваем строку скринридеру один раз, копии для него не нужны
          if (i > 0) copy.setAttribute('aria-hidden', 'true');
          track.appendChild(copy);
        });
      }
    }

    function rebuild() {
      fill(1);
      var setWidth = track.scrollWidth;
      if (!setWidth) return;

      var repeats = Math.max(2, Math.ceil((ticker.clientWidth * 2) / setWidth));
      if (repeats % 2 !== 0) repeats++; // чётное, чтобы -50% попадало ровно на стык
      fill(repeats);

      track.style.animationDuration = (track.scrollWidth / 2 / PX_PER_SEC) + 's';
    }

    rebuild();
    // до загрузки шрифтов ширина считается неточно
    window.addEventListener('load', rebuild);

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(rebuild, 200);
    });
  }

  function initTitles() {
    var titles = document.querySelectorAll('.hero__title, .split-title');

    // строки спрятаны в css классом .js, и если анимации не будет — их некому показать.
    // поэтому снимаем сдвиг руками, иначе заголовки останутся за краем навсегда
    if (!hasGSAP) {
      titles.forEach(function (title) {
        title.querySelectorAll('.line > span').forEach(function (line) {
          line.style.transform = 'none';
        });
      });
      return;
    }

    titles.forEach(function (title) {
      var lines = title.querySelectorAll('.line > span');
      if (!lines.length) return;
      // gsap при первом обращении к элементу считывает css-процент (translateY(110%))
      // как обычный пиксельный y и запоминает его отдельно от yPercent — если не обнулить
      // y явно, после анимации останется неубранный остаточный сдвиг
      gsap.set(lines, { y: 0, yPercent: 110, force3D: true });
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.07,
        force3D: true,
        scrollTrigger: {
          trigger: title,
          start: 'top 96%',
          once: true
        },
        // после анимации слой можно снять с композитинга — не нужен статичный will-change навсегда
        onComplete: function () { gsap.set(lines, { clearProps: 'willChange' }); }
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (hasGSAP) {
      gsap.set(items, { opacity: 0, y: 12, force3D: true });
      ScrollTrigger.batch(items, {
        start: 'top 96%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.06,
            force3D: true,
            onComplete: function () { gsap.set(batch, { clearProps: 'willChange' }); }
          });
        }
      });
      return;
    }

    // резерв на случай, если GSAP не загрузился, но JS работает
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;

      if (!hasGSAP) {
        el.textContent = target.toLocaleString('ru-RU');
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 96%',
        once: true,
        onEnter: function () {
          var counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.round(counter.val).toLocaleString('ru-RU'); }
          });
        }
      });
    });
  }

  function initFilters() {
    var buttons = document.querySelectorAll('.filters button');
    if (!buttons.length) return;
    var rows = document.querySelectorAll('.project-row');
    var countEl = document.getElementById('projects-count');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter');
        var shown = 0;
        rows.forEach(function (row) {
          var match = filter === 'all' || row.getAttribute('data-category') === filter;
          row.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (countEl) {
          countEl.textContent = filter === 'all'
            ? 'Показано ' + shown + ' из 34 реализованных и текущих объектов'
            : 'Показано ' + shown + ' — категория «' + btn.textContent.trim() + '»';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initTicker();
    initTitles();
    initReveal();
    initCounters();
    initFilters();

    // шрифты догружаются асинхронно и меняют высоту крупных заголовков —
    // без пересчёта координаты триггеров ScrollTrigger «уезжают» от реальной вёрстки
    if (hasGSAP && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  });
})();
