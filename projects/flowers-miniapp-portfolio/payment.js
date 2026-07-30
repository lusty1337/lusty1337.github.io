import { money, imgSrc } from './data.js';
import { mainButton, backButton, haptic } from './tg.js';
import { navigate, replace, back } from './router.js';
import { getItems, getSubtotal, getDeliveryFee, getDiscount, hasPromo, getTotal, clearCart } from './cart.js';
import { renderBrowserHeader, renderBrowserFooter, el } from './ui.js';

const DAY_LABELS = { today: 'Сегодня', tomorrow: 'Завтра', custom: 'В выбранный день' };
const SLOT_LABELS = { '14-18': '14:00–18:00', '18-22': '18:00–22:00', '10-14': '10:00–14:00' };

function dateLabel(day) {
    const d = new Date();
    if (day === 'tomorrow') d.setDate(d.getDate() + 1);
    const text = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    return day === 'custom' ? DAY_LABELS.custom : `${DAY_LABELS[day]}, ${text}`;
}

function orderNumber() {
    return 'FL-' + (1000 + Math.floor(Math.random() * 9000));
}

export function renderPayment(container, checkout) {
    renderBrowserHeader(container, { title: 'Оплата', onBack: back });

    const scroll = el('<div class="screen-scroll payment-body"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    const items = getItems();
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    const discount = getDiscount();
    const promo = hasPromo();
    const total = getTotal();

    scroll.innerHTML = `
        <h1 class="payment-h1">Проверьте заказ</h1>
        <div class="section" style="padding-top:16px">
            ${items.map((it) => `
                <div class="payment-item">
                    <div class="payment-item-photo"><img src="${imgSrc(it.product.img)}" alt=""></div>
                    <div style="flex:1;min-width:0">
                        <div class="payment-item-name">${it.product.name}</div>
                        <div class="payment-item-sub">${it.size.label} · ${it.qty} шт</div>
                    </div>
                    <span class="payment-item-price">${money(it.size.price * it.qty)}</span>
                </div>
            `).join('')}
        </div>
        <div class="totals-divider" style="margin:18px 0"></div>
        <div style="display:flex;flex-direction:column;gap:13px">
            <div class="summary-row"><span class="summary-label">Куда</span><span class="summary-value">${checkout.address}</span></div>
            <div class="summary-row"><span class="summary-label">Когда</span><span class="summary-value">${dateLabel(checkout.day)} · ${SLOT_LABELS[checkout.slot]}</span></div>
            <div class="summary-row"><span class="summary-label">Получатель</span><span class="summary-value">${checkout.name} · ${checkout.phone}${checkout.noCall ? '<br><span style="color:var(--hint);font-size:13px">не звонить — сюрприз</span>' : ''}</span></div>
            ${checkout.card ? `<div class="summary-row"><span class="summary-label">Открытка</span><span class="summary-value">${checkout.card}</span></div>` : ''}
        </div>
        <div class="totals-divider" style="margin:18px 0"></div>
        <div style="display:flex;flex-direction:column;gap:11px">
            <div class="totals-row"><span class="muted">Букеты</span><span>${money(subtotal)}</span></div>
            <div class="totals-row"><span class="muted">Доставка по Москве</span><span>${delivery === 0 ? 'бесплатно' : money(delivery)}</span></div>
            ${promo ? `<div class="totals-row" style="color:var(--brand)"><span>Промокод FLOWERS10</span><span>−${money(discount)}</span></div>` : ''}
            <div class="totals-final" style="margin-top:2px"><span>К оплате</span><span>${money(total)}</span></div>
        </div>
        <div class="demo-badge" style="margin-top:18px">
            <span class="demo-badge-label">Демо-режим</span>
            <span class="demo-badge-text">Деньги не списываются, платёж не отправляется. В рабочей версии сумму принимает сам Telegram.</span>
        </div>
        <div class="terms-note" style="margin-top:14px">Нажимая кнопку, вы соглашаетесь с <span class="link">условиями доставки</span>.</div>
    `;

    mainButton.setText('Оплатить (демо)');
    mainButton.show();
    mainButton.enable();
    mainButton.onClick(() => {
        mainButton.disable();
        mainButton.showProgress();
        backButton.hide();
        setTimeout(() => {
            const number = orderNumber();
            const summary = { checkout, items, subtotal, delivery, discount, promo, total, number };
            clearCart();
            replace('done', summary);
        }, 900);
    });

    return () => { unsubFooter(); };
}

export function renderDone(container, order) {
    const scroll = el('<div class="screen-scroll done-body"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    if (!order) {
        // прямой заход без заказа (перезагрузка страницы на /#done) — некуда показывать
        navigate('catalog');
        return () => { unsubFooter(); };
    }

    renderBrowserHeader(container, { title: `Заказ ${order.number}`, onBack: null });

    scroll.innerHTML = `
        <div class="section" style="padding-top:28px;gap:14px">
            <div class="done-icon"><span class="check"></span></div>
            <h1 class="done-title">Заказ оформлен</h1>
            <p class="done-lead">Курьер привезёт букет <b>${dateLabel(order.checkout.day).toLowerCase()} ${SLOT_LABELS[order.checkout.slot]}</b> и пришлёт фото перед вручением.${order.checkout.noCall ? ' Получателю не звоним — сюрприз.' : ''}</p>
        </div>
        <div class="order-card" style="margin-top:22px">
            <div class="order-row"><span class="muted">Номер заказа</span><span style="font:500 15px ui-monospace, Menlo, monospace">${order.number}</span></div>
            <div class="totals-divider"></div>
            <div style="display:flex;flex-direction:column;gap:9px">
                ${order.items.map((it) => `
                    <div class="order-line"><span>${it.product.name}, ${it.size.label}</span><span>${money(it.size.price * it.qty)}</span></div>
                `).join('')}
                <div class="order-line"><span class="muted">Доставка</span><span>${order.delivery === 0 ? 'бесплатно' : money(order.delivery)}</span></div>
                ${order.promo ? `<div class="order-line" style="color:var(--brand)"><span>Промокод FLOWERS10</span><span>−${money(order.discount)}</span></div>` : ''}
            </div>
            <div class="totals-divider"></div>
            <div class="order-row order-total"><span>Оплачено (демо)</span><span>${money(order.total)}</span></div>
        </div>
        <div class="section" style="padding-top:16px;gap:12px">
            <div class="summary-row"><span class="summary-label">Куда</span><span class="summary-value">${order.checkout.address}</span></div>
            <div class="summary-row"><span class="summary-label">Получатель</span><span class="summary-value">${order.checkout.name} · ${order.checkout.phone}</span></div>
        </div>
        <div class="demo-badge" style="margin-top:18px">
            <span class="demo-badge-label">Демо-режим</span>
            <span class="demo-badge-text">Заказ существует только внутри демо: деньги не списаны, курьер не приедет, номер ${order.number} сгенерирован для примера.</span>
        </div>
        <div class="contact-link" style="margin-top:18px">Написать флористу в чат</div>
    `;

    mainButton.setText('Готово');
    mainButton.show();
    mainButton.enable();
    mainButton.onClick(() => {
        haptic.impact('light');
        replace('catalog');
    });

    return () => { unsubFooter(); };
}
