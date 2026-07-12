import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth < 768;

const REPLAY = isMobile ? 'play none none reset' : 'restart none none reverse';
const MOVE_Y = isMobile ? 20 : 40;

gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: MOVE_Y },
        {
            opacity: 1, y: 0, duration: isMobile ? 0.6 : 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: REPLAY }
        }
    );
});

// компетенции — на десктопе каскадом от контейнера, на мобилке каждая карточка сама
const compReveal = document.querySelector('.competencies-reveal');
if (compReveal) {
    const items = compReveal.querySelectorAll('.card-title, .comp-card');
    if (isMobile) {
        items.forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: MOVE_Y },
                {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: REPLAY }
                }
            );
        });
    } else {
        gsap.fromTo(items,
            { opacity: 0, y: MOVE_Y },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: { trigger: compReveal, start: 'top 70%', toggleActions: REPLAY }
            }
        );
    }
}

// шрифты догружаются и сдвигают вёрстку — пересчитываем точки триггеров
window.addEventListener('load', () => ScrollTrigger.refresh());

// наклон + свечение только на превью, всё в одном обработчике
// на тач-устройствах не вешаем — иначе залипает после первого тапа
if (window.matchMedia('(hover: hover)').matches) {
    const glowColors = ['34,211,238', '99,102,241', '255,90,0', '255,90,0', '168,85,247']; // cyan, indigo, orange, orange, violet

    document.querySelectorAll('.sandbox-preview').forEach((preview, i) => {
        const c = glowColors[i] || glowColors[0];
        preview.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
        preview.style.transformStyle = 'preserve-3d';

        preview.addEventListener('mouseenter', () => {
            preview.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 1.4s cubic-bezier(0.16,1,0.3,1)';
            preview.style.boxShadow  = `0 0 28px 4px rgba(${c},0.15)`;
        });

        preview.addEventListener('mousemove', (e) => {
            const r  = preview.getBoundingClientRect();
            const x  = e.clientX - r.left;
            const y  = e.clientY - r.top;
            const cx = (x / r.width  - 0.5) * 2;
            const cy = (y / r.height - 0.5) * 2;
            const d  = Math.sqrt(cx * cx + cy * cy) / Math.SQRT2;
            const rotateX = cy * -8;
            const rotateY = cx *  8;
            const ox = cx * 30;
            const oy = cy * 30;
            // чуть удлинённый transition — карточка мягче догоняет курсор, но не плывёт за ним
            preview.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s linear';
            preview.style.transform  = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            preview.style.boxShadow  = `${ox}px ${oy}px 48px 5px rgba(${c},${(0.26 + d * 0.07).toFixed(2)}), 0 0 20px rgba(${c},${(0.08 * (1 - d * 0.5)).toFixed(2)})`;
        });

        preview.addEventListener('mouseleave', () => {
            preview.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 1.4s cubic-bezier(0.16,1,0.3,1)';
            preview.style.transform  = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
            preview.style.boxShadow  = '';
        });
    });
}

// желе через пружинную симуляцию в одном rAF-цикле (как Framer Motion / react-spring).
// карточки непрерывно тянутся к цели — смена курсора просто меняет цель,
// пружина перенаправляется с текущей скоростью без отмен и разрывов
const jellyContainer = document.querySelector('.comp-grid');
if (jellyContainer) {
    const compCards = Array.from(jellyContainer.querySelectorAll('.comp-card'));

    // жёсткость задаёт скорость пружины, затухание — величину отскока
    const STIFFNESS = 0.025;
    const DAMPING = 0.82;
    const EPS = 0.0006; // порог, ниже которого считаем что карточка остановилась

    // дальние карточки чуть мягче — естественный каскад «желе»
    const stiffnessFor = (cardIdx, activeIdx) => {
        if (activeIdx === null) return STIFFNESS;
        const dist = Math.abs(cardIdx - activeIdx);
        return STIFFNESS * (1 - dist * 0.18);
    };

    // состояние каждой карточки: позиция и скорость по двум параметрам
    const sim = compCards.map(() => ({ scale: 1, scaleV: 0, shift: 0, shiftV: 0 }));
    let activeIdx = null;
    let rafId = null;

    const targetFor = (cardIdx) => {
        if (activeIdx === null) return { scale: 1, shift: 0 };
        const isDesktop = window.innerWidth >= 1024;
        if (cardIdx === activeIdx) return { scale: isDesktop ? 1.12 : 1.05, shift: 0 };
        const sh = isDesktop ? 6 : 2.5;
        return { scale: 1, shift: cardIdx < activeIdx ? -sh : sh };
    };

    const tick = () => {
        const isDesktop = window.innerWidth >= 1024;
        let moving = false;

        sim.forEach((s, i) => {
            const t = targetFor(i);
            const k = stiffnessFor(i, activeIdx);

            // полунеявный Эйлер: к скорости добавляем притяжение к цели, гасим затуханием
            s.scaleV = (s.scaleV + (t.scale - s.scale) * k) * DAMPING;
            s.scale += s.scaleV;
            s.shiftV = (s.shiftV + (t.shift - s.shift) * k) * DAMPING;
            s.shift += s.shiftV;

            if (Math.abs(s.scaleV) > EPS || Math.abs(t.scale - s.scale) > EPS ||
                Math.abs(s.shiftV) > EPS || Math.abs(t.shift - s.shift) > EPS) {
                moving = true;
            } else {
                // защёлкиваем точно в цель, иначе остаётся еле заметный остаток
                s.scale = t.scale; s.scaleV = 0;
                s.shift = t.shift; s.shiftV = 0;
            }

            compCards[i].style.transform = isDesktop
                ? `translate3d(${s.shift.toFixed(3)}%,0,0) scale(${s.scale.toFixed(4)})`
                : `translate3d(0,${s.shift.toFixed(3)}%,0) scale(${s.scale.toFixed(4)})`;
            compCards[i].classList.toggle('is-jelly-active', i === activeIdx);
        });

        rafId = moving ? requestAnimationFrame(tick) : null;
    };

    // у .card-* от системы появления висит transition: transform 0.7s —
    // он тормозит каждую инлайн-запись transform и съедает отклик пружины.
    // снимаем его при первом взаимодействии (появление к этому моменту уже отыграло)
    let primed = false;
    const prime = () => {
        if (primed) return;
        primed = true;
        compCards.forEach(c => { c.style.transition = 'box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; });
    };

    const setActive = (idx) => {
        if (idx === activeIdx) return;
        prime();
        activeIdx = idx;

        // лёгкий импульс в сторону цели — движение трогается сразу, но без рывка
        sim.forEach((s, i) => {
            const t = targetFor(i);
            s.scaleV += (t.scale - s.scale) * 0.12;
            s.shiftV += (t.shift - s.shift) * 0.12;
        });

        if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    const isTouch = window.matchMedia('(hover: none)').matches;

    if (isTouch) {
        compCards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                setActive(activeIdx === idx ? null : idx);
            });
        });
        document.addEventListener('click', (e) => {
            if (!jellyContainer.contains(e.target)) setActive(null);
        });
    } else {
        // выбираем карточку по позиции курсора относительно НЕПОДВИЖНОГО контейнера —
        // трансформации карточек не влияют на выбор, петля дёрганий невозможна
        const pickIndex = (clientX) => {
            const r = jellyContainer.getBoundingClientRect();
            if (clientX < r.left || clientX > r.right) return null;
            return Math.min(2, Math.floor((clientX - r.left) / r.width * 3));
        };

        jellyContainer.addEventListener('mousemove', (e) => setActive(pickIndex(e.clientX)));
        jellyContainer.addEventListener('mouseleave', () => setActive(null));
    }
}

const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;

const toggleMenu = () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileBtn.children[0].style.transform = 'translateY(8px) rotate(45deg)';
        mobileBtn.children[1].style.opacity = '0';
        mobileBtn.children[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.children[0].style.transform = '';
        mobileBtn.children[1].style.opacity = '';
        mobileBtn.children[2].style.transform = '';
    }
};

if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
    }));
}

// прожектор + брендовый цвет на бейджах. работает везде: стек + проекты
(function () {
    const stackCard = document.querySelector('.stack-card');
    if (!stackCard) return;

    const isHover = window.matchMedia('(hover: hover)').matches;

    if (isHover) {
        stackCard.style.position = 'relative';
        const spotlight = document.createElement('div');
        spotlight.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity 1.1s cubic-bezier(0.16,1,0.3,1)';
        stackCard.prepend(spotlight);
        stackCard.addEventListener('mousemove', (e) => {
            const r = stackCard.getBoundingClientRect();
            spotlight.style.background = `radial-gradient(460px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(34,211,238,0.09) 0%, transparent 70%)`;
            spotlight.style.opacity = '1';
        });
        stackCard.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; });
    }

    const TRANSITION = [
        'color 0.35s cubic-bezier(0.16,1,0.3,1)',
        'border-color 0.35s cubic-bezier(0.16,1,0.3,1)',
        'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        'background-color 0.7s cubic-bezier(0.16,1,0.3,1)',
    ].join(', ');

    const activate = (badge, rgb) => {
        badge.style.backgroundColor = 'rgba(255,255,255,0.05)';
        badge.style.color = `rgb(${rgb})`;
        badge.style.borderColor = `rgba(${rgb},0.45)`;
        badge.style.boxShadow = `0 0 14px rgba(${rgb},0.3), 0 0 8px rgba(${rgb},0.12)`;
        badge.style.transform = 'translateY(-2px)';
        badge._on = true;
    };
    const deactivate = (badge) => {
        badge.style.backgroundColor = '';
        badge.style.color = '';
        badge.style.borderColor = '';
        badge.style.boxShadow = '';
        badge.style.transform = 'translateY(0px)';
        badge._on = false;
    };

    // секция стека + каждая проектная карточка — отдельные группы
    const groups = [stackCard, ...document.querySelectorAll('#projects .reveal')];

    groups.forEach(container => {
        const badges = container.querySelectorAll('.stack-badge');
        if (!badges.length) return;

        badges.forEach(badge => {
            const rgb = badge.dataset.brand || '34,211,238';
            badge.style.transition = TRANSITION;

            if (isHover) {
                badge.addEventListener('mouseenter', () => activate(badge, rgb));
                badge.addEventListener('mouseleave', () => deactivate(badge));
            } else {
                badge.addEventListener('touchend', (e) => {
                    const t = e.changedTouches[0];
                    const el = document.elementFromPoint(t.clientX, t.clientY);
                    if (!el || (el !== badge && !badge.contains(el))) return;

                    if (badge._on) { deactivate(badge); return; }
                    // в одной группе одновременно активна только одна пилюля
                    badges.forEach(b => { if (b._on) deactivate(b); });
                    activate(badge, rgb);
                }, { passive: true });
            }
        });
    });

    // тап вне любого бейджа — глобальный сброс
    if (!isHover) {
        document.addEventListener('touchend', (e) => {
            if (!e.target.closest('.stack-badge')) {
                document.querySelectorAll('.stack-badge').forEach(b => { if (b._on) deactivate(b); });
            }
        }, { passive: true });
    }
})();
