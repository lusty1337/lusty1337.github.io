(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // без этого таб уводит на невидимые пункты меню, пока оно закрыто
    const syncInert = () => {
      const isMobileLayout = getComputedStyle(navToggle).display !== 'none';
      navLinks.inert = isMobileLayout && !navLinks.classList.contains('is-open');
    };
    syncInert();
    navToggle.addEventListener('click', syncInert);
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', syncInert));
    window.addEventListener('resize', syncInert);
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  const heroMedia = document.getElementById('heroMedia');
  if (heroMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const shift = window.scrollY * 0.28;
        heroMedia.style.transform = `translateY(${shift}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  const slider = document.getElementById('slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slider-slide'));
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    const counter = document.getElementById('sliderCounter');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const filterButtons = document.querySelectorAll('.gallery-filters button');
    const masonryShots = document.querySelectorAll('.masonry .shot');

    let current = 0;
    let activeFilter = 'all';

    const visibleSlideIndexes = () =>
      slides
        .map((s, i) => ({ i, cat: s.dataset.category }))
        .filter((s) => activeFilter === 'all' || s.cat === activeFilter)
        .map((s) => s.i);

    function pad(n) { return String(n + 1).padStart(2, '0'); }

    function goTo(index) {
      const visible = visibleSlideIndexes();
      if (!visible.length) return;
      if (!visible.includes(index)) index = visible[0];

      slides[current]?.classList.remove('is-active');
      thumbs[current]?.classList.remove('is-active');

      current = index;

      slides[current].classList.add('is-active');
      thumbs[current]?.classList.add('is-active');
      if (counter) counter.textContent = `${pad(current)} / ${pad(slides.length - 1)}`;
    }

    function step(dir) {
      const visible = visibleSlideIndexes();
      if (!visible.length) return;
      const pos = visible.indexOf(current);
      const nextPos = (pos + dir + visible.length) % visible.length;
      goTo(visible[nextPos]);
    }

    prevBtn?.addEventListener('click', () => step(-1));
    nextBtn?.addEventListener('click', () => step(1));

    thumbs.forEach((t) => {
      t.addEventListener('click', () => goTo(Number(t.dataset.index)));
    });

    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
    // activeElement === body значит юзер никуда не фокусился —
    // стрелки без явного фокуса на слайдере тоже должны листать, но не когда он в поле формы
    document.addEventListener('keydown', (e) => {
      if (document.activeElement === document.body) {
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }
    });

    let touchStartX = 0;
    let touchDeltaX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    slider.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 40) step(touchDeltaX < 0 ? 1 : -1);
    });

    masonryShots.forEach((shot) => {
      shot.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = Number(shot.dataset.index);
        goTo(idx);
        slider.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterButtons.forEach((b) => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });

        masonryShots.forEach((shot) => {
          const match = activeFilter === 'all' || shot.dataset.category === activeFilter;
          shot.classList.toggle('is-hidden', !match);
        });

        const visible = visibleSlideIndexes();
        if (visible.length && !visible.includes(current)) goTo(visible[0]);
      });
    });

    goTo(0);
  }

  const form = document.getElementById('bookingForm');
  if (form) {
    const status = document.getElementById('formStatus');

    const validators = {
      name: (v) => v.trim().length >= 2,
      contact: (v) => {
        const val = v.trim();
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phone = /^[+]?[\d\s()-]{7,}$/;
        return email.test(val) || phone.test(val);
      },
      date: (v) => {
        if (!v) return false;
        const chosen = new Date(v + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return chosen >= today;
      },
    };

    function validateField(input) {
      const fieldWrap = input.closest('.field');
      if (!fieldWrap) return true;
      const validator = validators[input.name];
      const isValid = validator ? validator(input.value) : true;
      fieldWrap.classList.toggle('has-error', !isValid);
      return isValid;
    }

    ['name', 'contact', 'date'].forEach((fieldName) => {
      const input = form.elements[fieldName];
      input?.addEventListener('blur', () => validateField(input));
      input?.addEventListener('input', () => {
        if (input.closest('.field')?.classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      ['name', 'contact', 'date'].forEach((fieldName) => {
        const input = form.elements[fieldName];
        if (!validateField(input)) valid = false;
      });

      if (!valid) {
        if (status) {
          status.textContent = 'Проверьте, пожалуйста, заполненные поля.';
          status.classList.remove('is-success');
        }
        form.querySelector('.field.has-error input')?.focus();
        return;
      }

      if (status) {
        status.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
        status.classList.add('is-success');
      }
      form.reset();
    });
  }
})();
