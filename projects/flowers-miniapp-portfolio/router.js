// стек экранов держит сама History API — работает одинаково что в браузере,
// что в WebView Telegram. BackButton зарегистрирован один раз глобально
// и просто идёт history.back(); какой экран открывать дальше, решает popstate

import { backButton, mainButton } from './tg.js';

const routes = new Map();
let appEl = null;
let current = null;

export function register(name, renderFn) {
    routes.set(name, renderFn);
}

function cleanup() {
    current?.cleanup?.();
    mainButton.offClick();
    mainButton.hide();
    // экран мог оставить кнопку в disabled/progress (например, во время
    // «оплаты») — следующий экран должен стартовать с чистого состояния,
    // а не донашивать чужой спиннер
    mainButton.hideProgress();
    mainButton.enable();
}

function render(name, params) {
    cleanup();
    appEl.replaceChildren();
    const renderFn = routes.get(name);
    if (!renderFn) { console.error('неизвестный экран:', name); return; }
    const result = renderFn(appEl, params);
    current = { name, cleanup: typeof result === 'function' ? result : null };
    backButton[name === 'catalog' ? 'hide' : 'show']();
}

export function navigate(name, params = {}) {
    history.pushState({ name, params }, '', '#' + name);
    render(name, params);
}

export function replace(name, params = {}) {
    history.replaceState({ name, params }, '', '#' + name);
    render(name, params);
}

export function back() {
    history.back();
}

export function start(root) {
    appEl = root;
    backButton.onClick(() => history.back());
    window.addEventListener('popstate', (e) => {
        const state = e.state || { name: 'catalog', params: {} };
        render(state.name, state.params);
    });
    history.replaceState({ name: 'catalog', params: {} }, '', '#catalog');
    render('catalog', {});
}
