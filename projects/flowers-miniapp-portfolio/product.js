import { PRODUCT_BY_ID, money, imgSrc } from './data.js';
import { mainButton, haptic } from './tg.js';
import { navigate, back } from './router.js';
import { addItem } from './cart.js';
import { renderBrowserHeader, renderBrowserFooter, el } from './ui.js';

export function renderProduct(container, { id }) {
    const product = PRODUCT_BY_ID.get(id);
    if (!product) { navigate('catalog'); return; }

    renderBrowserHeader(container, { title: 'Букет', onBack: back });

    const scroll = el('<div class="screen-scroll"></div>');
    container.appendChild(scroll);
    const unsubFooter = renderBrowserFooter(container);

    // размер «часто берут» выбран по умолчанию, если он есть, иначе средний
    let sizeIndex = product.sizes.findIndex((s) => s.tag);
    if (sizeIndex < 0) sizeIndex = Math.min(1, product.sizes.length - 1);

    scroll.innerHTML = `
        <div class="product-photo"><img src="${imgSrc(product.img)}" alt=""></div>
        <div class="product-body">
            <h1 class="product-name">${product.name}</h1>
            <div class="product-price-row">
                <span class="product-price" id="pp-price"></span>
                <span class="product-price-note">за букет, упаковка включена</span>
            </div>
            ${product.desc ? `<p class="product-desc">${product.desc}</p>` : ''}
        </div>
        <div class="section">
            <div class="section-title">Размер</div>
            <div class="sizes" id="pp-sizes"></div>
        </div>
        <div class="section">
            <div class="section-title">Состав</div>
            <div class="composition">
                ${product.composition.map(([name, qty]) => `
                    <div class="comp-row"><span>${name}</span><span>${qty}</span></div>
                `).join('')}
            </div>
        </div>
        <div class="delivery-note">
            <span>Доставим сегодня к 18:00</span>
            <span>если оформить до 16:00 · интервал выберете на следующем шаге</span>
        </div>
    `;

    const priceEl = scroll.querySelector('#pp-price');
    const sizesEl = scroll.querySelector('#pp-sizes');

    function draw() {
        const size = product.sizes[sizeIndex];
        priceEl.textContent = money(size.price);
        sizesEl.innerHTML = product.sizes.map((s, i) => `
            <button class="size-card${i === sizeIndex ? ' is-selected' : ''}" data-size="${i}">
                <b>${s.label}</b>
                <span>${money(s.price)}</span>
                ${s.tag ? `<span class="size-tag">${s.tag}</span>` : ''}
            </button>
        `).join('');
        sizesEl.querySelectorAll('[data-size]').forEach((btn) => {
            btn.addEventListener('click', () => {
                sizeIndex = Number(btn.dataset.size);
                haptic.selection();
                draw();
            });
        });
        mainButton.setText(`В корзину · ${money(size.price)}`);
    }

    draw();
    mainButton.show();
    mainButton.onClick(() => {
        addItem(product.id, sizeIndex);
        haptic.notification('success');
        navigate('cart');
    });

    return () => { unsubFooter(); };
}
