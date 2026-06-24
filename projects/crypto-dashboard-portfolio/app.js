
const setupNavigation = () => {
    const navBtns = document.querySelectorAll('.nav-btn, .nav-btn-mobile');
    const views = document.querySelectorAll('.view-section');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');

    const viewMeta = {
        'view-dashboard': { title: 'Обзор активов', subtitle: 'Добро пожаловать обратно, вот ваша статистика на сегодня.' },
        'view-analytics': { title: 'Аналитика', subtitle: 'Глубокий анализ вашего портфеля и рыночных трендов.' },
        'view-wallets': { title: 'Кошельки', subtitle: 'Управление балансами и перевод средств.' },
        'view-exchange': { title: 'Своп', subtitle: 'Мгновенный обмен токенов по лучшему курсу.' }
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
                    if (b.querySelector('.nav-icon')) {
                        b.querySelector('.nav-icon').className = b.querySelector('.nav-icon').className.replace('text-accent-cyan', 'group-hover:text-accent-purple');
                    }
                }
            });
            
            const activeBtns = document.querySelectorAll(`[data-target="${targetId}"]`);
            activeBtns.forEach(activeBtn => {
                const isMobile = activeBtn.classList.contains('nav-btn-mobile');
                if (isMobile) {
                    activeBtn.className = 'nav-btn-mobile flex flex-col items-center gap-1 text-accent-cyan transition-colors';
                } else {
                    activeBtn.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/5 shadow-inner transition-all';
                    if (activeBtn.querySelector('.nav-icon')) {
                        const icon = activeBtn.querySelector('.nav-icon');
                        icon.className = icon.className.replace(/group-hover:text-[^\s]+/, '');
                        icon.classList.add('text-accent-cyan');
                    }
                }
            });

            headerTitle.textContent = viewMeta[targetId].title;
            headerSubtitle.textContent = viewMeta[targetId].subtitle;

            // плавно меняем экраны без наложения
            const currentView = Array.from(views).find(v => v.classList.contains('active'));
            const targetView = document.getElementById(targetId);

            if (currentView && currentView !== targetView) {
                
                currentView.classList.remove('active');
                
                setTimeout(() => {
                    currentView.style.display = 'none';
                    
                    targetView.style.display = 'block';
                    // пинок браузеру для старта анимации
                    targetView.offsetHeight;
                    
                    targetView.classList.add('active');
                    
                    if (targetId === 'view-analytics') {
                        initPortfolioChart();
                    }
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
    
    const btnNotif = document.getElementById('btn-notifications');
    const notifDropdown = document.getElementById('notifications-dropdown');
    const notifBadge = document.getElementById('notif-badge');

    btnNotif.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = notifDropdown.classList.contains('hidden');
        
        if (isHidden) {
            notifDropdown.classList.remove('hidden');
            if (notifBadge) notifBadge.style.display = 'none'; 
            
            requestAnimationFrame(() => {
                notifDropdown.classList.remove('scale-95', 'opacity-0');
                notifDropdown.classList.add('scale-100', 'opacity-100');
            });
        } else {
            closeDropdown();
        }
    });

    const closeDropdown = () => {
        notifDropdown.classList.remove('scale-100', 'opacity-100');
        notifDropdown.classList.add('scale-95', 'opacity-0');
        setTimeout(() => notifDropdown.classList.add('hidden'), 200);
    };

    // закрываем по клику мимо
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !btnNotif.contains(e.target)) {
            closeDropdown();
        }
    });

    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        
        const walletItems = document.querySelectorAll('.wallet-item');
        walletItems.forEach(item => {
            const tokenName = item.getAttribute('data-token').toLowerCase();
            if (tokenName.includes(val)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // прыгаем на вкладку кошельков при поиске
        if (val.length === 1) {
            document.querySelector('[data-target=view-wallets]').click();
        }
    });
};

const setupModal = () => {
    const modalOverlay = document.getElementById('modal-overlay');
    const txModal = document.getElementById('tx-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const txButtons = document.querySelectorAll('.btn-tx-details');

    const modalIconCont = document.getElementById('modal-icon-container');
    const modalIcon = document.getElementById('modal-icon');
    const modalAmount = document.getElementById('modal-amount');
    const modalFiat = document.getElementById('modal-fiat');
    const modalStatus = document.getElementById('modal-status');
    const modalDate = document.getElementById('modal-date');
    const modalNetwork = document.getElementById('modal-network');
    const modalHash = document.getElementById('modal-hash');

    const openModal = (e) => {
        const btn = e.currentTarget;
        
        modalAmount.innerText = btn.dataset.amount;
        modalFiat.innerText = btn.dataset.fiat;
        modalDate.innerText = btn.dataset.date;
        modalNetwork.innerText = btn.dataset.network;
        modalHash.innerText = btn.dataset.hash;
        modalStatus.innerText = btn.dataset.status;
        modalStatus.className = `text-sm font-medium ${btn.dataset.statusColor}`;

        let bgClass, iconClass, textClass;
        if (btn.dataset.type === 'deposit') { bgClass = 'bg-accent-green/10'; textClass = 'text-accent-green'; iconClass = 'ph-check-circle'; }
        else if (btn.dataset.type === 'withdraw') { bgClass = 'bg-accent-yellow/10'; textClass = 'text-accent-yellow'; iconClass = 'ph-clock'; }
        else if (btn.dataset.type === 'swap') { bgClass = 'bg-[#627EEA]/10'; textClass = 'text-[#627EEA]'; iconClass = 'ph-arrows-left-right'; }
        else { bgClass = 'bg-accent-red/10'; textClass = 'text-accent-red'; iconClass = 'ph-x-circle'; }

        modalIconCont.className = `w-16 h-16 rounded-full flex items-center justify-center mb-3 ${bgClass} ${textClass}`;
        modalIcon.className = `ph ${iconClass} text-4xl`;

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

    txButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
};

const colors = {
    cyan: '#00F0FF', cyanFade: 'rgba(0, 240, 255, 0.15)', cyanFadeDeep: 'rgba(0, 240, 255, 0.01)',
    grid: '#2A3143', text: '#94A3B8'
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
};

let mainChart;
const fetchBinanceData = async (timeframe) => {
    let interval, limit;
    if (timeframe === '1H') { interval = '1m'; limit = 60; }
    else if (timeframe === '1D') { interval = '1h'; limit = 24; }
    else if (timeframe === '1W') { interval = '4h'; limit = 42; }
    else { interval = '1d'; limit = 30; }

    try {
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`);
        const rawData = await res.json();
        
        if (!Array.isArray(rawData)) {
            throw new Error("Неверный формат данных от Binance API");
        }
        
        const labels = [];
        const data = [];
        
        rawData.forEach(kline => {
            const date = new Date(kline[0]);
            let label = '';
            if (timeframe === '1H') label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            else if (timeframe === '1D') label = `${date.getHours()}:00`;
            else if (timeframe === '1W') label = date.toLocaleDateString('ru-RU', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
            else label = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            labels.push(label);
            data.push(parseFloat(kline[4]));
        });
        return { labels, data };
    } catch (err) {
        console.warn("Ошибка Binance API. Используем локальные демо-данные:", err);
        
        // моки на случай если бинанс лежит
        let dataLength, vol;
        const labels = [], data = [];
        let currentPrice = 64500;
        const now = new Date();

        if (timeframe === '1H') { dataLength = 60; vol = 50; }
        else if (timeframe === '1D') { dataLength = 24; vol = 300; }
        else if (timeframe === '1W') { dataLength = 7; vol = 1000; }
        else { dataLength = 30; vol = 1500; }

        for(let i=dataLength; i>=0; i--) {
            const d = new Date(now.getTime() - i * (timeframe === '1H'? 60000 : timeframe==='1D'? 3600000 : 86400000));
            labels.push(timeframe === '1H' ? `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}` :
                        timeframe === '1D' ? `${d.getHours()}:00` :
                        timeframe === '1W' ? d.toLocaleDateString('ru-RU', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) :
                        d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
            currentPrice += (Math.random() - 0.48) * vol;
            data.push(currentPrice);
        }
        return { labels, data };
    }
};

const updateLiveBalances = (currentBtcPrice) => {
    const totalBalanceEl = document.getElementById('total-balance');
    if (totalBalanceEl) {
        // считаем баланс по курсу
        const newBalance = currentBtcPrice * 1.93;
        totalBalanceEl.innerText = formatCurrency(newBalance);
    }
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
            labels: labels,
            datasets: [{
                data: data, borderColor: colors.cyan, backgroundColor: gradient,
                borderWidth: 2, pointBackgroundColor: '#0B0E14', pointBorderColor: colors.cyan,
                pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 6, fill: true, tension: 0.4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#fff', borderColor: '#2A3143', borderWidth: 1, padding: 12, displayColors: false, callbacks: { label: (c) => formatCurrency(c.parsed.y) } } },
            scales: {
                x: { grid: { display: false, drawBorder: false }, ticks: { maxTicksLimit: 7, font: { size: 11 } } },
                y: { grid: { color: colors.grid, drawBorder: false, borderDash: [5, 5] }, ticks: { callback: (v) => '$' + (v / 1000) + 'k', font: { size: 11 } } }
            }
        }
    });

    const latestPrice = data[data.length - 1];
    const firstPrice = data[0];
    const diff = latestPrice - firstPrice;
    
    const priceEl = document.getElementById('current-btc-price');
    const changeEl = document.getElementById('btc-price-change');
    priceEl.innerText = formatCurrency(latestPrice);
    // фикс знака для мобилок
    changeEl.innerHTML = `<i class="ph ${diff >= 0 ? 'ph-trend-up' : 'ph-trend-down'}"></i> ${diff >= 0 ? '+' : '-'}${formatCurrency(Math.abs(diff))}`;
    changeEl.className = `text-sm font-medium flex items-center gap-1 ${diff >= 0 ? 'text-accent-green' : 'text-accent-red'}`;
};

const initPortfolioChart = () => {
    const canvas = document.getElementById('portfolioChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (window.portfolioChartInstance) {
        window.portfolioChartInstance.destroy();
    }
    
    window.portfolioChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Tether', 'Solana'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#FFC107', '#627EEA', '#26A17B', '#14F195'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', 
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff', bodyColor: '#fff', borderColor: '#2A3143', borderWidth: 1, padding: 12,
                    callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` }
                }
            }
        }
    });
};

const setupExchange = () => {
    const inputGive = document.getElementById('swap-input-give');
    const inputReceive = document.getElementById('swap-input-receive');
    const rate = 3500.50; 

    if(inputGive && inputReceive) {
        inputGive.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                inputReceive.value = (val * rate).toFixed(2);
            } else {
                inputReceive.value = '0.00';
            }
        });
    }
};

const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    // растягиваем плашку на весь экран на телефонах
    toast.className = `glass-card border px-5 py-4 rounded-2xl flex items-start gap-4 transform translate-y-10 opacity-0 transition-all duration-300 w-full sm:max-w-[360px] pointer-events-auto ${
        isSuccess ? 'border-accent-green/30' : 'border-accent-cyan/30'
    }`;
    
    const icon = isSuccess ? '<i class="ph-fill ph-check-circle text-accent-green text-2xl"></i>' 
                           : '<i class="ph-fill ph-info text-accent-cyan text-2xl"></i>';

    toast.innerHTML = `
        ${icon}
        <p class="text-sm font-medium text-white leading-tight">${message}</p>
    `;

    container.appendChild(toast);

    // анимация появления
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });
    });

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

const setupDemoButtons = () => {
    const demoMsg = "Эта функция недоступна, так как это один из проектов портфолио, а не полноценный ресурс 😉";
    
    const actionButtons = document.querySelectorAll('#wallet-list button, button.bg-accent-cyan, .btn-swap-settings, .btn-select-token, .btn-swap-direction');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(demoMsg, 'info');
        });
    });

    const btnExchange = document.querySelector('#view-exchange button.bg-gradient-to-r');
    if (btnExchange) {
        btnExchange.addEventListener('click', () => {
            const giveAmt = parseFloat(document.getElementById('swap-input-give').value) || 0;
            const recAmt = parseFloat(document.getElementById('swap-input-receive').value) || 0;
            
            const balGiveEl = document.getElementById('swap-balance-give');
            const balRecEl = document.getElementById('swap-balance-receive');
            
            let currentEth = parseFloat(balGiveEl.innerText.replace(/[^0-9.]/g, '')) || 12.5;
            let currentUsdt = parseFloat(balRecEl.innerText.replace(/[^0-9.,]/g, '')) || 5420.00;

            if (giveAmt <= 0) {
                showToast('Введите сумму больше нуля', 'error');
                return;
            }

            if (giveAmt > currentEth) {
                showToast('Недостаточно ETH для обмена', 'error');
                return;
            }

            const btnOriginalText = btnExchange.innerText;
            btnExchange.innerHTML = '<i class="ph ph-spinner animate-spin text-xl inline-block align-text-bottom"></i> Обработка...';
            btnExchange.classList.add('opacity-80', 'pointer-events-none');
            
            setTimeout(() => {
                btnExchange.innerHTML = btnOriginalText;
                btnExchange.classList.remove('opacity-80', 'pointer-events-none');
                
                showToast(`Успешный обмен: ${giveAmt} ETH на ${recAmt} USDT`, 'success');
                
                currentEth -= giveAmt;
                currentUsdt += recAmt;
                balGiveEl.innerText = `Баланс: ${currentEth.toFixed(4)} ETH`;
                balRecEl.innerText = `Баланс: ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}).format(currentUsdt)} USDT`;
                
                const totalBalanceEl = document.getElementById('total-balance');
                if (totalBalanceEl) {
                    const currentVal = parseFloat(totalBalanceEl.innerText.replace(/[^0-9.-]+/g,""));
                    totalBalanceEl.innerText = formatCurrency(currentVal - 5.20);
                }
            }, 1200);
        });
    }

    const btnMarkRead = document.querySelector('#notifications-dropdown button.text-accent-cyan');
    if (btnMarkRead) {
        btnMarkRead.addEventListener('click', () => {
            showToast(demoMsg, 'info');
        });
    }
    
    const profileBtn = document.querySelector('aside .cursor-pointer');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => showToast(demoMsg, 'info'));
    }

    const explorerBtn = document.getElementById('modal-explorer-btn');
    if (explorerBtn) {
        explorerBtn.addEventListener('click', () => showToast(demoMsg, 'info'));
    }
};

const initDashboard = () => {
    setupNavigation();
    setupHeaderInteractivity();
    setupModal();
    setupExchange();
    setupDemoButtons();

    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    timeframeBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            timeframeBtns.forEach(b => b.className = 'timeframe-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-colors');
            e.target.className = 'timeframe-btn px-3 py-1 text-xs font-medium rounded-md bg-dark-border text-white shadow-sm';
            
            const btnText = e.target.innerText;
            const liveData = await fetchBinanceData(btnText);
            renderMainChart(liveData.labels, liveData.data);
        });
    });

    fetchBinanceData('1M').then(initialData => {
        renderMainChart(initialData.labels, initialData.data);
        const currentBtcPrice = initialData.data[initialData.data.length - 1];
        if (currentBtcPrice) updateLiveBalances(currentBtcPrice);
    });
};

document.addEventListener('DOMContentLoaded', initDashboard);
