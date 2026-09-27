(() => {
  'use strict';

  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  };

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  const modal = document.getElementById('bookingModal');
  let lastFocusedEl = null;

  const openModal = () => {
    // запоминаем, откуда пришли, чтобы вернуть фокус туда после закрытия
    lastFocusedEl = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  };

  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  const formatPhone = (value) => {
    // убираем ведущую 7 или 8 — человек может начать вводить с них, а формат всегда +7
    const digits = value.replace(/\D/g, '').replace(/^7|^8/, '');
    const parts = digits.slice(0, 10);
    let result = '+7';
    if (parts.length > 0) result += ` (${parts.slice(0, 3)}`;
    if (parts.length >= 3) result += `) `;
    if (parts.length > 3) result += parts.slice(3, 6);
    if (parts.length > 6) result += `-${parts.slice(6, 8)}`;
    if (parts.length > 8) result += `-${parts.slice(8, 10)}`;
    return result;
  };

  document.querySelectorAll('input[name="phone"]').forEach((input) => {
    input.addEventListener('input', (e) => {
      // курсор возвращаем в конец только если он и был в конце — правка середины номера
      // и так редкий случай, а пересчитывать позицию после переформатирования себе дороже
      const cursorAtEnd = e.target.selectionEnd === e.target.value.length;
      e.target.value = e.target.value ? formatPhone(e.target.value) : '';
      if (cursorAtEnd) e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    });
    input.addEventListener('focus', (e) => {
      if (!e.target.value) e.target.value = '+7 (';
    });
  });

  const validateForm = (form) => {
    let isValid = true;
    form.querySelectorAll('.contact-form__field').forEach((field) => {
      const input = field.querySelector('input');
      const error = field.querySelector('.contact-form__error');
      let message = '';

      if (input.name === 'name' && input.value.trim().length < 2) {
        message = 'Введите имя';
      }
      if (input.name === 'phone') {
        const digits = input.value.replace(/\D/g, '');
        if (digits.length < 11) message = 'Введите номер телефона полностью';
      }

      if (message) {
        isValid = false;
        input.classList.add('is-invalid');
        error.textContent = message;
        error.classList.add('is-visible');
      } else {
        input.classList.remove('is-invalid');
        error.classList.remove('is-visible');
      }
    });
    return isValid;
  };

  const setupForm = (formId, successId) => {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form) return;

    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        input.closest('.contact-form__field').querySelector('.contact-form__error').classList.remove('is-visible');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // бэкенда нет, поэтому просто показываем успех — если появится API, отправка уйдёт сюда
      if (!validateForm(form)) return;

      success.classList.add('is-visible');
      form.querySelectorAll('input').forEach((input) => { input.value = ''; });

      setTimeout(() => success.classList.remove('is-visible'), 5000);

      if (form.id === 'modalForm') {
        // не закрываем модалку сразу — пусть человек успеет увидеть сообщение об успехе
        setTimeout(closeModal, 1200);
      }
    });
  };

  setupForm('contactForm', 'formSuccess');
  setupForm('modalForm', 'modalSuccess');

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const navLinks = document.querySelectorAll('#navLinks a');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    // отрицательные отступы сверху и снизу сжимают зону срабатывания в тонкую
    // полосу у середины экрана — иначе при быстром скролле подсвечивались бы
    // сразу две соседние секции
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`#navLinks a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.style.color = '');
          link.style.color = 'var(--accent-text)';
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => navObserver.observe(section));
  }

  // карта — тяжёлый сторонний iframe, поэтому вставляем его в DOM только
  // когда пользователь реально долистал до контактов, а не при заходе на сайт
  const mapContainer = document.getElementById('mapContainer');
  const mapPlaceholder = document.getElementById('mapPlaceholder');

  if (mapContainer && mapPlaceholder) {
    let mapLoaded = false;
    const loadMap = () => {
      if (mapLoaded) return;
      mapLoaded = true;
      const iframe = document.createElement('iframe');
      iframe.src = mapContainer.dataset.mapSrc;
      iframe.title = mapContainer.dataset.mapTitle;
      iframe.loading = 'lazy';
      iframe.width = '100%';
      iframe.height = '100%';
      mapContainer.replaceChildren(iframe);
    };

    mapPlaceholder.addEventListener('click', loadMap);

    if ('IntersectionObserver' in window) {
      const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMap();
            mapObserver.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      mapObserver.observe(mapContainer);
    }
  }
})();
