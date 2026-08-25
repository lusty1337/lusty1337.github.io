// переключение языка лендинга. один html, два словаря — тексты подставляются
// по data-атрибутам, выбор живёт в localStorage и в ?lang= для расшаривания ссылки.
//
// разметка:
//   data-i18n        → textContent
//   data-i18n-ph     → placeholder
//   data-i18n-aria   → aria-label
//   data-i18n-content→ content (для meta)
//   data-lang-only="ru" → элемент показывается только на этом языке

const DICT = {
    ru: {
        'meta.title': 'Егор | Портфолио',
        'meta.desc': 'Разработка сайтов, дашбордов и Telegram-ботов. Чистый код на Tailwind, адаптив, интеграции с API и автоматизация.',
        'meta.ogTitle': 'Егор — сайты, боты, автоматизация',

        'brand': 'Егор.',
        'nav.home': 'Главная',
        'nav.about': 'Обо мне',
        'nav.projects': 'Проекты',
        'nav.pricing': 'Цены',
        'nav.contact': 'Связь',
        'nav.cta': 'Начать проект',
        'nav.menu': 'Открыть меню',

        'hero.title1': 'Сайты, боты,',
        'hero.title2': 'автоматизация.',
        'hero.lead': 'Разрабатываю сайты и лендинги (сайты-визитки) любой сложности, Telegram-ботов и Telegram Mini Apps. Чистый код без тяжёлых библиотек, адаптив под любой экран и устройство, быстрая загрузка.',
        'hero.cta': 'Смотреть проекты',

        'about.h2': 'Привет! Я Егор.',
        'about.lead': 'Fullstack-разработчик: закрываю проект целиком, от вёрстки до сервера. Пишу на чистом коде — HTML, Tailwind CSS, JavaScript — и подключаю тяжёлые библиотеки только там, где они реально нужны. Беру на себя весь цикл: интерфейс, логика, интеграции с API, деплой и поддержка.',
        'about.compTitle': 'Мои компетенции',
        'about.frontDesc': 'Лендинги, дашборды и веб-приложения. HTML/CSS с Tailwind, TypeScript, React для сложных интерфейсов — и чистый Vanilla JS там, где его хватает. Адаптив от 320px, анимации на GSAP, 3D на Three.js.',
        'about.backDesc': 'Python (FastAPI) и Node.js для серверной части. Telegram-боты и Mini Apps, базы данных (PostgreSQL, SQLite), парсеры, автоматизация. Интеграции с внешними API и платёжными системами.',
        'about.infraDesc': 'Git и GitHub для версионирования, Docker для изоляции окружения, GitHub Actions для CI/CD. Деплой на Linux VPS через Nginx или на Vercel. От нуля до рабочего продакшна.',

        'stack.title': 'Стек',

        'projects.h2': 'Проекты.',
        'projects.lead': 'Живые демо — можно потыкать прямо здесь, в окне превью. Исходники открыты на GitHub.',
        'projects.task': 'Задача',
        'projects.done': 'Что сделано',
        'projects.openFull': 'Открыть на весь экран →',
        'projects.source': 'Исходный код',
        'projects.openTg': 'Открыть в Telegram →',
        'projects.openBrowser': 'Открыть в браузере',
        'projects.download': 'Скачать ↓',
        'projects.priceLabel': 'Сколько это примерно стоит?',

        'keyboard.task': 'Сайт-презентация премиальной механической клавиатуры с настоящим 3D в браузере, на уровне продуктовых страниц Apple. Продукта физически не существует, поэтому модель, материалы и фирменный стиль нужно было придумать и собрать с нуля.',
        'keyboard.done': 'Клавиатура целиком построена кодом на React Three Fiber: семь слоёв, 68 клавиш, процедурные текстуры платы, ни одной сторонней модели. Вся сцена — чистая функция от прокрутки, поэтому идёт одинаково плавно вперёд и назад. Мобильная версия разворачивает композицию под портрет и снимает нагрузку по тому, чего на экране в ладонь всё равно не видно.',
        'keyboard.price': '150 000 – 450 000 ₽',
        'keyboard.priceWhy': 'Процедурная 3D-сцена со скролл-анимацией — верхняя планка веб-разработки: геометрия, материалы и пост-обработка пишутся руками, плюс оптимизация до плавных 60 кадров на слабых устройствах.',

        'tin.task': 'Сайт для цеха металлообработки: лазерная резка, гибка по чертежам, отливы, доборные элементы и профили под ключ. Клиенту нужно наглядно подбирать цвет изделия по палитре RAL.',
        'tin.done': '3D-конфигуратор на Three.js: управление камерой, смена цвета металла по палитре RAL в реальном времени, генерация геометрии отливов и доборных элементов, адаптив под телефон.',
        'flowers.task': 'Магазин цветов с доставкой внутри Telegram: клиент открывает каталог одним тапом, без установки приложений и переходов на сторонние сайты.',
        'flowers.done': 'Telegram Mini App на чистом JavaScript: работает и в самом Telegram, и в обычном браузере. Корзина с промокодом, оформление доставки, честный демо-режим оплаты. За кнопку действия и кнопку «Назад» отвечает сам Telegram, корзина хранится в его облаке, тема подстраивается под клиента автоматически.',
        'pizza.task': 'Промо-лендинг пиццерии с атмосферным тёмным дизайном, интерактивным меню и UX, который хочется трогать.',
        'pizza.done': 'Верстка с нуля: фильтрация меню по категориям, анимированные карточки, выезжающая корзина, тач-свайпы. Адаптив от 320px. Без сторонних JS-библиотек.',
        'novafi.task': 'Дашборд с живыми данными: графики, таблицы, операции и модальные окна. Каркас, который одинаково подходит под панель управления, CRM и личный кабинет.',
        'novafi.done': 'SPA-навигация между разделами без перезагрузки, подтягивание данных из внешнего API, отрисовка графиков, формы с пересчётом значений на лету, модальные окна операций и тосты-уведомления. Всё на чистом JS, без React и сборщика состояний.',
        'smarty.task': 'Десктопный сортировщик файлов для Windows — с приятным интерфейсом, гибкой настройкой категорий и без единого стороннего фреймворка на фронте.',
        'smarty.done': 'Бэкенд на Python в связке с pywebview — нативное окно вместо Electron. Сортировка по категориям в один клик, полноценный undo с восстановлением структуры папок, защита от перезаписи при конфликте имён, редактируемые категории расширений, локализация на 3 языка и тёмная/светлая тема с синхронизацией с ОС.',
        'creator.task': 'Одностраничный лендинг-портфолио с тёмной и светлой темой и плавными переходами между секциями.',
        'creator.done': 'Вёрстка с нуля, переключатель тёмной/светлой темы с сохранением в localStorage, модальные окна проектов, кастомные scroll-анимации и форма с валидацией. Ноль сторонних библиотек.',

        'tin.price': '80 000 – 150 000 ₽',
        'tin.priceWhy': 'Интерактивное 3D в браузере — самая дорогая веб-разработка после игр: сцена, работа с геометрией и оптимизация под слабые телефоны. Студии берут за такой конфигуратор в разы больше.',
        'flowers.price': '30 000 – 60 000 ₽',
        'flowers.priceWhy': 'Это не сайт, а приложение: каталог, корзина, оформление, оплата и хранение состояния. Цена растёт от числа экранов и интеграции с платежами, а не от красоты картинки.',
        'pizza.price': '35 000 – 60 000 ₽',
        'pizza.priceWhy': 'Лендинг с живым интерактивом — фильтры, корзина, анимации — стоит примерно вдвое дороже статичной визитки. Основные часы уходят на адаптив и вылизывание поведения на телефоне.',
        'novafi.price': '30 000 – 90 000 ₽',
        'novafi.priceWhy': 'Дашборд — это рабочий инструмент: живые данные, графики, формы с пересчётом, модальные окна. Дороже лендинга, потому что здесь логика, а не вёрстка.',
        'smarty.price': '5 000 – 25 000 ₽',
        'smarty.priceWhy': 'Десктоп дороже веба на сборке и тестах: собрать .exe, проверить на разных версиях Windows и сделать все операции с файлами отменяемыми.',
        'creator.price': '10 000 – 35 000 ₽',
        'creator.priceWhy': 'Портфолио-лендинг — самый простой формат: одна страница и немного интерактива. Дешевле остальных кейсов ровно потому, что здесь нет серверной логики.',

        'pricing.h2': 'Сколько стоит?',
        'pricing.lead': 'Честные вилки, а не «цена по запросу». Нижняя граница — это реально маленькая задача, а не приманка.',
        'pricing.tweak.title': 'Доработка сайта',
        'pricing.tweak.price': 'от 500 ₽',
        'pricing.tweak.desc': 'Правка вёрстки, новый блок, форма, починка бага. От 500 ₽ за мелкую задачу и до 6 000 ₽, если объём побольше.',
        'pricing.speed.title': 'Ускорение сайта',
        'pricing.speed.price': 'от 1 000 ₽',
        'pricing.speed.desc': 'Разгон до 90+ в PageSpeed с отчётом «было/стало». Дизайн не трогаю. От 1 000 ₽ за одну страницу и до 9 000 ₽ за весь сайт.',
        'pricing.bot.title': 'Telegram-бот',
        'pricing.bot.price': 'от 1 000 ₽',
        'pricing.bot.desc': 'Бот из нескольких кнопок обойдётся в 1 000 ₽. С базой данных, записью клиентов, оплатой, напоминаниями и панелью управления цену считаем по задаче.',
        'pricing.landing.title': 'Лендинг',
        'pricing.landing.price': 'от 1 500 ₽',
        'pricing.landing.desc': 'Одноэкранный промо обойдётся в 1 500 ₽. Полноценный многосекционный сайт с анимациями, формой заявок и адаптивом стоит от 9 000 до 19 000 ₽.',
        'pricing.tma.title': 'Telegram Mini App',
        'pricing.tma.price': 'от 1 500 ₽',
        'pricing.tma.desc': 'Приложение внутри Telegram: каталог, запись, корзина, оплата. Базовая версия стоит 1 500 ₽, магазин с панелью управления считаем по задаче.',
        'pricing.win.title': 'Программа для Windows',
        'pricing.win.price': 'от 1 500 ₽',
        'pricing.win.desc': 'Готовый .exe под вашу задачу: обработка файлов, отчёты, автоматизация рутины. Лёгкая, без Electron.',
        'pricing.note': 'Точную цену назову после того, как вы опишете задачу. Работаю как самозанятый: чек и закрывающие документы не проблема. Можно через безопасную сделку на Kwork, тогда деньги уходят мне только после вашей приёмки.',

        'contact.h2': 'Расскажите о проекте',
        'contact.lead': 'Опишите задачу, отвечу в течение дня: обсудим сроки и стоимость.',
        'contact.or': 'или напишите напрямую',
        'contact.email': 'Почта',
        'contact.kworkNote': 'Через Kwork сделка гарантированно безопасная: деньги замораживаются биржей и уходят мне только после того, как вы примете работу.',

        'form.name': 'Как вас зовут',
        'form.namePh': 'Иван',
        'form.email': 'Почта для ответа',
        'form.emailPh': 'ivan@mail.ru',
        'form.task': 'Что нужно сделать',
        'form.message': 'Опишите задачу',
        'form.messagePh': 'Что за проект, есть ли дизайн или примеры, к какому сроку нужно.',
        'form.submit': 'Отправить заявку',
        'form.opt1': 'Лендинг или сайт',
        'form.opt2': 'Telegram-бот',
        'form.opt3': 'Telegram Mini App',
        'form.opt4': 'Доработка существующего сайта',
        'form.opt5': 'Ускорение сайта',
        'form.opt6': 'Программа для Windows',
        'form.opt7': 'Пока не знаю — нужен совет',
        'form.errName': 'Напишите, как к вам обращаться.',
        'form.errEmail': 'Проверьте почту — на неё придёт ответ.',
        'form.errMessage': 'Опишите задачу хотя бы парой предложений.',
        'form.sending': 'Отправляю...',
        'form.ok': 'Заявка ушла. Отвечу в течение дня.',
        'form.errSend': 'Не удалось отправить. Напишите в Telegram.',
        'form.errNet': 'Сеть недоступна. Напишите в Telegram или на почту.',
        'form.notWired': 'Форма ещё не подключена — напишите в Telegram или на почту.',

        'footer.copy': '© 2026, Егор. Все права защищены.',
    },

    en: {
        'meta.title': 'Egor | Portfolio',
        'meta.desc': 'Websites, dashboards and Telegram bots. Clean hand-written code, Tailwind, responsive layouts, API integrations and automation.',
        'meta.ogTitle': 'Egor — websites, bots, automation',

        'brand': 'Egor.',
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.pricing': 'Pricing',
        'nav.contact': 'Contact',
        'nav.cta': 'Start a project',
        'nav.menu': 'Open menu',

        'hero.title1': 'Websites, bots,',
        'hero.title2': 'automation.',
        'hero.lead': 'I build websites and landing pages of any complexity, Telegram bots and Telegram Mini Apps. Clean code without heavy libraries, responsive on every screen, and fast to load.',
        'hero.cta': 'View projects',

        'about.h2': "Hi! I'm Egor.",
        'about.lead': 'Fullstack developer: I take a project end to end, from markup to server. I write plain code — HTML, Tailwind CSS, JavaScript — and reach for heavy libraries only where they genuinely earn their place. Interface, logic, API integrations, deployment and support are all on me.',
        'about.compTitle': 'What I do',
        'about.frontDesc': 'Landing pages, dashboards and web apps. HTML/CSS with Tailwind, TypeScript and React for complex interfaces — and plain Vanilla JS wherever that is enough. Responsive from 320px, GSAP animation, 3D with Three.js.',
        'about.backDesc': 'Python (FastAPI) and Node.js on the server. Telegram bots and Mini Apps, databases (PostgreSQL, SQLite), scrapers, automation. Integrations with third-party APIs and payment providers.',
        'about.infraDesc': 'Git and GitHub for version control, Docker for isolated environments, GitHub Actions for CI/CD. Deployment to a Linux VPS behind Nginx, or to Vercel. From zero to a working production setup.',

        'stack.title': 'Stack',

        'projects.h2': 'Projects.',
        'projects.lead': 'Live demos — you can poke at them right here in the preview. Source is open on GitHub.',
        'projects.task': 'The brief',
        'projects.done': 'What I built',
        'projects.openFull': 'Open full screen →',
        'projects.source': 'Source code',
        'projects.openTg': 'Open in Telegram →',
        'projects.openBrowser': 'Open in browser',
        'projects.download': 'Download ↓',
        'projects.priceLabel': 'What would this cost?',

        'keyboard.task': 'A one-page showcase for a premium mechanical keyboard with real 3D in the browser, on a par with Apple product pages. The product does not physically exist, so the model, the materials and the brand style all had to be invented and built from scratch.',
        'keyboard.done': 'The keyboard is built entirely in code on React Three Fiber: seven layers, 68 keys, procedural PCB textures, not a single third-party model. The whole scene is a pure function of scroll, so it runs just as smoothly backwards as forwards. The mobile build reflows the composition for portrait and drops the load on whatever a palm-sized screen would not show anyway.',
        'keyboard.price': '$3,500 – 17,000',
        'keyboard.priceWhy': 'A procedural 3D scene driven by scroll sits at the top end of web work: geometry, materials and post-processing are all hand-written, then tuned to hold a steady 60fps on weak devices.',

        'tin.task': 'A site for a sheet-metal workshop: laser cutting, bending to drawings, drip edges, trim pieces and custom profiles. The client needed a way to preview the finish colour from the RAL palette.',
        'tin.done': 'A 3D configurator in Three.js: camera controls, real-time RAL colour changes on the metal, generated geometry for drip edges and trim pieces, and a layout that works on a phone.',
        'flowers.task': 'A flower shop with delivery that lives inside Telegram: the customer opens the catalogue in one tap, with no app to install and no jump to an external site.',
        'flowers.done': 'A Telegram Mini App in plain JavaScript that runs both inside Telegram and in a regular browser. Cart with promo codes, delivery checkout and an honest demo payment mode. Telegram itself owns the main and back buttons, the cart lives in its cloud storage, and the theme follows the client automatically.',
        'pizza.task': 'A promo landing page for a pizzeria — moody dark design, an interactive menu, and the kind of UX you want to touch.',
        'pizza.done': 'Built from scratch: menu filtering by category, animated cards, a slide-out cart and touch swipes. Responsive from 320px. No third-party JS libraries.',
        'novafi.task': 'A dashboard with live data: charts, tables, transactions and modals. A shell that works equally well as an admin panel, a CRM or a customer account area.',
        'novafi.done': 'SPA navigation between sections with no reloads, data pulled from an external API, rendered charts, forms that recalculate as you type, transaction modals and toast notifications. All in plain JS, with no React and no state library.',
        'smarty.task': 'A desktop file sorter for Windows — pleasant to use, with configurable categories and not a single third-party framework on the front end.',
        'smarty.done': 'A Python backend paired with pywebview — a native window instead of Electron. One-click sorting into categories, a real undo that restores the original folder structure, collision-safe writes, editable extension categories, three UI languages, and a dark/light theme synced with the OS.',
        'creator.task': 'A single-page portfolio landing with dark and light themes and smooth transitions between sections.',
        'creator.done': 'Built from scratch: a dark/light theme switch persisted to localStorage, project modals, custom scroll animations and a validated contact form. Zero third-party libraries.',

        'tin.price': '$3,000 – 6,500',
        'tin.priceWhy': 'Interactive 3D in the browser is the priciest web work short of games: scene code, geometry handling and performance tuning for weak phones all add up. Agencies charge several times more for the same configurator.',
        'flowers.price': '$1,200 – 3,000',
        'flowers.priceWhy': 'This is an app, not a site: catalogue, cart, checkout, payments and persisted state. The price tracks the number of screens and the payment integration, not how pretty it looks.',
        'pizza.price': '$1,000 – 2,800',
        'pizza.priceWhy': 'A landing with real interaction — filters, cart, animation — runs about double a static one-pager. Most of the hours go into responsive behaviour and polishing it on a phone.',
        'novafi.price': '$1,800 – 4,500',
        'novafi.priceWhy': 'A dashboard is a working tool: live data, charts, recalculating forms, modals. It costs more than a landing because it is logic, not markup.',
        'smarty.price': '$1,500 – 3,800',
        'smarty.priceWhy': 'Desktop costs more than web on packaging and testing: bundling the .exe, checking it across Windows versions and making every file operation undoable.',
        'creator.price': '$800 – 2,200',
        'creator.priceWhy': 'A portfolio landing is the simplest format: one page, light interaction. It is cheaper than the other cases precisely because there is no server-side logic.',

        'pricing.h2': 'Pricing',
        'pricing.lead': 'Real ranges, not "contact us for a quote". The lower bound is a genuinely small task, not bait.',
        'pricing.tweak.title': 'Website tweaks',
        'pricing.tweak.price': 'from $30',
        'pricing.tweak.desc': 'A markup fix, a new section, a form, a bug hunted down. From $30 for something small, up to $250 when the scope grows.',
        'pricing.speed.title': 'Speed optimisation',
        'pricing.speed.price': 'from $60',
        'pricing.speed.desc': 'Push PageSpeed past 90 with a before/after report. I do not touch the design. From $60 for a single page, up to $400 for a whole site.',
        'pricing.bot.title': 'Telegram bot',
        'pricing.bot.price': 'from $60',
        'pricing.bot.desc': 'A bot with a handful of buttons starts at $60. With a database, client bookings, payments, reminders and an admin panel, we scope it together.',
        'pricing.landing.title': 'Landing page',
        'pricing.landing.price': 'from $120',
        'pricing.landing.desc': 'A one-screen promo starts at $120. A full multi-section site with animation, a lead form and responsive layouts runs $400–900.',
        'pricing.tma.title': 'Telegram Mini App',
        'pricing.tma.price': 'from $120',
        'pricing.tma.desc': 'An app inside Telegram: catalogue, bookings, cart, payments. The basic version is $120; a shop with an admin panel is scoped per project.',
        'pricing.win.title': 'Windows app',
        'pricing.win.price': 'from $100',
        'pricing.win.desc': 'A ready .exe built around your task: file processing, reports, routine automation. Lightweight, no Electron.',
        'pricing.note': "I'll give you an exact quote once you describe the task. Invoices are not a problem.",

        'contact.h2': 'Tell me about your project',
        'contact.lead': 'Describe the task and I\'ll reply within a day with timeline and cost.',
        'contact.or': 'or reach out directly',
        'contact.email': 'Email',
        'contact.kworkNote': '',

        'form.name': 'Your name',
        'form.namePh': 'John',
        'form.email': 'Email for the reply',
        'form.emailPh': 'john@example.com',
        'form.task': 'What do you need',
        'form.message': 'Describe the task',
        'form.messagePh': 'What the project is, whether you have a design or references, and when you need it.',
        'form.submit': 'Send request',
        'form.opt1': 'Landing page or website',
        'form.opt2': 'Telegram bot',
        'form.opt3': 'Telegram Mini App',
        'form.opt4': 'Changes to an existing site',
        'form.opt5': 'Speed optimisation',
        'form.opt6': 'Windows app',
        'form.opt7': "Not sure yet — I need advice",
        'form.errName': 'Let me know what to call you.',
        'form.errEmail': 'Check the email — the reply goes there.',
        'form.errMessage': 'Describe the task in at least a couple of sentences.',
        'form.sending': 'Sending...',
        'form.ok': 'Request sent. I\'ll reply within a day.',
        'form.errSend': 'Could not send. Message me on Telegram.',
        'form.errNet': 'Network unavailable. Message me on Telegram or by email.',
        'form.notWired': 'The form is not wired up yet — message me on Telegram or by email.',

        'footer.copy': '© 2026, Egor. All rights reserved.',
    },
};

const STORAGE_KEY = 'lang';
const SUPPORTED = ['ru', 'en'];

// порядок важен: явный ?lang= бьёт сохранённый выбор, а тот — язык браузера
function detectLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.includes(fromUrl)) return fromUrl;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (SUPPORTED.includes(saved)) return saved;
    } catch { /* приватный режим — просто идём дальше */ }

    return navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

let current = detectLang();

export function t(key) {
    return DICT[current][key] ?? DICT.ru[key] ?? key;
}

export function getLang() {
    return current;
}

function applyTo(root) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
        el.placeholder = t(el.dataset.i18nPh);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    root.querySelectorAll('[data-i18n-content]').forEach((el) => {
        el.setAttribute('content', t(el.dataset.i18nContent));
    });

    // блоки только под один язык: Kwork и «самозанятый» англоязычному клиенту не нужны
    root.querySelectorAll('[data-lang-only]').forEach((el) => {
        el.hidden = el.dataset.langOnly !== current;
    });
}

export function apply() {
    // капсула тумблера ездит по [lang] у <html>, так что позицию менять не нужно —
    // достаточно переставить сам атрибут
    document.documentElement.lang = current;
    document.title = t('meta.title');
    applyTo(document);

    document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
        btn.setAttribute('aria-label', current === 'ru' ? 'Switch to English' : 'Переключить на русский');
    });
}

// столько же, сколько opacity-переход у .page-fade в style.css
const FADE_MS = 220;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let switching = false;

// какую секцию читатель держит в кадре. текст на двух языках разной длины,
// страница меняет высоту, и без поправки человек после проявления окажется
// не на том абзаце, где нажал кнопку
function scrollAnchor() {
    const blocks = document.querySelectorAll('main > section');
    let anchor = blocks[0] || null;
    blocks.forEach((el) => {
        // последняя секция, которая уже ушла верхним краем под шапку
        if (el.getBoundingClientRect().top <= 120) anchor = el;
    });
    return anchor;
}

export function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === current || switching) return;
    current = lang;

    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ничего страшного */ }

    // ссылку с ?lang= можно скинуть человеку и он откроет нужную версию;
    // русский оставляем без параметра, он дефолтный для канонического урла
    const url = new URL(location.href);
    if (lang === 'ru') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);

    if (prefersReducedMotion.matches) { apply(); done(); return; }

    // гасим страницу, пересобираем её на погасшем, проявляем обратно. всё, что
    // меняет положение - подмена текста, переезд капсулы, поправка прокрутки -
    // происходит внутри этого окна, пока смотреть не на что
    switching = true;
    document.documentElement.classList.add('lang-switching');

    setTimeout(() => {
        const anchor = scrollAnchor();
        const before = anchor ? anchor.getBoundingClientRect().top : 0;

        apply();

        if (anchor) {
            const shift = anchor.getBoundingClientRect().top - before;
            if (shift) window.scrollTo({ top: window.scrollY + shift, behavior: 'auto' });
        }

        done();

        // форсируем пересчёт стилей: иначе браузер склеит снятие класса с подменой
        // текста в один кадр и обратного проявления видно не будет.
        // именно синхронно, а не через rAF — в фоновой вкладке rAF не тикает вообще,
        // и класс с флагом залипли бы навсегда, убив переключатель
        void document.body.offsetHeight;
        document.documentElement.classList.remove('lang-switching');
        switching = false;
    }, FADE_MS);
}

// высота страницы уехала, точки срабатывания скролл-анимаций надо пересчитать.
// gsap живёт в main.js, поэтому просто сообщаем о смене языка наружу
function done() {
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
}

export function initLangSwitch() {
    document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
        btn.addEventListener('click', () => setLang(current === 'ru' ? 'en' : 'ru'));
    });
}
