
// портфель живёт в памяти — сброс только при перезагрузке
const state = {
    balances: { BTC: 1.45, ETH: 12.5, USDT: 5420.00, SOL: 0 },
    prices:   { BTC: 64500, ETH: 3500.50, USDT: 1, SOL: 135 },
};

const tokens = {
    BTC:  { iconClass: 'ph-fill ph-currency-btc',   color: '#FBBF24' },
    ETH:  { iconClass: 'ph-fill ph-currency-eth',    color: '#627EEA' },
    USDT: { iconClass: 'ph-fill ph-currency-dollar', color: '#26A17B' },
    SOL:  { iconClass: 'ph-fill ph-coins',           color: '#14F195' },
};

const swap = { from: 'ETH', to: 'USDT' };

const formatCurrency    = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);
const formatAmount      = (n, d = 4) => parseFloat(n.toFixed(d)).toString();
// для тоста и новых строк таблицы — с разделителем тысяч, без лишних нулей
const formatTokenAmount = (n, sym) => {
    const d = sym === 'USDT' ? 2 : 4;
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
};

const renderSwapUI = () => {
    const f    = tokens[swap.from];
    const t    = tokens[swap.to];
    const rate = state.prices[swap.from] / state.prices[swap.to];

    const btnFrom = document.querySelector('#swap-block-give .btn-select-token');
    const btnTo   = document.querySelector('#swap-block-receive .btn-select-token');
    if (btnFrom) btnFrom.innerHTML = `<i class="${f.iconClass}" style="color:${f.color}"></i> ${swap.from} <i class="ph ph-caret-down text-slate-400"></i>`;
    if (btnTo)   btnTo.innerHTML   = `<i class="${t.iconClass}" style="color:${t.color}"></i> ${swap.to} <i class="ph ph-caret-down text-slate-400"></i>`;

    const giveEl = document.getElementById('swap-balance-give');
    const recEl  = document.getElementById('swap-balance-receive');
    if (giveEl) giveEl.textContent = `Баланс: ${formatAmount(state.balances[swap.from] || 0)} ${swap.from}`;
    if (recEl)  recEl.textContent  = `Баланс: ${formatAmount(state.balances[swap.to]   || 0)} ${swap.to}`;

    const inputGive    = document.getElementById('swap-input-give');
    const inputReceive = document.getElementById('swap-input-receive');
    if (inputGive && inputReceive) {
        inputReceive.value = (parseFloat(inputGive.value || 0) * rate).toFixed(2);
    }

    const rateEl = document.getElementById('swap-rate-info');
    if (rateEl) rateEl.textContent = `1 ${swap.from} = ${rate.toFixed(2)} ${swap.to}`;
};

const updateWalletDisplay = () => {
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    set('wallet-eth-amount', `${formatAmount(state.balances.ETH)} ETH`);
    set('wallet-eth-fiat',   `≈ ${formatCurrency(state.balances.ETH * state.prices.ETH)}`);
    set('wallet-btc-amount', `${formatAmount(state.balances.BTC)} BTC`);
    set('wallet-btc-fiat',   `≈ ${formatCurrency(state.balances.BTC * state.prices.BTC)}`);

    const total = Object.entries(state.balances).reduce((sum, [sym, amt]) => sum + (state.prices[sym] || 0) * amt, 0);
    set('total-balance', formatCurrency(total));
};

const setupNavigation = () => {
    const navBtns   = document.querySelectorAll('.nav-btn, .nav-btn-mobile');
    const views     = document.querySelectorAll('.view-section');
    const scrollEl  = document.getElementById('main-scroll');

    const viewMeta = {
        'view-dashboard': { title: 'Обзор активов',  subtitle: 'Добро пожаловать обратно, вот ваша статистика на сегодня.' },
        'view-analytics': { title: 'Аналитика',       subtitle: 'Глубокий анализ вашего портфеля и рыночных трендов.' },
        'view-wallets':   { title: 'Кошельки',        subtitle: 'Управление балансами и перевод средств.' },
        'view-exchange':  { title: 'Своп',            subtitle: 'Мгновенный обмен токенов по лучшему курсу.' }
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            navBtns.forEach(b => {
                const isMobile = b.classList.contains('nav-btn-mobile');
                if (isMobile) {
                    b.className = 'nav-btn-mobile flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors';
                } else {
                    b.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group';
                    const icon = b.querySelector('.nav-icon');
                    if (icon) icon.className = icon.className.replace('text-accent-cyan', 'group-hover:text-accent-purple');
                }
            });

            document.querySelectorAll(`[data-target="${targetId}"]`).forEach(activeBtn => {
                const isMobile = activeBtn.classList.contains('nav-btn-mobile');
                if (isMobile) {
                    activeBtn.className = 'nav-btn-mobile flex flex-col items-center gap-1 text-accent-cyan transition-colors';
                } else {
                    activeBtn.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/5 shadow-inner transition-all';
                    const icon = activeBtn.querySelector('.nav-icon');
                    if (icon) {
                        icon.className = icon.className.replace(/group-hover:text-[^\s]+/, '');
                        icon.classList.add('text-accent-cyan');
                    }
                }
            });

            document.getElementById('header-title').textContent    = viewMeta[targetId].title;
            document.getElementById('header-subtitle').textContent = viewMeta[targetId].subtitle;

            const currentView = Array.from(views).find(v => v.classList.contains('active'));
            const targetView  = document.getElementById(targetId);

            if (currentView && currentView !== targetView) {
                currentView.classList.remove('active');
                setTimeout(() => {
                    currentView.style.display = 'none';
                    targetView.style.display  = 'block';
                    targetView.offsetHeight; // пинок браузеру для старта анимации
                    targetView.classList.add('active');

                    // сбрасываем скролл — пользователь всегда видит начало вкладки
                    if (scrollEl) scrollEl.scrollTop = 0;

                    if (targetId === 'view-analytics') initPortfolioChart();
                }, 200);
            } else if (!currentView) {
                targetView.style.display = 'block';
                targetView.offsetHeight;
                targetView.classList.add('active');
            }
        });
    });
};

const setupHeaderInteractivity = () => {
    const btnNotif      = document.getElementById('btn-notifications');
    const notifDropdown = document.getElementById('notifications-dropdown');
    const notifBadge    = document.getElementById('notif-badge');

    const closeNotif = () => {
        notifDropdown.classList.remove('scale-100', 'opacity-100');
        notifDropdown.classList.add('scale-95', 'opacity-0');
        setTimeout(() => notifDropdown.classList.add('hidden'), 200);
    };

    btnNotif.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notifDropdown.classList.contains('hidden')) {
            notifDropdown.classList.remove('hidden');
            if (notifBadge) notifBadge.style.display = 'none';
            requestAnimationFrame(() => {
                notifDropdown.classList.remove('scale-95', 'opacity-0');
                notifDropdown.classList.add('scale-100', 'opacity-100');
            });
        } else {
            closeNotif();
        }
    });

    // закрываем по клику мимо
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !btnNotif.contains(e.target)) closeNotif();
    });

    document.getElementById('global-search').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll('.wallet-item').forEach(item => {
            item.style.display = item.getAttribute('data-token').toLowerCase().includes(val) ? 'flex' : 'none';
        });
        // прыгаем на вкладку кошельков при поиске
        if (val.length === 1) document.querySelector('[data-target=view-wallets]').click();
    });
};

const setupModal = () => {
    const modalOverlay  = document.getElementById('modal-overlay');
    const txModal       = document.getElementById('tx-modal');
    const closeBtn      = document.getElementById('btn-close-modal');
    const modalIconCont = document.getElementById('modal-icon-container');
    const modalIcon     = document.getElementById('modal-icon');

    const openModal = (btn) => {
        document.getElementById('modal-amount').innerText  = btn.dataset.amount;
        document.getElementById('modal-fiat').innerText    = btn.dataset.fiat;
        document.getElementById('modal-date').innerText    = btn.dataset.date;
        document.getElementById('modal-network').innerText = btn.dataset.network;
        document.getElementById('modal-hash').innerText    = btn.dataset.hash;
        const statusEl = document.getElementById('modal-status');
        statusEl.innerText   = btn.dataset.status;
        statusEl.className   = `text-sm font-medium ${btn.dataset.statusColor}`;

        let bgClass, iconClass, textClass;
        if      (btn.dataset.type === 'deposit')  { bgClass = 'bg-accent-green/10';  textClass = 'text-accent-green';  iconClass = 'ph-check-circle'; }
        else if (btn.dataset.type === 'withdraw') { bgClass = 'bg-accent-yellow/10'; textClass = 'text-accent-yellow'; iconClass = 'ph-clock'; }
        else if (btn.dataset.type === 'swap')     { bgClass = 'bg-[#627EEA]/10';     textClass = 'text-[#627EEA]';    iconClass = 'ph-arrows-left-right'; }
        else                                       { bgClass = 'bg-accent-red/10';    textClass = 'text-accent-red';   iconClass = 'ph-x-circle'; }

        modalIconCont.className = `w-16 h-16 rounded-full flex items-center justify-center mb-3 ${bgClass} ${textClass}`;
        modalIcon.className     = `ph ${iconClass} text-4xl`;
        modalOverlay.classList.remove('pointer-events-none');
        modalOverlay.classList.add('opacity-100');
        txModal.classList.remove('scale-95');
        txModal.classList.add('scale-100');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('opacity-100');
        txModal.classList.remove('scale-100');
        txModal.classList.add('scale-95');
        setTimeout(() => modalOverlay.classList.add('pointer-events-none'), 300);
    };

    // делегирование — работает и для статичных, и для динамически добавленных строк
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-tx-details');
        if (btn) openModal(btn);
    });
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
};

const colors = {
    cyan: '#00F0FF', cyanFade: 'rgba(0, 240, 255, 0.15)', cyanFadeDeep: 'rgba(0, 240, 255, 0.01)',
    grid: '#2A3143', text: '#94A3B8'
};

let mainChart;
const fetchBinanceData = async (timeframe) => {
    let interval, limit;
    if      (timeframe === '1H') { interval = '1m'; limit = 60; }
    else if (timeframe === '1D') { interval = '1h'; limit = 24; }
    else if (timeframe === '1W') { interval = '4h'; limit = 42; }
    else                          { interval = '1d'; limit = 30; }

    try {
        const res     = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`);
        const rawData = await res.json();
        if (!Array.isArray(rawData)) throw new Error('bad format');

        const labels = [], data = [];
        rawData.forEach(kline => {
            const d = new Date(kline[0]);
            let label =
                timeframe === '1H' ? `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}` :
                timeframe === '1D' ? `${d.getHours()}:00` :
                timeframe === '1W' ? d.toLocaleDateString('ru-RU', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) :
                                     d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            labels.push(label);
            data.push(parseFloat(kline[4]));
        });
        return { labels, data };
    } catch (err) {
        console.warn('Binance недоступен, берём локальные данные:', err);

        // моки на случай если бинанс лежит
        const labels = [], data = [];
        let price = 64500;
        const now = new Date();
        let len, vol, step;
        if      (timeframe === '1H') { len = 60; vol = 50;   step = 60000; }
        else if (timeframe === '1D') { len = 24; vol = 300;  step = 3600000; }
        else if (timeframe === '1W') { len =  7; vol = 1000; step = 86400000; }
        else                          { len = 30; vol = 1500; step = 86400000; }

        for (let i = len; i >= 0; i--) {
            const d = new Date(now.getTime() - i * step);
            labels.push(
                timeframe === '1H' ? `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}` :
                timeframe === '1D' ? `${d.getHours()}:00` :
                timeframe === '1W' ? d.toLocaleDateString('ru-RU', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) :
                                     d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
            );
            price += (Math.random() - 0.48) * vol;
            data.push(price);
        }
        return { labels, data };
    }
};

const updateLiveBalances = (currentBtcPrice) => {
    state.prices.BTC = currentBtcPrice;
    updateWalletDisplay();
};

const renderMainChart = (labels, data) => {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colors.cyanFade);
    gradient.addColorStop(1, colors.cyanFadeDeep);

    if (mainChart) mainChart.destroy();
    Chart.defaults.color = colors.text;
    Chart.defaults.font.family = "'Inter', sans-serif";

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data, borderColor: colors.cyan, backgroundColor: gradient,
                borderWidth: 2, pointBackgroundColor: '#0B0E14', pointBorderColor: colors.cyan,
                pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 6, fill: true, tension: 0.4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#fff', borderColor: '#2A3143', borderWidth: 1, padding: 12, displayColors: false, callbacks: { label: (c) => formatCurrency(c.parsed.y) } }
            },
            scales: {
                x: { grid: { display: false, drawBorder: false }, ticks: { maxTicksLimit: 7, font: { size: 11 } } },
                y: { grid: { color: colors.grid, drawBorder: false, borderDash: [5, 5] }, ticks: { callback: (v) => '$' + (v / 1000).toFixed(0) + 'k', font: { size: 11 } } }
            }
        }
    });

    const latestPrice = data[data.length - 1];
    const diff        = latestPrice - data[0];
    document.getElementById('current-btc-price').innerText = formatCurrency(latestPrice);
    const changeEl = document.getElementById('btc-price-change');
    // фикс знака для мобилок
    changeEl.innerHTML = `<i class="ph ${diff >= 0 ? 'ph-trend-up' : 'ph-trend-down'}"></i> ${diff >= 0 ? '+' : '-'}${formatCurrency(Math.abs(diff))}`;
    changeEl.className = `text-sm font-medium flex items-center gap-1 ${diff >= 0 ? 'text-accent-green' : 'text-accent-red'}`;
};

const initPortfolioChart = () => {
    const canvas = document.getElementById('portfolioChart');
    if (!canvas) return;
    if (window.portfolioChartInstance) window.portfolioChartInstance.destroy();

    window.portfolioChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Tether', 'Solana'],
            datasets: [{ data: [45, 30, 15, 10], backgroundColor: ['#FFC107', '#627EEA', '#26A17B', '#14F195'], borderWidth: 0, hoverOffset: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#fff', borderColor: '#2A3143', borderWidth: 1, padding: 12, callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` } }
            }
        }
    });
};

const addTransactionRow = (fromSym, toSym, giveAmt, recAmt) => {
    const tbody = document.querySelector('#view-dashboard table tbody');
    if (!tbody) return;

    const now     = new Date();
    const dateStr = 'Только что';
    const fullDate = now.toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const hash    = `${Math.random().toString(36).substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`;

    const row = document.createElement('tr');
    row.className = 'border-b border-dark-border/50 hover:bg-white/5 transition-colors';
    row.innerHTML = `
        <td class="py-4 px-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#627EEA]/10 flex items-center justify-center text-[#627EEA] shrink-0"><i class="ph ph-arrows-left-right"></i></div>
            <div><p class="font-medium text-white">Обмен</p><p class="text-xs text-slate-500">${fromSym} → ${toSym}</p></div>
        </td>
        <td class="py-4 px-4 text-white font-medium">${formatTokenAmount(recAmt, toSym)} ${toSym}</td>
        <td class="py-4 px-4 text-slate-400">${dateStr}</td>
        <td class="py-4 px-4 text-slate-500 font-mono text-xs">Smart Contract</td>
        <td class="py-4 px-4 text-right"><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-green/10 text-accent-green border border-accent-green/20">Успешно</span></td>
        <td class="py-4 px-4 text-right">
            <button class="btn-tx-details text-slate-400 hover:text-white px-2 py-1 bg-dark-surface rounded-md border border-dark-border"
                data-type="swap"
                data-amount="${formatTokenAmount(recAmt, toSym)} ${toSym}"
                data-fiat="≈ ${formatCurrency(recAmt * (state.prices[toSym] || 1))}"
                data-date="${fullDate}"
                data-network="Smart Contract"
                data-hash="${hash}"
                data-status="Успешно"
                data-status-color="text-accent-green">Детали</button>
        </td>`;

    tbody.prepend(row);
    // держим не больше 5 строк — старые уходят
    while (tbody.children.length > 5) tbody.lastElementChild.remove();
};

const setupExchange = () => {
    const inputGive    = document.getElementById('swap-input-give');
    const inputReceive = document.getElementById('swap-input-receive');

    if (inputGive) {
        inputGive.addEventListener('input', () => {
            const rate = state.prices[swap.from] / state.prices[swap.to];
            const val  = parseFloat(inputGive.value);
            if (inputReceive) inputReceive.value = isNaN(val) ? '0.00' : (val * rate).toFixed(2);
        });
    }

    // стрелки направления свопа — меняем from/to местами
    document.querySelector('.btn-swap-direction')?.addEventListener('click', () => {
        [swap.from, swap.to] = [swap.to, swap.from];
        renderSwapUI();
    });

    // пикер токенов
    const pickerDropdown = document.getElementById('token-picker-dropdown');
    let pickerTarget = null;

    const openPicker = (btn, target) => {
        pickerTarget = target;
        const list = document.getElementById('token-picker-list');
        list.innerHTML = '';

        Object.entries(tokens).forEach(([sym, tok]) => {
            const isActive = swap[target] === sym;
            const item = document.createElement('button');
            item.className = `flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`;
            item.innerHTML = `
                <i class="${tok.iconClass} text-lg shrink-0" style="color:${tok.color}"></i>
                <span class="font-medium">${sym}</span>
                <span class="text-xs text-slate-500 ml-auto">${formatAmount(state.balances[sym] || 0)}</span>
            `;
            item.addEventListener('click', () => {
                const other = target === 'from' ? 'to' : 'from';
                // если выбрали то же что с другой стороны — меняем их местами
                if (sym === swap[other]) {
                    [swap.from, swap.to] = [swap.to, swap.from];
                } else {
                    swap[target] = sym;
                }
                renderSwapUI();
                pickerDropdown.classList.add('hidden');
            });
            list.appendChild(item);
        });

        const rect = btn.getBoundingClientRect();
        let left = rect.left;
        if (left + 216 > window.innerWidth - 8) left = window.innerWidth - 216 - 8;
        pickerDropdown.style.top  = `${rect.bottom + 6}px`;
        pickerDropdown.style.left = `${Math.max(8, left)}px`;
        pickerDropdown.classList.remove('hidden');
    };

    document.addEventListener('click', (e) => {
        if (!pickerDropdown?.contains(e.target) && !e.target.closest('.btn-select-token')) {
            pickerDropdown?.classList.add('hidden');
        }
    });

    document.querySelectorAll('#swap-block-give .btn-select-token').forEach(btn =>
        btn.addEventListener('click', (e) => { e.stopPropagation(); openPicker(btn, 'from'); })
    );
    document.querySelectorAll('#swap-block-receive .btn-select-token').forEach(btn =>
        btn.addEventListener('click', (e) => { e.stopPropagation(); openPicker(btn, 'to'); })
    );

    renderSwapUI();
};

const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    // растягиваем плашку на весь экран на телефонах
    toast.className = `glass-card border px-5 py-4 rounded-2xl flex items-start gap-4 transform translate-y-10 opacity-0 transition-all duration-300 w-full sm:max-w-[360px] pointer-events-auto ${isSuccess ? 'border-accent-green/30' : 'border-accent-cyan/30'}`;
    toast.innerHTML = `
        ${isSuccess ? '<i class="ph-fill ph-check-circle text-accent-green text-2xl"></i>' : '<i class="ph-fill ph-info text-accent-cyan text-2xl"></i>'}
        <p class="text-sm font-medium text-white leading-tight">${message}</p>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }));

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

const setupDemoButtons = () => {
    const demoMsg = 'Эта функция недоступна, так как это один из проектов портфолио, а не полноценный ресурс 😉';

    // btn-swap-direction и btn-select-token живут в setupExchange, здесь их нет
    document.querySelectorAll('#wallet-list button, button.bg-accent-cyan, .btn-swap-settings').forEach(btn =>
        btn.addEventListener('click', (e) => { e.preventDefault(); showToast(demoMsg, 'info'); })
    );

    const btnExchange = document.getElementById('btn-confirm-exchange');
    if (btnExchange) {
        btnExchange.addEventListener('click', () => {
            const giveAmt = parseFloat(document.getElementById('swap-input-give').value) || 0;
            const recAmt  = parseFloat(document.getElementById('swap-input-receive').value) || 0;

            if (giveAmt <= 0) { showToast('Введите сумму больше нуля', 'info'); return; }
            if (giveAmt > (state.balances[swap.from] || 0)) { showToast(`Недостаточно ${swap.from} для обмена`, 'info'); return; }

            const originalHTML = btnExchange.innerHTML;
            btnExchange.innerHTML = '<i class="ph ph-spinner animate-spin text-xl inline-block align-text-bottom"></i> Обработка...';
            btnExchange.classList.add('opacity-80', 'pointer-events-none');

            setTimeout(() => {
                // реалистичная комиссия dex — баланс действительно уменьшается
                const recAmtFinal = recAmt * (1 - 0.003);

                state.balances[swap.from] = (state.balances[swap.from] || 0) - giveAmt;
                state.balances[swap.to]   = (state.balances[swap.to]   || 0) + recAmtFinal;

                updateWalletDisplay();
                addTransactionRow(swap.from, swap.to, giveAmt, recAmtFinal);

                document.getElementById('swap-input-give').value = '1';
                renderSwapUI();

                showToast(`${formatTokenAmount(giveAmt, swap.from)} ${swap.from} → ${formatTokenAmount(recAmtFinal, swap.to)} ${swap.to}`, 'success');

                btnExchange.innerHTML = originalHTML;
                btnExchange.classList.remove('opacity-80', 'pointer-events-none');
            }, 1200);
        });
    }

    document.querySelector('#notifications-dropdown button.text-accent-cyan')?.addEventListener('click', () => showToast(demoMsg, 'info'));
    document.querySelector('aside .cursor-pointer')?.addEventListener('click', () => showToast(demoMsg, 'info'));
    document.getElementById('modal-explorer-btn')?.addEventListener('click', () => showToast(demoMsg, 'info'));
};

const initDashboard = () => {
    setupNavigation();
    setupHeaderInteractivity();
    setupModal();
    setupExchange();
    setupDemoButtons();

    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.className = 'timeframe-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-colors');
            e.target.className = 'timeframe-btn px-3 py-1 text-xs font-medium rounded-md bg-dark-border text-white shadow-sm';
            const liveData = await fetchBinanceData(e.target.innerText);
            renderMainChart(liveData.labels, liveData.data);
        });
    });

    fetchBinanceData('1M').then(initialData => {
        renderMainChart(initialData.labels, initialData.data);
        const btcPrice = initialData.data[initialData.data.length - 1];
        if (btcPrice) updateLiveBalances(btcPrice);
    });
};

document.addEventListener('DOMContentLoaded', initDashboard);
