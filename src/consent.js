// баннер куки и метрика по согласию. счётчик раньше стоял прямо в <head> и
// ставил куки до того, как человек что-то решил - по 152-ФЗ так нельзя
import { applyTo, getLang } from './i18n.js';

const COUNTER = 111103163;
const KEY = 'cookie-consent';

// приватный режим или запрет хранилища: решение живёт до перезагрузки страницы
let memory = null;
const read = () => {
    try { return localStorage.getItem(KEY); } catch { return memory; }
};
const write = (value) => {
    memory = value;
    try { localStorage.setItem(KEY, value); } catch { /* остаётся в памяти */ }
};

function loadMetrika() {
    if (window.ym) return;
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        k = e.createElement(t); a = e.getElementsByTagName(t)[0];
        k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    // вебвизор выключен намеренно: записи сессий - лишние данные, которые пришлось бы отдельно описывать в политике
    window.ym(COUNTER, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
}

// скрипт метрики уже в памяти страницы и выгрузить его нельзя. поэтому при отказе
// после согласия стираем её куки и перезагружаем страницу уже без счётчика
function forgetMetrika() {
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ym')).forEach((name) => {
        const host = location.hostname;
        [host, '.' + host, ''].forEach((domain) => {
            document.cookie = `${name}=; Max-Age=0; path=/${domain ? '; domain=' + domain : ''}`;
        });
    });
}

let banner = null;

function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner fixed z-[70] left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10 text-sm text-slate-600';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-labelledby', 'cookie-banner-text');
    banner.innerHTML = `
        <p id="cookie-banner-text" class="leading-relaxed mb-4">
            <span data-i18n="cookie.text"></span>
            <a href="/privacy/#cookies" data-cookie-more data-i18n="cookie.more" class="text-cyan-600 hover:text-teal-600 underline underline-offset-2"></a>
        </p>
        <div class="grid grid-cols-2 gap-2">
            <button type="button" data-cookie="denied" data-i18n="cookie.decline"
                class="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-cyan-300 hover:text-cyan-600 transition-colors duration-300"></button>
            <button type="button" data-cookie="granted" data-i18n="cookie.accept"
                class="px-4 py-2.5 rounded-full bg-slate-900 border border-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors duration-300"></button>
        </div>`;
    applyTo(banner);
    // в политике оба языка лежат на одной странице, и у английского раздела про куки свой якорь
    const more = banner.querySelector('[data-cookie-more]');
    const setMore = () => { more.href = getLang() === 'en' ? '/privacy/#cookies-en' : '/privacy/#cookies'; };
    setMore();
    window.addEventListener('langchange', setMore);
    banner.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cookie]');
        if (btn) decide(btn.dataset.cookie);
    });
    document.body.appendChild(banner);
}

// пауза при первом заходе: баннер, который выскочил вместе со страницей, читается
// как помеха. появившись чуть позже и движением, он замечается, но не перебивает
const FIRST_DELAY = 1400;

function showBanner() {
    if (!banner) buildBanner();
    // чтение размера фиксирует начальное состояние только что вставленного баннера,
    // иначе переход не сыграет. rAF тут не годится - в фоновой вкладке он не приходит
    void banner.offsetWidth;
    banner.classList.add('is-shown');
}

function decide(value) {
    const before = read();
    write(value);
    banner.classList.remove('is-shown');
    if (value === 'granted') loadMetrika();
    else if (before === 'granted') { forgetMetrika(); location.reload(); }
}

export function initConsent() {
    const saved = read();
    if (saved === 'granted') loadMetrika();
    else if (saved !== 'denied') setTimeout(showBanner, FIRST_DELAY);

    // кнопка "настройки куки" в подвале: решение можно поменять в любой момент
    document.querySelectorAll('[data-cookie-settings]').forEach((btn) => {
        btn.addEventListener('click', showBanner);
    });
}
