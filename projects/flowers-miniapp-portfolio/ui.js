import { isTelegram, mainButton } from './tg.js';

// шапка и нижняя кнопка нужны только вне Telegram — внутри него это рисует
// сам клиент (BackButton/MainButton), мы туда не лезем ни одним пикселем
export function renderBrowserHeader(container, { title, onBack }) {
    if (isTelegram) return;
    const el = document.createElement('div');
    el.className = 'browser-header';
    el.innerHTML = `
        <button class="browser-back" aria-label="Назад" style="${onBack ? '' : 'visibility:hidden'}"><span class="chevron"></span></button>
        <span class="browser-title">${title}</span>
    `;
    if (onBack) el.querySelector('.browser-back').addEventListener('click', onBack);
    container.appendChild(el);
}

export function renderBrowserFooter(container) {
    if (isTelegram) return () => {};
    const el = document.createElement('div');
    el.className = 'browser-footer';
    el.innerHTML = `<button class="browser-main-btn"></button>`;
    const btn = el.querySelector('.browser-main-btn');
    const unsub = mainButton.subscribe((state) => {
        el.hidden = !state.visible;
        btn.disabled = !state.enabled || state.progress;
        btn.classList.toggle('is-loading', state.progress);
        btn.innerHTML = state.progress ? '<span class="spinner"></span>' : state.text;
    });
    btn.addEventListener('click', () => mainButton.trigger());
    container.appendChild(el);
    return unsub;
}

export function showConfirmModal(container, { title, desc, onConfirm }) {
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.innerHTML = `
        <div class="modal-card">
            <div class="modal-title">${title}</div>
            <div class="modal-desc">${desc}</div>
            <div class="modal-actions">
                <button class="modal-btn cancel">Отмена</button>
                <button class="modal-btn danger">Удалить</button>
            </div>
        </div>
    `;
    el.querySelector('.cancel').addEventListener('click', () => el.remove());
    el.querySelector('.danger').addEventListener('click', () => { onConfirm(); el.remove(); });
    container.appendChild(el);
}

export const el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
};
