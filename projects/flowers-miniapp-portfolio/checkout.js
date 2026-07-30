import { money } from './data.js';
import { mainButton, haptic } from './tg.js';
import { navigate, back } from './router.js';
import { getTotal } from './cart.js';
import { renderBrowserHeader, renderBrowserFooter, el } from './ui.js';

const CARD_LIMIT = 200;
const SLOTS = [
    { id: '10-14', label: '10–14', disabled: true },
    { id: '14-18', label: '14–18' },
    { id: '18-22', label: '18–22' },
];

function digitsOnly(s) { return s.replace(/\D/g, ''); }

export function renderCheckout(container) {
    renderBrowserHeader(container, { title: 'Доставка', onBack: back });

    const scroll = el('<div class="screen-scroll"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    const form = {
        name: '', phone: '', address: '',
        day: 'today', slot: '14-18',
        card: '', noCall: true,
    };

    scroll.innerHTML = `
        <div class="section" style="padding-top:16px">
            <div class="section-title">Получатель</div>
            <div style="display:flex;flex-direction:column;gap:8px">
                <input class="field" id="f-name" placeholder="Имя получателя">
                <input class="field" id="f-phone" placeholder="+7" inputmode="tel">
                <div class="field-error" id="f-phone-error" hidden>Введите номер полностью — 10 цифр после +7</div>
                <div class="field-hint" id="f-phone-hint">Нужен на случай, если курьер не найдёт адрес</div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">Куда</div>
            <input class="field" id="f-address" placeholder="Улица, дом, квартира">
        </div>
        <div class="section">
            <div class="section-title">Когда</div>
            <div class="day-chips">
                <button class="chip" data-day="today">Сегодня</button>
                <button class="chip" data-day="tomorrow">Завтра</button>
                <button class="chip" data-day="custom">Выбрать дату</button>
            </div>
            <div class="slot-chips">
                ${SLOTS.map((s) => `<button class="chip${s.disabled ? ' chip-disabled' : ''}" data-slot="${s.id}">${s.label}</button>`).join('')}
            </div>
            <div class="when-hint">Интервал 10–14 уже занят — курьеры расписаны до обеда</div>
        </div>
        <div class="section">
            <div style="display:flex;align-items:baseline;justify-content:space-between">
                <span class="section-title">Открытка</span>
                <span class="field-hint">бесплатно</span>
            </div>
            <div class="card-textarea">
                <textarea id="f-card" maxlength="${CARD_LIMIT}" placeholder="Текст, который курьер напечатает на открытке"></textarea>
                <div class="card-counter" id="f-card-counter">0 / ${CARD_LIMIT}</div>
            </div>
        </div>
        <div class="toggle-row">
            <div style="flex:1">
                <div class="toggle-row-title">Не звонить получателю — это сюрприз</div>
                <div class="toggle-row-sub">Курьер напишет вам, когда будет у двери</div>
            </div>
            <button class="toggle-track is-on tap-44" id="f-nocall"><span class="toggle-knob"></span></button>
        </div>
    `;

    const nameEl = scroll.querySelector('#f-name');
    const phoneEl = scroll.querySelector('#f-phone');
    const phoneError = scroll.querySelector('#f-phone-error');
    const phoneHint = scroll.querySelector('#f-phone-hint');
    const addressEl = scroll.querySelector('#f-address');
    const cardEl = scroll.querySelector('#f-card');
    const cardCounter = scroll.querySelector('#f-card-counter');
    const noCallBtn = scroll.querySelector('#f-nocall');

    function isValid() {
        return form.name.trim().length > 1
            && digitsOnly(form.phone).length === 11
            && form.address.trim().length > 3;
    }

    function phoneTouched() { return form.phone.length > 0; }

    function syncMainButton() {
        const valid = isValid();
        const phoneBad = phoneTouched() && digitsOnly(form.phone).length !== 11;
        phoneError.hidden = !phoneBad;
        phoneHint.hidden = phoneBad;
        phoneEl.classList.toggle('has-error', phoneBad);

        if (!form.name.trim()) mainButton.setText('Заполните получателя');
        else if (!valid) mainButton.setText('Проверьте телефон');
        else mainButton.setText(`К оплате · ${money(getTotal())}`);

        mainButton.show();
        if (valid) mainButton.enable(); else mainButton.disable();
    }

    nameEl.addEventListener('input', () => { form.name = nameEl.value; syncMainButton(); });
    phoneEl.addEventListener('input', () => { form.phone = phoneEl.value; syncMainButton(); });
    addressEl.addEventListener('input', () => { form.address = addressEl.value; syncMainButton(); });
    cardEl.addEventListener('input', () => {
        form.card = cardEl.value;
        cardCounter.textContent = `${cardEl.value.length} / ${CARD_LIMIT}`;
    });

    scroll.querySelectorAll('[data-day]').forEach((btn) => {
        btn.addEventListener('click', () => {
            form.day = btn.dataset.day;
            scroll.querySelectorAll('[data-day]').forEach((b) => b.classList.toggle('is-active', b === btn));
            haptic.selection();
        });
    });
    scroll.querySelector(`[data-day="${form.day}"]`).classList.add('is-active');

    scroll.querySelectorAll('[data-slot]').forEach((btn) => {
        if (btn.classList.contains('chip-disabled')) return;
        btn.addEventListener('click', () => {
            form.slot = btn.dataset.slot;
            scroll.querySelectorAll('[data-slot]').forEach((b) => b.classList.toggle('is-active', b === btn));
            haptic.selection();
        });
    });
    scroll.querySelector(`[data-slot="${form.slot}"]`)?.classList.add('is-active');

    noCallBtn.addEventListener('click', () => {
        form.noCall = !form.noCall;
        noCallBtn.classList.toggle('is-on', form.noCall);
    });

    syncMainButton();
    mainButton.onClick(() => {
        if (!isValid()) return;
        navigate('payment', { ...form });
    });

    return () => { unsubFooter(); };
}
