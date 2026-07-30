import { CATEGORIES, PRODUCTS, money, imgSrc, priceFrom } from './data.js';
import { user, mainButton } from './tg.js';
import { navigate } from './router.js';
import { getProductQty, getCount, getTotal, subscribe } from './cart.js';
import { renderBrowserHeader, renderBrowserFooter, el } from './ui.js';

function cardHtml(p) {
    const qty = getProductQty(p.id);
    return `
        <button class="card" data-open="${p.id}">
            <div class="card-photo"><img src="${imgSrc(p.img)}" alt="" loading="lazy"></div>
            ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
            <div class="card-name">${p.name}</div>
            <div class="card-price">от ${money(priceFrom(p))}</div>
            ${qty > 0 ? `<span class="card-cart-badge">${qty}</span>` : ''}
        </button>
    `;
}

function skeletonHtml() {
    const widths = ['88%', '70%', '92%', '76%', '84%', '66%'];
    return `<div class="grid">${widths.map((w, i) => `
        <div class="card" style="cursor:default">
            <div class="skeleton-block" style="animation-delay:${i * 0.08}s"></div>
            <div class="skeleton-line" style="width:${w}"></div>
            <div class="skeleton-line" style="width:44%"></div>
        </div>
    `).join('')}</div>`;
}

export function renderCatalog(container, params = {}) {
    renderBrowserHeader(container, { title: 'Букеты', onBack: null });

    const scroll = el('<div class="screen-scroll"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    let activeCategory = null;
    let activeFilter = params.filter || null; // 'hits' | 'under5000' | null

    scroll.innerHTML = `
        <div class="cat-head">
            <div class="cat-greet">Добрый вечер, ${user.firstName}</div>
            <h1 class="cat-title">Букеты, которые<br>привезём сегодня</h1>
            <div class="cat-sub">Москва · курьер пришлёт фото перед вручением</div>
        </div>
        <div class="chips">
            ${CATEGORIES.map((c) => `<button class="chip" data-cat="${c.id}">${c.label}</button>`).join('')}
        </div>
        ${skeletonHtml()}
    `;

    function productsFor() {
        if (activeFilter === 'hits') return PRODUCTS.filter((p) => p.badge === 'хит');
        if (activeFilter === 'under5000') return PRODUCTS.filter((p) => priceFrom(p) < 5000);
        if (activeCategory) return PRODUCTS.filter((p) => p.category === activeCategory);
        return PRODUCTS;
    }

    function drawGrid() {
        const grid = scroll.querySelector('.grid');
        const list = productsFor();
        grid.innerHTML = list.map(cardHtml).join('');
        grid.querySelectorAll('[data-open]').forEach((btn) => {
            btn.addEventListener('click', () => navigate('product', { id: btn.dataset.open }));
        });
        scroll.querySelectorAll('.chip').forEach((chip) => {
            chip.classList.toggle('is-active', !activeFilter && chip.dataset.cat === activeCategory);
        });
    }

    scroll.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            activeFilter = null;
            activeCategory = activeCategory === chip.dataset.cat ? null : chip.dataset.cat;
            drawGrid();
        });
    });

    // короткая имитация загрузки — приветствие и чипсы уже настоящие,
    // мигают только карточки, как в макете
    setTimeout(drawGrid, 260);

    function syncMainButton() {
        const count = getCount();
        if (count > 0) {
            mainButton.setText(`Корзина · ${count} товар${count === 1 ? '' : count < 5 ? 'а' : 'ов'} · ${money(getTotal())}`);
            mainButton.show();
            mainButton.onClick(() => navigate('cart'));
        } else {
            mainButton.hide();
        }
    }

    syncMainButton();
    const unsubCart = subscribe(() => { syncMainButton(); drawGrid(); });

    return () => { unsubCart(); unsubFooter(); };
}
