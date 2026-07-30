import { PRODUCT_BY_ID, money, imgSrc } from './data.js';
import { storage, mainButton } from './tg.js';
import { navigate, back } from './router.js';
import { renderBrowserHeader, renderBrowserFooter, showConfirmModal, el } from './ui.js';

const STORAGE_KEY = 'flowers_cart_v1';
const DELIVERY_FEE = 490;
const FREE_DELIVERY_FROM = 12000;
const PROMO_CODE = 'FLOWERS10';
const PROMO_RATE = 0.10;

// ключ — `id-товара|индекс-размера`: цену и название всегда берём свежими
// из data.js, в сторадже храним только количество
let items = new Map();
let promoApplied = false;
const listeners = new Set();

function resolve(key) {
    const i = key.lastIndexOf('|');
    const productId = key.slice(0, i);
    const sizeIndex = Number(key.slice(i + 1));
    const product = PRODUCT_BY_ID.get(productId);
    const size = product?.sizes[sizeIndex];
    if (!product || !size) return null;
    return { key, productId, sizeIndex, product, size };
}

function notify() { listeners.forEach((fn) => fn()); }

function persist() {
    storage.set(STORAGE_KEY, JSON.stringify({ items: Object.fromEntries(items), promo: promoApplied }));
}

export async function loadCart() {
    const raw = await storage.get(STORAGE_KEY);
    if (!raw) return;
    try {
        const payload = JSON.parse(raw);
        const entries = Object.entries(payload.items || {}).filter(([key, qty]) => resolve(key) && qty > 0);
        items = new Map(entries);
        promoApplied = !!payload.promo;
    } catch { /* битые данные — начинаем с пустой корзины, не крашимся */ }
    notify();
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function addItem(productId, sizeIndex, qty = 1) {
    const key = `${productId}|${sizeIndex}`;
    items.set(key, (items.get(key) || 0) + qty);
    persist(); notify();
}

export function incItem(key) {
    items.set(key, (items.get(key) || 0) + 1);
    persist(); notify();
}

// на количестве 1 «−» должен открыть подтверждение удаления, а не молча стереть
export function decItem(key) {
    const qty = items.get(key) || 0;
    if (qty <= 1) return false;
    items.set(key, qty - 1);
    persist(); notify();
    return true;
}

export function removeItem(key) {
    items.delete(key);
    persist(); notify();
}

export function getProductQty(productId) {
    let sum = 0;
    for (const [key, qty] of items) if (key.startsWith(productId + '|')) sum += qty;
    return sum;
}

export function getCount() {
    let sum = 0;
    for (const qty of items.values()) sum += qty;
    return sum;
}

export function getItems() {
    return [...items.entries()].map(([key, qty]) => ({ ...resolve(key), qty })).filter(Boolean);
}

export function getSubtotal() {
    return getItems().reduce((sum, it) => sum + it.size.price * it.qty, 0);
}

export function getDeliveryFee() {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

export function getDiscount() {
    return promoApplied ? Math.round(getSubtotal() * PROMO_RATE) : 0;
}

export function getTotal() {
    return getSubtotal() + getDeliveryFee() - getDiscount();
}

export function hasPromo() { return promoApplied; }

export function applyPromo(code) {
    if (code.trim().toUpperCase() === PROMO_CODE) { promoApplied = true; persist(); notify(); return true; }
    return false;
}

export function dropPromo() { promoApplied = false; persist(); notify(); }

export function clearCart() { items = new Map(); promoApplied = false; persist(); notify(); }

function cartRowHtml(item) {
    return `
        <div class="cart-row" data-key="${item.key}">
            <div class="cart-row-photo"><img src="${imgSrc(item.product.img)}" alt=""></div>
            <div class="cart-row-body">
                <div class="cart-row-top">
                    <div style="flex:1;min-width:0">
                        <div class="cart-row-name">${item.product.name}</div>
                        <div class="cart-row-size">${item.size.label}</div>
                    </div>
                    <button class="cart-row-del tap-44" data-del="${item.key}" aria-label="Удалить">✕</button>
                </div>
                <div class="cart-row-bottom">
                    <span class="cart-row-price">${money(item.size.price * item.qty)}</span>
                    <span class="qty">
                        <button data-dec="${item.key}" aria-label="Меньше">−</button>
                        <span>${item.qty}</span>
                        <button data-inc="${item.key}" aria-label="Больше">+</button>
                    </span>
                </div>
            </div>
        </div>
    `;
}

export function renderCart(container) {
    renderBrowserHeader(container, { title: 'Корзина', onBack: back });

    const scroll = el('<div class="screen-scroll"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    let pendingDeleteKey = null;

    function draw() {
        const list = getItems();
        const empty = list.length === 0;

        if (empty) {
            scroll.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-mid">
                        <div class="empty-cart-icon">🌸</div>
                        <h2>В корзине пока пусто</h2>
                        <p>Букет собирается за минуту. Если нужно сегодня — успеваем, пока курьеры свободны до 20:00.</p>
                    </div>
                    <div class="empty-cart-picks">
                        <button class="empty-pick" data-pick="hits">
                            <div class="card-photo" style="width:52px;height:56px;flex:none;background:color-mix(in oklab, var(--brand) 7%, var(--bg));border-radius:10px"></div>
                            <div style="flex:1"><div class="empty-pick-title">Хиты недели</div><div class="empty-pick-sub">Букеты, которые заказывают чаще всего</div></div>
                            <span class="empty-pick-arrow"></span>
                        </button>
                        <button class="empty-pick" data-pick="under5000">
                            <div class="card-photo" style="width:52px;height:56px;flex:none;background:color-mix(in oklab, var(--brand) 7%, var(--bg));border-radius:10px"></div>
                            <div style="flex:1"><div class="empty-pick-title">До 5 000 ₽</div><div class="empty-pick-sub">Спокойные небольшие букеты «без повода»</div></div>
                            <span class="empty-pick-arrow"></span>
                        </button>
                    </div>
                </div>
            `;
            scroll.querySelectorAll('[data-pick]').forEach((btn) => {
                btn.addEventListener('click', () => navigate('catalog', { filter: btn.dataset.pick }));
            });
        } else {
            const subtotal = getSubtotal();
            const delivery = getDeliveryFee();
            const discount = getDiscount();
            const promo = hasPromo();
            scroll.innerHTML = `
                <div class="cart-list">
                    ${list.map(cartRowHtml).join('')}
                    ${promo ? `
                        <div class="promo-applied">
                            <span>FLOWERS10 · −${money(discount)}</span>
                            <button data-drop-promo aria-label="Убрать промокод">✕</button>
                        </div>
                    ` : `
                        <div class="promo-row">
                            <input class="promo-input" placeholder="Промокод" id="promo-input">
                            <button class="promo-apply">Применить</button>
                        </div>
                    `}
                    <div class="totals">
                        <div class="totals-row"><span class="muted">Букеты</span><span>${money(subtotal)}</span></div>
                        <div class="totals-row"><span class="muted">Доставка по Москве</span><span>${delivery === 0 ? 'бесплатно' : money(delivery)}</span></div>
                        ${promo ? `<div class="totals-row" style="color:var(--brand)"><span>Промокод FLOWERS10</span><span>−${money(discount)}</span></div>` : ''}
                        <div class="totals-divider"></div>
                        <div class="totals-final"><span>Итого</span><span>${money(getTotal())}</span></div>
                    </div>
                </div>
                <div class="totals-hint">Доставка бесплатна от 12 000 ₽. Дату и интервал выберете на следующем шаге.</div>
            `;

            scroll.querySelectorAll('[data-inc]').forEach((btn) => {
                btn.addEventListener('click', () => incItem(btn.dataset.inc));
            });
            scroll.querySelectorAll('[data-dec]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.dec;
                    if (!decItem(key)) askDelete(key);
                });
            });
            scroll.querySelectorAll('[data-del]').forEach((btn) => {
                btn.addEventListener('click', () => askDelete(btn.dataset.del));
            });
            const applyBtn = scroll.querySelector('.promo-apply');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => applyPromo(scroll.querySelector('#promo-input').value));
            }
            const dropBtn = scroll.querySelector('[data-drop-promo]');
            if (dropBtn) dropBtn.addEventListener('click', dropPromo);
        }

        const modalOpen = !!pendingDeleteKey;
        mainButton.setText(empty ? 'Выбрать букет' : `Оформить доставку · ${money(getTotal())}`);
        mainButton.show();
        if (modalOpen) mainButton.disable(); else mainButton.enable();
        mainButton.onClick(() => {
            if (empty) back();
            else navigate('checkout');
        });
    }

    function askDelete(key) {
        const item = resolve(key);
        if (!item) return;
        pendingDeleteKey = key;
        draw();
        showConfirmModal(container, {
            title: `Удалить «${item.product.name}»?`,
            desc: 'Позиция исчезнет из корзины. Промокод пересчитается.',
            onConfirm: () => removeItem(key),
        });
        // модалку закрыли (любым путём) — снимаем блокировку MainButton
        const overlay = container.querySelector('.modal-overlay');
        const clear = () => { pendingDeleteKey = null; draw(); };
        overlay.querySelector('.cancel').addEventListener('click', clear, { once: true });
        overlay.querySelector('.danger').addEventListener('click', clear, { once: true });
    }

    draw();
    const unsubCart = subscribe(draw);

    return () => { unsubCart(); unsubFooter(); };
}
