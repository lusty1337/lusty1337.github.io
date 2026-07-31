// адаптер над Telegram.WebApp: внутри Telegram дёргает настоящий API,
// вне Telegram — тихо деградирует (localStorage вместо CloudStorage,
// no-op вместо HapticFeedback), а состояние MainButton доступно через
// subscribe, чтобы ui.js мог нарисовать свою кнопку в браузерном режиме.

const WebApp = window.Telegram?.WebApp;

// пустой initData и platform 'unknown' — надёжный признак обычного браузера,
// а не Telegram-клиента без прогретого запуска
export const isTelegram = !!WebApp?.initData && WebApp.platform !== 'unknown';

// это выполняется при самом первом импорте модуля, до регистрации экранов —
// исключение здесь роняет весь граф модулей и приложение остаётся пустым
// экраном. клиенты Telegram отличаются версиями SDK, поэтому не доверяем
// ни одному вызову моста безоговорочно
function safeCall(fn) {
    try { fn(); } catch (e) { console.error('tg.js: вызов Telegram API упал', e); }
}

if (isTelegram) {
    safeCall(() => WebApp.ready());
    safeCall(() => WebApp.expand());
}

export const colorScheme = isTelegram && WebApp.colorScheme
    ? WebApp.colorScheme
    : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.dataset.scheme = colorScheme;

if (isTelegram) {
    safeCall(() => WebApp.onEvent('themeChanged', () => {
        document.documentElement.dataset.scheme = WebApp.colorScheme;
    }));
} else {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        document.documentElement.dataset.scheme = e.matches ? 'dark' : 'light';
    });
}

const mbState = { text: '', visible: false, enabled: true, progress: false };
const mbListeners = new Set();
let mbClick = null;

function mbEmit() {
    mbListeners.forEach((fn) => fn({ ...mbState }));
}

function mbSyncNative() {
    if (!isTelegram) return;
    safeCall(() => {
        const b = WebApp.MainButton;
        b.setText(mbState.text || ' ');
        if (mbState.visible) b.show(); else b.hide();
        if (mbState.enabled) b.enable(); else b.disable();
        if (mbState.progress) b.showProgress(false); else b.hideProgress();
    });
}

export const mainButton = {
    setText(text) { mbState.text = text; mbSyncNative(); mbEmit(); },
    show() { mbState.visible = true; mbSyncNative(); mbEmit(); },
    hide() { mbState.visible = false; mbSyncNative(); mbEmit(); },
    enable() { mbState.enabled = true; mbSyncNative(); mbEmit(); },
    disable() { mbState.enabled = false; mbSyncNative(); mbEmit(); },
    showProgress() { mbState.progress = true; mbSyncNative(); mbEmit(); },
    hideProgress() { mbState.progress = false; mbSyncNative(); mbEmit(); },
    onClick(fn) {
        this.offClick();
        mbClick = fn;
        if (isTelegram) safeCall(() => WebApp.MainButton.onClick(mbClick));
    },
    offClick() {
        if (isTelegram && mbClick) safeCall(() => WebApp.MainButton.offClick(mbClick));
        mbClick = null;
    },
    // клик из нашей собственной браузерной кнопки идёт через тот же обработчик
    trigger() {
        if (mbState.enabled && !mbState.progress) mbClick?.();
    },
    subscribe(fn) {
        mbListeners.add(fn);
        fn({ ...mbState });
        return () => mbListeners.delete(fn);
    },
};

let bbClick = null;

export const backButton = {
    show() { if (isTelegram) safeCall(() => WebApp.BackButton.show()); },
    hide() { if (isTelegram) safeCall(() => WebApp.BackButton.hide()); },
    // один обработчик на всё приложение — просто идёт назад по истории,
    // а какой экран открывать, решает popstate в router.js
    onClick(fn) {
        if (!isTelegram) return;
        safeCall(() => {
            if (bbClick) WebApp.BackButton.offClick(bbClick);
            bbClick = fn;
            WebApp.BackButton.onClick(bbClick);
        });
    },
};

export const haptic = {
    impact(style = 'light') { if (isTelegram) safeCall(() => WebApp.HapticFeedback.impactOccurred(style)); },
    notification(type) { if (isTelegram) safeCall(() => WebApp.HapticFeedback.notificationOccurred(type)); },
    selection() { if (isTelegram) safeCall(() => WebApp.HapticFeedback.selectionChanged()); },
};

export const storage = {
    get(key) {
        // CloudStorage — с Bot API 6.9, у части клиентов её может не быть.
        // без try/catch тут промис завис бы и приложение не стартовало бы вообще
        if (isTelegram && WebApp.CloudStorage) {
            return new Promise((resolve) => {
                try {
                    WebApp.CloudStorage.getItem(key, (err, value) => resolve(err ? null : value || null));
                } catch { resolve(null); }
            });
        }
        return Promise.resolve(localStorage.getItem(key));
    },
    set(key, value) {
        if (isTelegram && WebApp.CloudStorage) {
            return new Promise((resolve) => {
                try {
                    WebApp.CloudStorage.setItem(key, value, () => resolve());
                } catch { resolve(); }
            });
        }
        localStorage.setItem(key, value);
        return Promise.resolve();
    },
};

export const user = {
    // initDataUnsafe не проверен сервером — годится только для приветствия,
    // ни для чего, что влияет на цену или заказ
    firstName: isTelegram ? (WebApp.initDataUnsafe?.user?.first_name || 'Друг') : 'Друг',
};

export function close() {
    if (isTelegram) safeCall(() => WebApp.close());
}

export function openTelegramLink(url) {
    if (isTelegram) safeCall(() => WebApp.openTelegramLink(url));
    else window.open(url, '_blank');
}
