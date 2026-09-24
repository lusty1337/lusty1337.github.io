// портфель живёт в памяти — сброс только при перезагрузке
const state = {
    balances: { BTC: 1.45, ETH: 12.5, SOL: 62, USDT: 5420 },
    prices:   { BTC: 64500, ETH: 3500.5, SOL: 135, USDT: 1, BNB: 585, XRP: 0.62, TON: 5.4, ADA: 0.45 },
    // движение за сутки; по выбранному инструменту его перетирает биржа
    chg:      { BTC: 2.41, ETH: -1.18, SOL: 5.07, USDT: 0, BNB: 0.74, XRP: -2.35, TON: 3.12, ADA: -0.81 },
};

// что лежит в портфеле
const assets = {
    BTC:  { name: 'Bitcoin'  },
    ETH:  { name: 'Ethereum' },
    SOL:  { name: 'Solana'   },
    USDT: { name: 'Tether'   },
};

// что показывает список слева — шире портфеля, как на любой бирже
const market = [
    ['BTC', 'Bitcoin'],
    ['ETH', 'Ethereum'],
    ['SOL', 'Solana'],
    ['BNB', 'BNB'],
    ['XRP', 'XRP'],
    ['TON', 'Toncoin'],
    ['ADA', 'Cardano'],
];

const swap = { from: 'ETH', to: 'USDT' };
let symbol = 'BTC';
let frame  = '1M';

const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

const money = (v, d = 2) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
const qty   = (v, sym) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: sym === 'USDT' ? 2 : 4 }).format(v);
const signed = (v, d = 2) => (v >= 0 ? '+' : '−') + money(Math.abs(v), d);
const tone   = (v) => (v >= 0 ? 'up' : 'down');

const px = (sym) => { const v = state.prices[sym] || 0; return v >= 1000 ? 0 : v >= 1 ? 2 : 4; };

const valueOf = (sym) => (state.balances[sym] || 0) * (state.prices[sym] || 0);
const totalOf = () => Object.keys(assets).reduce((s, sym) => s + valueOf(sym), 0);

/* ── часы ──────────────────────────────────────────────────── */

const startClock = () => {
    const el = document.getElementById('clock');
    const tick = () => { el.textContent = new Date().toISOString().slice(11, 19); };
    tick();
    setInterval(tick, 1000);
};

/* ── экраны ────────────────────────────────────────────────── */

const setupScreens = () => {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                const on = t === tab;
                t.setAttribute('aria-selected', String(on));
                document.getElementById(t.dataset.screen).classList.toggle('is-on', on);
            });
            // график живёт в скрытой ветке дерева и там не знает своих размеров
            if (chart) chart.resize();
        });
    });
};

/* ── список инструментов ───────────────────────────────────── */

const renderWatchlist = () => {
    const body = document.getElementById('wl-body');
    body.innerHTML = '';

    market.forEach(([sym, name]) => {
        const chg = state.chg[sym] || 0;
        const row = document.createElement('tr');
        row.setAttribute('aria-selected', String(sym === symbol));
        row.innerHTML = `
            <td><span class="wl__sym">${sym}/USDT</span><span class="wl__name">${name}</span></td>
            <td class="wl__px num">${money(state.prices[sym], px(sym))}</td>
            <td class="wl__chg num ${tone(chg)}">${signed(chg)}%</td>`;
        row.addEventListener('click', () => selectSymbol(sym));
        body.appendChild(row);
    });
};

const selectSymbol = (sym) => {
    if (sym === symbol) return;
    symbol = sym;
    renderWatchlist();
    document.getElementById('inst-sym').textContent = `${sym} / USDT`;
    loadChart();
};

/* ── котировки ─────────────────────────────────────────────── */

const FRAMES = {
    '1H': { interval: '1m', limit: 60, step: 60000,   vol: 0.0008 },
    '1D': { interval: '1h', limit: 24, step: 3600000, vol: 0.004  },
    '1W': { interval: '4h', limit: 42, step: 14400000, vol: 0.008 },
    '1M': { interval: '1d', limit: 30, step: 86400000, vol: 0.022 },
};

const stamp = (d, f) =>
    f === '1H' ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}` :
    f === '1D' ? `${d.getHours()}:00` :
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

const fetchSeries = async (sym, f) => {
    const cfg = FRAMES[f];
    const feed = document.getElementById('feed');

    try {
        // без таймаута зависший запрос (бинанс блокирует часть регионов) держит
        // график пустым десятки секунд — режем коротко и уходим на свои данные
        const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${sym}USDT&interval=${cfg.interval}&limit=${cfg.limit}`,
            { signal: AbortSignal.timeout(3000) },
        );
        const raw = await res.json();
        if (!Array.isArray(raw)) throw new Error('bad format');

        feed.innerHTML = '<i class="dot"></i>котировки&nbsp;<b>binance</b>';
        return {
            labels: raw.map(k => stamp(new Date(k[0]), f)),
            data:   raw.map(k => parseFloat(k[4])),
        };
    } catch (err) {
        console.warn('биржа недоступна, рисуем по своим данным:', err);
        feed.innerHTML = '<i class="dot dot--stale"></i>котировки&nbsp;<b>локально</b>';

        const labels = [], data = [];
        const now = new Date();
        let price = state.prices[sym];
        for (let i = cfg.limit; i >= 0; i -= 1) {
            labels.push(stamp(new Date(now.getTime() - i * cfg.step), f));
            price *= 1 + (Math.random() - 0.485) * cfg.vol;
            data.push(price);
        }
        return { labels, data };
    }
};

// цены и суточное движение всего списка приходят одним запросом:
// семь отдельных обращений к бирже ради одной колонки не нужны
const refreshQuotes = async () => {
    const pairs = market.map(([sym]) => `"${sym}USDT"`).join(',');
    try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${pairs}]`,
            { signal: AbortSignal.timeout(3000) });
        const raw = await res.json();
        if (!Array.isArray(raw)) throw new Error('bad format');

        raw.forEach(t => {
            const sym = t.symbol.replace(/USDT$/, '');
            state.prices[sym] = parseFloat(t.lastPrice);
            state.chg[sym]    = parseFloat(t.priceChangePercent);
        });
    } catch (err) {
        console.warn('котировки списка не пришли, остаются справочные:', err);
    }
    renderWatchlist();
    renderPortfolio();
    renderTicket();
};

/* ── график ────────────────────────────────────────────────── */

let chart;

const drawChart = (labels, data) => {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;

    const rising = data[data.length - 1] >= data[0];
    const line   = rising ? css('--up') : css('--down');
    const ctx    = canvas.getContext('2d');

    const fill = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 320);
    fill.addColorStop(0, rising ? 'rgba(87, 184, 127, .14)' : 'rgba(217, 106, 106, .14)');
    fill.addColorStop(1, 'rgba(0, 0, 0, 0)');

    if (chart) chart.destroy();

    Chart.defaults.color = css('--bone-3');
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
    Chart.defaults.font.size = 10;

    chart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{
            data,
            borderColor: line,
            backgroundColor: fill,
            borderWidth: 1.25,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: line,
            pointHoverBorderWidth: 0,
            fill: true,
            tension: 0,
        }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 220 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: css('--panel'),
                    borderColor: css('--rule-hi'),
                    borderWidth: 1,
                    cornerRadius: 0,
                    padding: 8,
                    displayColors: false,
                    titleColor: css('--bone-3'),
                    titleFont: { size: 10, weight: '400' },
                    bodyColor: css('--bone'),
                    bodyFont: { size: 12 },
                    callbacks: { label: (c) => money(c.parsed.y) },
                },
            },
            scales: {
                x: {
                    border: { color: css('--rule') },
                    grid: { display: false },
                    ticks: { maxTicksLimit: 8, maxRotation: 0, padding: 6 },
                },
                // шкала цен справа — там её и ищут глазами, у правого края графика
                y: {
                    position: 'right',
                    border: { display: false },
                    grid: { color: css('--rule'), drawTicks: false },
                    ticks: { padding: 8, callback: (v) => money(v, 0) },
                },
            },
        },
    });

    const last = data[data.length - 1];
    const pct  = ((last - data[0]) / data[0]) * 100;

    state.prices[symbol] = last;
    state.chg[symbol]    = pct;

    const head = document.getElementById('inst-px');
    head.textContent = money(last, px(symbol));

    const chg = document.getElementById('inst-chg');
    chg.textContent = `${signed(pct)} %  ·  ${signed(last - data[0], px(symbol))}`;
    chg.className = `inst__chg ${tone(pct)}`;

    renderWatchlist();
    renderPortfolio();
    renderTicket();
};

const loadChart = async () => {
    const series = await fetchSeries(symbol, frame);
    drawChart(series.labels, series.data);
};

const setupFrames = () => {
    const btns = document.querySelectorAll('.tf button');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.setAttribute('aria-selected', String(b === btn)));
            frame = btn.dataset.tf;
            loadChart();
        });
    });
};

/* ── портфель ──────────────────────────────────────────────── */

const renderPortfolio = () => {
    const total = totalOf();
    document.getElementById('pf-total').textContent = `$ ${money(total)}`;

    // дневное изменение портфеля — сумма движений по каждой позиции
    const delta = Object.keys(assets).reduce((s, sym) => s + valueOf(sym) * (state.chg[sym] || 0) / 100, 0);
    const d = document.getElementById('pf-delta');
    d.textContent = `${signed(delta)} за сутки`;
    d.className = `tot__d ${tone(delta)}`;

    const free  = document.getElementById('free-body');
    free.innerHTML = '';
    Object.keys(assets).forEach(sym => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${sym}</td><td>${qty(state.balances[sym] || 0, sym)}</td>`;
        free.appendChild(tr);
    });

    const rows  = document.getElementById('hold-body');
    const alloc = document.getElementById('alloc');
    rows.innerHTML = '';
    alloc.innerHTML = '';

    Object.entries(assets)
        .map(([sym, a]) => ({ sym, a, v: valueOf(sym) }))
        .sort((x, y) => y.v - x.v)
        .forEach(({ sym, a, v }) => {
            const share = total ? (v / total) * 100 : 0;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="hold__sym">${sym}</span><span class="hold__name">${a.name}</span></td>
                <td class="r num">${qty(state.balances[sym] || 0, sym)}</td>
                <td class="r num">${money(state.prices[sym], px(sym))}</td>
                <td class="r num ${tone(state.chg[sym] || 0)}">${signed(state.chg[sym] || 0)} %</td>
                <td class="r num">${money(v)}</td>
                <td class="r num">${share.toFixed(1)} %</td>`;
            rows.appendChild(tr);

            const item = document.createElement('div');
            item.className = 'alloc__row';
            item.innerHTML = `
                <span class="alloc__sym">${sym}</span>
                <span class="alloc__pct">${share.toFixed(1)} %</span>
                <span class="bar"><i style="width:${share}%"></i></span>`;
            alloc.appendChild(item);
        });

    document.getElementById('hold-foot').innerHTML =
        `<tr><td class="cap">Итого</td><td colspan="3"></td>` +
        `<td class="r num">${money(total)}</td><td class="r num">100,0 %</td></tr>`;
};

/* ── обмен ─────────────────────────────────────────────────── */

const renderTicket = () => {
    const rate = state.prices[swap.from] / state.prices[swap.to];

    document.querySelector('[data-side="from"]').textContent = swap.from;
    document.querySelector('[data-side="to"]').textContent   = swap.to;

    document.getElementById('bal-give').textContent    = `${qty(state.balances[swap.from] || 0, swap.from)} ${swap.from}`;
    document.getElementById('bal-receive').textContent = `${qty(state.balances[swap.to]   || 0, swap.to)} ${swap.to}`;

    const give = parseFloat(document.getElementById('in-give').value) || 0;
    document.getElementById('in-receive').value = qty(give * rate, swap.to);

    document.getElementById('t-rate').textContent = `1 ${swap.from} = ${money(rate, rate >= 1000 ? 0 : rate >= 1 ? 2 : 4)} ${swap.to}`;
};

const setupTicket = () => {
    const give = document.getElementById('in-give');
    give.addEventListener('input', renderTicket);

    document.getElementById('btn-flip').addEventListener('click', () => {
        [swap.from, swap.to] = [swap.to, swap.from];
        renderTicket();
    });

    const drop = document.getElementById('drop');

    const openDrop = (btn, side) => {
        drop.innerHTML = '';
        Object.entries(assets).forEach(([sym]) => {
            const item = document.createElement('button');
            item.setAttribute('aria-selected', String(swap[side] === sym));
            item.innerHTML = `${sym}<em>${qty(state.balances[sym] || 0, sym)}</em>`;
            item.addEventListener('click', () => {
                const other = side === 'from' ? 'to' : 'from';
                // выбрали то же, что с другой стороны — просто меняем их местами
                if (sym === swap[other]) [swap.from, swap.to] = [swap.to, swap.from];
                else swap[side] = sym;
                renderTicket();
                drop.hidden = true;
            });
            drop.appendChild(item);
        });

        const box = btn.getBoundingClientRect();
        drop.hidden = false;
        const w = drop.offsetWidth;
        drop.style.top  = `${Math.min(box.bottom + 4, window.innerHeight - drop.offsetHeight - 8)}px`;
        drop.style.left = `${Math.max(8, Math.min(box.left, window.innerWidth - w - 8))}px`;
    };

    document.querySelectorAll('.js-pick').forEach(btn =>
        btn.addEventListener('click', (e) => { e.stopPropagation(); openDrop(btn, btn.dataset.side); }));

    document.addEventListener('click', (e) => {
        if (!drop.contains(e.target) && !e.target.closest('.js-pick')) drop.hidden = true;
    });

    document.getElementById('btn-go').addEventListener('click', () => {
        const btn = document.getElementById('btn-go');
        const amount = parseFloat(give.value) || 0;

        if (amount <= 0)                              { toast('Введите сумму больше нуля'); return; }
        if (amount > (state.balances[swap.from] || 0)) { toast(`Недостаточно ${swap.from} для обмена`); return; }

        const label = btn.textContent;
        btn.textContent = 'Отправлено в сеть…';
        btn.classList.add('is-busy');

        setTimeout(() => {
            const rate = state.prices[swap.from] / state.prices[swap.to];
            const got  = amount * rate * (1 - 0.003);   // комиссия как на настоящем dex

            state.balances[swap.from] -= amount;
            state.balances[swap.to]    = (state.balances[swap.to] || 0) + got;

            addLogRow(swap.from, swap.to, got);
            renderPortfolio();
            give.value = '1';
            renderTicket();

            toast(`${qty(amount, swap.from)} ${swap.from} → ${qty(got, swap.to)} ${swap.to}`, 'ok');
            btn.textContent = label;
            btn.classList.remove('is-busy');
        }, 1100);
    });

    renderTicket();
};

/* ── журнал ────────────────────────────────────────────────── */

const countLog = () => {
    const n = document.querySelectorAll('#log-body tr').length;
    document.getElementById('log-count').textContent = `${n} записей`;
};

const addLogRow = (from, to, got) => {
    const body = document.getElementById('log-body');
    const now  = new Date();
    const hash = `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="log__hash">только что</td>
        <td class="log__side">ОБМЕН · ${from} → ${to}</td>
        <td class="r num">${qty(got, to)}</td>
        <td class="log__hash">smart contract</td>
        <td><span class="st st--ok">исполнено</span></td>
        <td class="r"><button class="lnk js-tx"
            data-amount="${qty(got, to)} ${to}"
            data-fiat="≈ $${money(got * (state.prices[to] || 1))}"
            data-date="${now.toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}"
            data-network="Smart Contract"
            data-hash="${hash}"
            data-status="исполнено"
            data-tone="ok">карточка</button></td>`;

    body.prepend(tr);
    while (body.children.length > 8) body.lastElementChild.remove();
    countLog();
};

/* ── карточка операции ─────────────────────────────────────── */

const setupSheet = () => {
    const veil = document.getElementById('veil');
    const close = () => veil.classList.remove('is-on');

    // делегирование: строки журнала добавляются по ходу работы
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-tx');
        if (!btn) return;

        document.getElementById('s-amount').textContent = btn.dataset.amount;
        document.getElementById('s-fiat').textContent   = btn.dataset.fiat;
        document.getElementById('s-date').textContent   = btn.dataset.date;
        document.getElementById('s-net').textContent    = btn.dataset.network;
        document.getElementById('s-hash').textContent   = btn.dataset.hash;

        const st = document.getElementById('s-status');
        st.textContent = btn.dataset.status;
        st.className = `st st--${btn.dataset.tone}`;

        veil.classList.add('is-on');
    });

    document.getElementById('btn-close').addEventListener('click', close);
    veil.addEventListener('click', (e) => { if (e.target === veil) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
};

/* ── уведомления ───────────────────────────────────────────── */

const toast = (text, kind) => {
    const box = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = `toast${kind === 'ok' ? ' toast--ok' : ''}`;
    el.textContent = text;
    box.appendChild(el);

    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-on')));
    setTimeout(() => {
        el.classList.remove('is-on');
        setTimeout(() => el.remove(), 250);
    }, 4000);
};

const setupDemoButtons = () => {
    const text = 'Это проект портфолио, а не рабочий терминал — кнопка ничего не делает 😉';
    document.querySelectorAll('.js-demo').forEach(btn =>
        btn.addEventListener('click', () => toast(text)));
};

/* ── запуск ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    startClock();
    setupScreens();
    setupFrames();
    setupTicket();
    setupSheet();
    setupDemoButtons();
    renderWatchlist();
    renderPortfolio();
    countLog();
    refreshQuotes().then(loadChart);
    setInterval(refreshQuotes, 30000);
});
