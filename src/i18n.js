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
        'meta.title': 'Егор Белов | Портфолио',
        'meta.desc': 'Разработка сайтов, дашбордов и Telegram-ботов. Чистый код на Tailwind, адаптив, интеграции с API и автоматизация.',
        'meta.ogTitle': 'Егор Белов — сайты, боты, автоматизация',

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

        'about.h2': 'Привет! Я Егор Белов.',
        'about.lead': 'Fullstack-разработчик: закрываю проект целиком, от вёрстки до сервера. Пишу на чистом коде — HTML, Tailwind CSS, JavaScript — и подключаю тяжёлые библиотеки только там, где они реально нужны. Беру на себя весь цикл: интерфейс, логика, интеграции с API, деплой и поддержка.',
        'about.more': 'Подробнее обо мне →',
        'about.compTitle': 'Мои компетенции',
        'about.frontDesc': 'Лендинги, дашборды и веб-приложения. HTML/CSS с Tailwind, TypeScript, React для сложных интерфейсов — и чистый Vanilla JS там, где его хватает. Адаптив от 320px, анимации на GSAP, 3D на Three.js.',
        'about.backDesc': 'Python (FastAPI) и Node.js для серверной части. Telegram-боты и Mini Apps, базы данных (PostgreSQL, SQLite), парсеры, автоматизация. Интеграции с внешними API и платёжными системами.',
        'about.infraDesc': 'Git и GitHub для версионирования, Docker для изоляции окружения, GitHub Actions для CI/CD. Деплой на Linux VPS через Nginx или на Vercel. От нуля до рабочего продакшна.',

        'stack.title': 'Стек',

        'projects.h2': 'Проекты.',
        'projects.lead': 'Лучшие работы — по одной на каждое направление. Нажмите на карточку, чтобы увидеть задачу, решение и цену.',
        'projects.task': 'Задача',
        'projects.done': 'Что сделано',
        'projects.openFull': 'Открыть на весь экран →',
        'projects.source': 'Исходный код',
        'projects.openTg': 'Открыть в Telegram →',
        'projects.openBrowser': 'Открыть в браузере',
        'projects.download': 'Скачать ↓',
        'projects.priceLabel': 'Сколько стоит такой проект?',
        'projects.more': 'Подробнее:',
        'projects.archiveOpen': 'Ещё проекты',
        'projects.archiveClose': 'Свернуть',
        'projects.close': 'Закрыть',

        'meridian.task': 'Сайт уровня Awwwards для вымышленного парфюмерного дома, и ни одного файла изображений. В центре работающие солнечные часы, а гномон в них — 3D-флакон, построенный кодом. Сайт должен плавно идти на телефоне и одинаково хорошо смотреться на десктопе и на iPhone.',
        'meridian.done': 'Солнечные часы с настоящим астрономическим расчётом для пяти площадок в обоих полушариях. Флакон написан кодом: гранёное стекло, настой с колыханием, помпа, этикетка и тень от стекла. Шесть сцен срежиссированы прокруткой, пять формул переключаются с перетеканием дня, а флакон крутится пальцем, не блокируя прокрутку.',
        'meridian.price': '250 000 – 400 000 ₽',
        'meridian.priceWhy': 'Своя графика в реальном времени — верхний сегмент промо-сайтов: флакон и солнечные часы пишутся кодом вместо съёмки, плюс адаптив от телефона до 4K, доступность и запасные версии.',

        'keyboard.task': 'Сайт-презентация премиальной механической клавиатуры с настоящим 3D в браузере, на уровне продуктовых страниц Apple. Продукта физически не существует, поэтому модель, материалы и фирменный стиль нужно было придумать и собрать с нуля.',
        'keyboard.done': 'Клавиатура целиком построена кодом на React Three Fiber: семь слоёв, 68 клавиш, процедурные текстуры платы, ни одной сторонней модели. Вся сцена — чистая функция от прокрутки, поэтому идёт одинаково плавно вперёд и назад. Мобильная версия разворачивает композицию под портрет и снимает нагрузку по тому, чего на экране в ладонь всё равно не видно.',
        'keyboard.price': '150 000 – 250 000 ₽',
        'keyboard.priceWhy': 'Процедурная 3D-сцена со скролл-анимацией — верхняя планка веб-разработки: геометрия, материалы и пост-обработка пишутся руками.',

        'tin.task': 'Сайт для цеха металлообработки: лазерная резка, гибка по чертежам, отливы, доборные элементы и профили под ключ. Клиенту нужно наглядно подбирать цвет изделия по палитре RAL.',
        'tin.done': '3D-конфигуратор на Three.js: управление камерой, смена цвета металла по палитре RAL в реальном времени, генерация геометрии отливов и доборных элементов, адаптив под телефон.',
        'flowers.task': 'Магазин цветов с доставкой внутри Telegram: клиент открывает каталог одним тапом, без установки приложений и переходов на сторонние сайты.',
        'flowers.done': 'Telegram Mini App на чистом JavaScript: работает и в самом Telegram, и в обычном браузере. Корзина с промокодом, оформление доставки, честный демо-режим оплаты. За кнопку действия и кнопку «Назад» отвечает сам Telegram, корзина хранится в его облаке, тема подстраивается под клиента автоматически.',
        'pizza.task': 'Промо-лендинг пиццерии с атмосферным тёмным дизайном, интерактивным меню и UX, который хочется трогать.',
        'pizza.done': 'Верстка с нуля: фильтрация меню по категориям, анимированные карточки, выезжающая корзина, тач-свайпы. Адаптив от 320px. Без сторонних JS-библиотек.',
        'novafi.task': 'Терминал с живыми котировками: график инструмента, заявки на обмен и журнал операций. Каркас, который одинаково подходит под панель управления, CRM и личный кабинет.',
        'novafi.done': 'SPA-навигация между разделами без перезагрузки, подтягивание данных из внешнего API, отрисовка графиков, формы с пересчётом значений на лету, модальные окна операций и тосты-уведомления. Всё на чистом JS, без React и сборщика состояний.',
        'smarty.task': 'Десктопный сортировщик файлов для Windows — с приятным интерфейсом, гибкой настройкой категорий и без единого стороннего фреймворка на фронте.',
        'smarty.done': 'Бэкенд на Python в связке с pywebview — нативное окно вместо Electron. Сортировка по категориям в один клик, полноценный undo с восстановлением структуры папок, защита от перезаписи при конфликте имён, редактируемые категории расширений, локализация на 3 языка и тёмная/светлая тема с синхронизацией с ОС.',
        'creator.task': 'Одностраничный лендинг-портфолио с тёмной и светлой темой и плавными переходами между секциями.',
        'creator.done': 'Вёрстка с нуля, переключатель тёмной/светлой темы с сохранением в localStorage, модальные окна проектов, кастомные scroll-анимации и форма с валидацией. Ноль сторонних библиотек.',

        'tin.price': '80 000 – 150 000 ₽',
        'tin.priceWhy': 'Интерактивное 3D в браузере — самая дорогая веб-разработка после игр: сцена, работа с геометрией и оптимизация под слабые телефоны. Студии берут за такой конфигуратор в разы больше.',
        'flowers.price': '60 000 – 100 000 ₽',
        'flowers.priceWhy': 'Это не сайт, а приложение: каталог, корзина, оформление, оплата и хранение состояния. Цена растёт от числа экранов и интеграции с платежами, а не от красоты картинки.',
        'pizza.price': '40 000 – 70 000 ₽',
        'pizza.priceWhy': 'Лендинг с живым интерактивом — фильтры, корзина, анимации — стоит примерно вдвое дороже статичной визитки. Основные часы уходят на адаптив и вылизывание поведения на телефоне.',
        'novafi.price': '40 000 – 90 000 ₽',
        'novafi.priceWhy': 'Терминал — это рабочий инструмент: живые данные, графики, формы с пересчётом, модальные окна. Дороже лендинга, потому что здесь логика, а не вёрстка.',
        'smarty.price': '10 000 – 25 000 ₽',
        'smarty.priceWhy': 'Десктоп дороже веба на сборке и тестах: собрать .exe, проверить на разных версиях Windows и сделать все операции с файлами отменяемыми.',
        'creator.price': '25 000 – 40 000 ₽',
        'creator.priceWhy': 'Портфолио-лендинг — самый простой формат: одна страница и немного интерактива. Дешевле остальных сайтов ровно потому, что здесь нет серверной логики.',

        'meridian.kind': '3D-сайт',
        'meridian.short': 'Парфюмерный дом с работающими солнечными часами и флаконом, написанным кодом.',
        'keyboard.kind': '3D-презентация',
        'keyboard.short': 'Клавиатура, которую прокрутка разбирает на слои и собирает обратно.',
        'tin.kind': '3D-конфигуратор',
        'tin.short': 'Цех металлообработки: изделие крутится в 3D и красится по палитре RAL.',
        'flowers.kind': 'Telegram Mini App',
        'flowers.short': 'Цветочный магазин с корзиной и доставкой прямо внутри Telegram.',
        'nocturne.kind': 'Многостраничный сайт',
        'nocturne.short': 'Фотостудия: галерея во весь экран со слайдером и фильтром.',
        'beton.kind': 'Многостраничный сайт',
        'beton.short': 'Архитектурное бюро в брутализме: огромные заголовки и чертёжные линии.',
        'novafi.kind': 'Веб-приложение',
        'novafi.short': 'Терминал с живыми котировками, графиком и журналом операций.',
        'pizza.kind': 'Лендинг',
        'pizza.short': 'Пиццерия: меню с фильтрами, выезжающая корзина и тач-свайпы.',
        'smarty.kind': 'Программа для Windows',
        'smarty.short': 'Раскладывает файлы по папкам в один клик и умеет всё отменить.',
        'creator.kind': 'Лендинг',
        'creator.short': 'Портфолио с тёмной и светлой темой.',

        'nocturne.task': 'Сайт фотостудии по готовому макету: тёмный минимализм, три страницы и галерея во весь экран. Всё на чистом HTML, CSS и JavaScript, без библиотек.',
        'nocturne.done': 'Три адаптивные страницы от 1440 до 320 px, сетка пересобирается на каждом брейкпоинте. Слайдер галереи написан с нуля: стрелки, клавиатура, свайпы и полоса миниатюр. Фильтр категорий управляет слайдером и masonry-сеткой одновременно. Форма записи проверяет поля до отправки.',
        'nocturne.price': '30 000 – 45 000 ₽',
        'nocturne.priceWhy': 'Вёрстка по готовому макету: дизайна и сервера здесь нет, зато слайдер и фильтр написаны руками, а не взяты из библиотеки.',
        'beton.task': 'Сайт архитектурного бюро, который сразу считывается как «бюро с характером», а не шаблон: брутализм, огромные заголовки, жирные линии вместо теней и ощущение чертежа.',
        'beton.done': 'Четыре страницы по макету на сложной 12-колоночной сетке: главная, проекты с фильтром и разворотом объекта, о бюро, контакты. Блоки собраны в систему и переиспользуются. Адаптив от 320 px, GSAP-анимации: заголовки собираются построчно, цифры считаются, бегущая строка подстраивается под ширину экрана.',
        'beton.price': '40 000 – 60 000 ₽',
        'beton.priceWhy': 'Четыре страницы со сложной сеткой и анимациями плюс подготовка фотографий под веб. Дороже одностраничника, потому что каждая страница собрана из своих блоков.',
        'dental.kind': 'Лендинг',
        'dental.short': 'Стоматология: запись на приём, понятный прайс и спокойный тон вместо медицинского холода.',
        'dental.task': 'Сайт стоматологии, который снимает тревогу перед визитом и ведёт к записи на приём. Аудитория — жители района 25–55 лет, которым важны прозрачные цены и спокойная атмосфера.',
        'dental.done': 'Лендинг из десяти блоков по макету: адаптив под телефон и планшет, окно записи, маска телефона и проверка форм, подсветка раздела в меню. Картинки переведены в WebP и стали легче на 83%, а тяжёлая карта грузится только по нажатию.',
        'dental.price': '35 000 – 50 000 ₽',
        'dental.priceWhy': 'Вёрстка по готовому макету с формами и записью. Отправка заявок в почту, CRM или Telegram считается отдельно.',

        'pricing.h2': 'Сколько стоит?',
        'pricing.lead': 'Честные вилки, а не «цена по запросу». Нижняя граница — это реально маленькая задача, а не приманка.',
        'pricing.tweak.title': 'Доработка сайта',
        'pricing.tweak.price': 'от 2 000 ₽',
        'pricing.tweak.desc': 'Поправить вёрстку, добавить блок или форму, найти и починить баг. Задачи крупнее считаю по часам, 1 500 ₽ в час, и называю оценку до начала работы.',
        'pricing.speed.title': 'Ускорение сайта',
        'pricing.speed.price': 'от 6 000 ₽',
        'pricing.speed.desc': 'Довожу страницу до 90+ в PageSpeed и показываю отчёт «было/стало». Дизайн не трогаю. Цена указана за одну страницу, весь сайт обычно стоит 15–40 тыс. ₽.',
        'pricing.bot.title': 'Telegram-бот',
        'pricing.bot.price': 'от 12 000 ₽',
        'pricing.bot.desc': 'Меню, заявки и уведомления вам в чат. Если нужны база данных, запись клиентов, оплата или админка, бот обойдётся в 30–80 тыс. ₽.',
        'pricing.landing.title': 'Лендинг',
        'pricing.landing.price': 'от 25 000 ₽',
        'pricing.landing.desc': 'Одностраничный сайт на 5–7 блоков: адаптив, форма заявки и публикация на хостинге. С интерактивом и анимациями, как Pizza Landing, стоит 40–80 тыс. ₽.',
        'pricing.tma.title': 'Telegram Mini App',
        'pricing.tma.price': 'от 30 000 ₽',
        'pricing.tma.desc': 'Простое приложение на 1–2 экрана: витрина, форма записи или калькулятор с отправкой заявки в чат. Магазин с корзиной и оплатой, как Flowers Room, стоит 60–100 тыс. ₽.',
        'pricing.win.title': 'Программа для Windows',
        'pricing.win.price': 'от 8 000 ₽',
        'pricing.win.desc': 'Готовый .exe под вашу задачу: обработка файлов, отчёты, автоматизация рутины. Лёгкая, без Electron. Утилита уровня SmartySorter стоит 10–25 тыс. ₽.',
        'pricing.td.title': '3D и WebGL',
        'pricing.td.price': 'от 80 000 ₽',
        'pricing.td.desc': 'Сайты с 3D в реальном времени: конфигуратор товара, сцена на прокрутке, предмет, который можно покрутить пальцем. Конфигуратор вроде Tin Master 3D стоит 80–150 тыс. ₽, промо уровня Meridian Noir — 250–400 тыс. ₽.',
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

        'form.opt8': '3D-сайт или WebGL',
        'form.opt7': 'Пока не знаю — нужен совет',
        'form.errName': 'Напишите, как к вам обращаться.',
        'form.errEmail': 'Проверьте почту — на неё придёт ответ.',
        'form.errMessage': 'Опишите задачу хотя бы парой предложений.',
        'form.sending': 'Отправляю...',
        'form.ok': 'Заявка ушла. Отвечу в течение дня.',
        'form.errSend': 'Не удалось отправить. Напишите в Telegram.',
        'form.errNet': 'Сеть недоступна. Напишите в Telegram или на почту.',
        'form.notWired': 'Форма ещё не подключена — напишите в Telegram или на почту.',

        'footer.copy': '© 2026, Егор Белов. Все права защищены.',
        'footer.privacy': 'Политика конфиденциальности',
        'footer.consent': 'Согласие на обработку данных',
        'footer.cookies': 'Настройки куки',
        'cookie.text': 'Сайт использует куки и Яндекс.Метрику, чтобы считать посещения. Метрика включится, только если вы согласитесь.',
        'cookie.more': 'Подробнее',
        'cookie.accept': 'Принять',
        'cookie.decline': 'Отклонить',
        'form.agree': 'Даю',
        'form.agreeLink': 'согласие на обработку персональных данных',
        'form.errConsent': 'Отметьте согласие на обработку данных: без него я не могу принять заявку.',
        'pv.title': 'Политика конфиденциальности — Егор Белов',
        'pv.desc': 'Как сайт egordev.com обрабатывает персональные данные: форма заявки, куки и Яндекс.Метрика.',
        'cs.title': 'Согласие на обработку персональных данных — Егор Белов',
        'cs.desc': 'Текст согласия на обработку персональных данных при отправке заявки на egordev.com.',

        // страница "обо мне" (about/index.html)
        'ab.title': 'Егор Белов — обо мне',
        'ab.desc': 'Егор Белов, fullstack-разработчик из Белгорода: как я пришёл в разработку, как работаю и как отношусь к нейросетям.',
        'ab.back': '← На главную',
        'ab.eyebrow': 'Обо мне',
        'ab.name': 'Егор Белов',
        'ab.lead': 'Fullstack-разработчик из Белгорода. Делаю чистые и быстрые сайты, Telegram-ботов и 3D в браузере.',
        'ab.storyH': 'Как я пришёл в разработку',
        'ab.story1': 'Начинал с C#, потому что хотел делать игры на Unity. Игры не сложились, а язык остался. От C# до Java недалеко, и на Java я написал плагины для своего сервера в Minecraft и какое-то время его поддерживал. Сейчас сервер готовится ко второму сезону.',
        'ab.story2': 'На плагинах я понял, что мне нравится делать вещи своими руками. Тогда я присмотрелся к сайтам вокруг. Большинство были перегружены текстом и баннерами, глаз уставал уже через минуту. Меня зацепил минимализм Apple: много воздуха и ничего лишнего. Захотел делать так же и перешёл на HTML, CSS и JavaScript.',
        'ab.story3': 'Нигде не учился, всё осваивал сам. Программирую около полутора лет.',
        'ab.honestH': 'Честно о себе',
        'ab.honest': 'Я в коммерческой разработке недавно, и отзывов от заказчиков у меня пока нет. Поэтому каждый проект для меня — лицо портфолио. Я делаю его так, чтобы следующему клиенту было что показать.',
        'ab.diffH': 'Чем я отличаюсь',
        'ab.diff1t': 'Свой стиль',
        'ab.diff1': 'Чистые страницы без перегруза: много воздуха и ничего, что отвлекает от главного.',
        'ab.diff2t': 'Ничего не скрываю',
        'ab.diff2': 'Цены опубликованы и объяснены. Исходный код каждого кейса лежит на GitHub: можно посмотреть, как всё устроено внутри.',
        'ab.diff3t': 'Весь проект в одних руках',
        'ab.diff3': 'Вёрстка, сервер, Telegram-боты и 3D в браузере. Не нужно искать трёх разных исполнителей.',
        'ab.diff4t': 'Понятные условия',
        'ab.diff4': 'Цена разбита по этапам, предоплата 50%, после сдачи месяц бесплатных правок.',
        'ab.processH': 'Как я работаю',
        'ab.step1t': 'Знакомимся',
        'ab.step1': 'Расспрашиваю о задаче, сроках и примерах, которые вам нравятся.',
        'ab.step2t': 'План и смета',
        'ab.step2': 'Расписываю работу по этапам, у каждого своя цена. Начинаем, когда всё согласовано.',
        'ab.step3t': 'Предоплата 50%',
        'ab.step3': 'Остальное — после сдачи.',
        'ab.step4t': 'Показываю по ходу',
        'ab.step4': 'Вы видите промежуточный результат и можете поменять направление, пока работа не закончена.',
        'ab.step5t': 'Сдача и месяц поддержки',
        'ab.step5': 'Месяц правок бесплатно и помощь, если что-то пойдёт не так.',
        'ab.hours': 'На связи с 9:00 до 22:00 по Москве, отвечаю как можно быстрее.',
        'ab.aiH': 'Моё отношение к нейросетям',
        'ab.ai1': 'Отношусь хорошо. Нейросеть — это инструмент, как молоток. Гвоздь можно забить и рукой, но молотком быстрее, если умеешь им пользоваться и не бьёшь себя по пальцам.',
        'ab.ai2': 'Пользуюсь ли я нейросетями? Да, но с головой. Они ускоряют рутину, а решения и качество остаются на мне: я знаю, что делаю, и отвечаю за каждую строчку в проекте.',
        'ab.musicH': 'Музыка',
        'ab.music': 'Кроме кода, пишу биты. Все они авторские, выкладываю их в свой канал.',
        'ab.findH': 'Где ещё меня найти',
        'ab.tg': 'Для связи.',
        'ab.dev': 'Канал про разработку: работы изнутри и мысли о них.',
        'ab.yt': 'Летсплеи с друзьями и всё, что для души.',
        'ab.tt': 'Тоже для души. К работе не относится, но это тоже я.',
        'ab.ctaH': 'Есть задача?',
        'ab.ctaLead': 'Напишите в Telegram или оставьте заявку, отвечу в течение дня.',
        'ab.ctaForm': 'Оставить заявку',
    },

    en: {
        'meta.title': 'Egor Belov | Portfolio',
        'meta.desc': 'Websites, dashboards and Telegram bots. Clean hand-written code, Tailwind, responsive layouts, API integrations and automation.',
        'meta.ogTitle': 'Egor Belov — websites, bots, automation',

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

        'about.h2': "Hi! I'm Egor Belov.",
        'about.lead': 'Fullstack developer: I take a project end to end, from markup to server. I write plain code — HTML, Tailwind CSS, JavaScript — and reach for heavy libraries only where they genuinely earn their place. Interface, logic, API integrations, deployment and support are all on me.',
        'about.more': 'More about me →',
        'about.compTitle': 'What I do',
        'about.frontDesc': 'Landing pages, dashboards and web apps. HTML/CSS with Tailwind, TypeScript and React for complex interfaces — and plain Vanilla JS wherever that is enough. Responsive from 320px, GSAP animation, 3D with Three.js.',
        'about.backDesc': 'Python (FastAPI) and Node.js on the server. Telegram bots and Mini Apps, databases (PostgreSQL, SQLite), scrapers, automation. Integrations with third-party APIs and payment providers.',
        'about.infraDesc': 'Git and GitHub for version control, Docker for isolated environments, GitHub Actions for CI/CD. Deployment to a Linux VPS behind Nginx, or to Vercel. From zero to a working production setup.',

        'stack.title': 'Stack',

        'projects.h2': 'Projects.',
        'projects.lead': 'My best work — one for each kind of project. Click a card to see the brief, the solution and the price.',
        'projects.task': 'The brief',
        'projects.done': 'What I built',
        'projects.openFull': 'Open full screen →',
        'projects.source': 'Source code',
        'projects.openTg': 'Open in Telegram →',
        'projects.openBrowser': 'Open in browser',
        'projects.download': 'Download ↓',
        'projects.priceLabel': 'What would a project like this cost?',
        'projects.more': 'Details:',
        'projects.archiveOpen': 'More projects',
        'projects.archiveClose': 'Show less',
        'projects.close': 'Close',

        'meridian.task': 'An Awwwards-level site for a fictional perfume house, without a single image file. At its centre is a working sundial whose gnomon is a 3D bottle built in code. It had to run smoothly on a phone and look just as good on a desktop as on an iPhone.',
        'meridian.done': 'A sundial driven by real astronomical calculation for five locations across both hemispheres. The bottle is written in code: faceted glass, a gently moving liquid, pump, label and a shadow cast by the glass. Six scroll-directed scenes, five formulas that switch as the daylight flows between them, and a bottle you can spin with a finger without blocking the scroll.',
        'meridian.price': '$7,500 – 12,000',
        'meridian.priceWhy': 'Real-time custom graphics sit at the top of promo-site work: the bottle and the sundial are written in code instead of being shot on camera, with layouts from phone to 4K, accessibility and fallback versions.',

        'keyboard.task': 'A one-page showcase for a premium mechanical keyboard with real 3D in the browser, on a par with Apple product pages. The product does not physically exist, so the model, the materials and the brand style all had to be invented and built from scratch.',
        'keyboard.done': 'The keyboard is built entirely in code on React Three Fiber: seven layers, 68 keys, procedural PCB textures, not a single third-party model. The whole scene is a pure function of scroll, so it runs just as smoothly backwards as forwards. The mobile build reflows the composition for portrait and drops the load on whatever a palm-sized screen would not show anyway.',
        'keyboard.price': '$4,500 – 7,500',
        'keyboard.priceWhy': 'A procedural 3D scene driven by scroll sits at the top end of web work: geometry, materials and post-processing are all hand-written.',

        'tin.task': 'A site for a sheet-metal workshop: laser cutting, bending to drawings, drip edges, trim pieces and custom profiles. The client needed a way to preview the finish colour from the RAL palette.',
        'tin.done': 'A 3D configurator in Three.js: camera controls, real-time RAL colour changes on the metal, generated geometry for drip edges and trim pieces, and a layout that works on a phone.',
        'flowers.task': 'A flower shop with delivery that lives inside Telegram: the customer opens the catalogue in one tap, with no app to install and no jump to an external site.',
        'flowers.done': 'A Telegram Mini App in plain JavaScript that runs both inside Telegram and in a regular browser. Cart with promo codes, delivery checkout and an honest demo payment mode. Telegram itself owns the main and back buttons, the cart lives in its cloud storage, and the theme follows the client automatically.',
        'pizza.task': 'A promo landing page for a pizzeria — moody dark design, an interactive menu, and the kind of UX you want to touch.',
        'pizza.done': 'Built from scratch: menu filtering by category, animated cards, a slide-out cart and touch swipes. Responsive from 320px. No third-party JS libraries.',
        'novafi.task': 'A terminal with live quotes: an instrument chart, swap tickets and an operations log. A shell that works equally well as an admin panel, a CRM or a customer account area.',
        'novafi.done': 'SPA navigation between sections with no reloads, data pulled from an external API, rendered charts, forms that recalculate as you type, transaction modals and toast notifications. All in plain JS, with no React and no state library.',
        'smarty.task': 'A desktop file sorter for Windows — pleasant to use, with configurable categories and not a single third-party framework on the front end.',
        'smarty.done': 'A Python backend paired with pywebview — a native window instead of Electron. One-click sorting into categories, a real undo that restores the original folder structure, collision-safe writes, editable extension categories, three UI languages, and a dark/light theme synced with the OS.',
        'creator.task': 'A single-page portfolio landing with dark and light themes and smooth transitions between sections.',
        'creator.done': 'Built from scratch: a dark/light theme switch persisted to localStorage, project modals, custom scroll animations and a validated contact form. Zero third-party libraries.',

        'tin.price': '$2,400 – 4,500',
        'tin.priceWhy': 'Interactive 3D in the browser is the priciest web work short of games: scene code, geometry handling and performance tuning for weak phones all add up. Agencies charge several times more for the same configurator.',
        'flowers.price': '$1,800 – 3,000',
        'flowers.priceWhy': 'This is an app, not a site: catalogue, cart, checkout, payments and persisted state. The price tracks the number of screens and the payment integration, not how pretty it looks.',
        'pizza.price': '$1,200 – 2,100',
        'pizza.priceWhy': 'A landing with real interaction — filters, cart, animation — runs about double a static one-pager. Most of the hours go into responsive behaviour and polishing it on a phone.',
        'novafi.price': '$1,200 – 2,700',
        'novafi.priceWhy': 'A terminal is a working tool: live data, charts, recalculating forms, modals. It costs more than a landing because it is logic, not markup.',
        'smarty.price': '$300 – 750',
        'smarty.priceWhy': 'Desktop costs more than web on packaging and testing: bundling the .exe, checking it across Windows versions and making every file operation undoable.',
        'creator.price': '$750 – 1,200',
        'creator.priceWhy': 'A portfolio landing is the simplest format: one page, light interaction. It is cheaper than the other sites precisely because there is no server-side logic.',

        'meridian.kind': '3D website',
        'meridian.short': 'A perfume house with a working sundial and a bottle written in code.',
        'keyboard.kind': '3D product page',
        'keyboard.short': 'A keyboard that scrolling takes apart layer by layer and puts back together.',
        'tin.kind': '3D configurator',
        'tin.short': 'A metal workshop where the product spins in 3D and takes any RAL colour.',
        'flowers.kind': 'Telegram Mini App',
        'flowers.short': 'A flower shop with a cart and delivery that lives inside Telegram.',
        'nocturne.kind': 'Multi-page website',
        'nocturne.short': 'A photo studio: a full-screen gallery with a slider and filters.',
        'beton.kind': 'Multi-page website',
        'beton.short': 'A brutalist architecture firm: huge type and drafting lines.',
        'novafi.kind': 'Web app',
        'novafi.short': 'A terminal with live quotes, a chart and an operations log.',
        'pizza.kind': 'Landing page',
        'pizza.short': 'A pizzeria: filterable menu, slide-out cart and touch swipes.',
        'smarty.kind': 'Windows app',
        'smarty.short': 'Sorts files into folders in one click and can undo all of it.',
        'creator.kind': 'Landing page',
        'creator.short': 'A portfolio with dark and light themes.',

        'nocturne.task': 'A photo studio website built from a finished mockup: dark minimalism, three pages and a full-screen gallery. Plain HTML, CSS and JavaScript, no libraries.',
        'nocturne.done': 'Three responsive pages from 1440 down to 320px, with the grid rebuilt at every breakpoint. The gallery slider is written from scratch: arrows, keyboard, swipes and a thumbnail strip. One category filter drives both the slider and the masonry grid. The booking form checks its fields before sending.',
        'nocturne.price': '$900 – 1,400',
        'nocturne.priceWhy': 'Front-end work from a finished mockup: no design and no server here, but the slider and the filter are hand-written rather than pulled from a library.',
        'beton.task': 'A website for an architecture firm that reads as a firm with character rather than a template: brutalism, huge headlines, heavy rules instead of shadows and the feel of a technical drawing.',
        'beton.done': 'Four pages from the mockup on a complex 12-column grid: home, projects with a filter and a project spread, about, contacts. Blocks form a reusable system. Responsive from 320px, GSAP animation: headlines assemble line by line, numbers count up, the ticker adapts to the screen width.',
        'beton.price': '$1,200 – 1,800',
        'beton.priceWhy': 'Four pages with a complex grid and animation, plus preparing the photos for the web. It costs more than a one-pager because every page is built from its own blocks.',
        'dental.kind': 'Landing page',
        'dental.short': 'A dental clinic: booking, a clear price list and a calm tone instead of clinical chill.',
        'dental.task': 'A dental clinic website that eases anxiety before a visit and leads to booking an appointment. The audience is local residents aged 25–55 who care about transparent prices and a calm atmosphere.',
        'dental.done': 'A ten-section landing page built from the mockup: phone and tablet layouts, a booking modal, a phone mask and form validation, active-section highlighting in the menu. Images were converted to WebP and got 83% lighter, and the heavy map only loads on tap.',
        'dental.price': '$1,100 – 1,500',
        'dental.priceWhy': 'Front-end work from a finished mockup, with forms and booking. Sending requests to email, a CRM or Telegram is priced separately.',

        'pricing.h2': 'Pricing',
        'pricing.lead': 'Real ranges, not "contact us for a quote". The lower bound is a genuinely small task, not bait.',
        'pricing.tweak.title': 'Website tweaks',
        'pricing.tweak.price': 'from $60',
        'pricing.tweak.desc': 'A layout fix, a new section or form, a bug hunted down. Bigger jobs are billed hourly at $45, and you get an estimate before I start.',
        'pricing.speed.title': 'Speed optimisation',
        'pricing.speed.price': 'from $200',
        'pricing.speed.desc': 'I take a page past 90 in PageSpeed and show a before/after report. The design stays untouched. The price is per page; a whole site usually runs $450–1,200.',
        'pricing.bot.title': 'Telegram bot',
        'pricing.bot.price': 'from $350',
        'pricing.bot.desc': 'Menus, lead capture and notifications to your chat. With a database, client bookings, payments or an admin panel, a bot runs $900–2,400.',
        'pricing.landing.title': 'Landing page',
        'pricing.landing.price': 'from $750',
        'pricing.landing.desc': 'A one-page site with 5–7 sections: responsive layout, a lead form and hosting set up. With interaction and animation, like Pizza Landing, it runs $1,200–2,400.',
        'pricing.tma.title': 'Telegram Mini App',
        'pricing.tma.price': 'from $900',
        'pricing.tma.desc': 'A simple app with 1–2 screens: a showcase, a booking form or a calculator that sends the request to your chat. A shop with a cart and payments, like Flowers Room, runs $1,800–3,000.',
        'pricing.win.title': 'Windows app',
        'pricing.win.price': 'from $250',
        'pricing.win.desc': 'A ready .exe built around your task: file processing, reports, routine automation. Lightweight, no Electron. A utility like SmartySorter runs $300–750.',
        'pricing.td.title': '3D & WebGL',
        'pricing.td.price': 'from $2,400',
        'pricing.td.desc': 'Sites with real-time 3D: a product configurator, a scroll-driven scene, an object you can spin with a finger. A configurator like Tin Master 3D runs $2,400–4,500; a promo on the level of Meridian Noir, $7,500–12,000.',
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

        'form.opt8': '3D website or WebGL',
        'form.opt7': "Not sure yet — I need advice",
        'form.errName': 'Let me know what to call you.',
        'form.errEmail': 'Check the email — the reply goes there.',
        'form.errMessage': 'Describe the task in at least a couple of sentences.',
        'form.sending': 'Sending...',
        'form.ok': 'Request sent. I\'ll reply within a day.',
        'form.errSend': 'Could not send. Message me on Telegram.',
        'form.errNet': 'Network unavailable. Message me on Telegram or by email.',
        'form.notWired': 'The form is not wired up yet — message me on Telegram or by email.',

        'footer.copy': '© 2026, Egor Belov. All rights reserved.',
        'footer.privacy': 'Privacy policy',
        'footer.consent': 'Consent to data processing',
        'footer.cookies': 'Cookie settings',
        'cookie.text': 'This site uses cookies and Yandex Metrica to count visits. Metrica only starts if you agree.',
        'cookie.more': 'Learn more',
        'cookie.accept': 'Accept',
        'cookie.decline': 'Decline',
        'form.agree': 'I give my',
        'form.agreeLink': 'consent to the processing of my personal data',
        'form.errConsent': 'Please tick the consent box: without it I cannot accept your request.',
        'pv.title': 'Privacy policy — Egor Belov',
        'pv.desc': 'How egordev.com processes personal data: the request form, cookies and Yandex Metrica.',
        'cs.title': 'Consent to personal data processing — Egor Belov',
        'cs.desc': 'The consent text for personal data processing when sending a request on egordev.com.',

        // about page (about/index.html)
        'ab.title': 'Egor Belov — about me',
        'ab.desc': 'Egor Belov, fullstack developer from Belgorod: how I got into development, how I work and how I use AI.',
        'ab.back': '← Back to home',
        'ab.eyebrow': 'About me',
        'ab.name': 'Egor Belov',
        'ab.lead': 'Fullstack developer from Belgorod. I build clean, fast websites, Telegram bots and 3D in the browser.',
        'ab.storyH': 'How I got into development',
        'ab.story1': 'I started with C# because I wanted to make games in Unity. The games never happened, but the language stuck. C# is close to Java, so I wrote Java plugins for my own Minecraft server and ran it for a while. Right now the server is getting ready for its second season.',
        'ab.story2': 'Working on those plugins, I realised I love building things with my own hands. Then I took a closer look at the websites around me. Most were cluttered with text and banners, and my eyes got tired within a minute. Apple-style minimalism hooked me: plenty of air and nothing extra. I wanted to build pages like that, so I moved to HTML, CSS and JavaScript.',
        'ab.story3': 'I am self-taught, with no formal training. I have been programming for about a year and a half.',
        'ab.honestH': 'Being honest',
        'ab.honest': 'I am new to commercial work, and I have no client reviews yet. That is why every project is the face of my portfolio for me. I build it so the next client has something to look at.',
        'ab.diffH': 'What sets me apart',
        'ab.diff1t': 'My own style',
        'ab.diff1': 'Clean pages with no clutter: plenty of air and nothing that distracts from the point.',
        'ab.diff2t': 'Nothing hidden',
        'ab.diff2': 'Prices are published and explained. The source code of every case is on GitHub, so you can see how everything works inside.',
        'ab.diff3t': 'The whole project in one pair of hands',
        'ab.diff3': 'Front-end, server, Telegram bots and 3D in the browser. No need to hire three different people.',
        'ab.diff4t': 'Clear terms',
        'ab.diff4': 'The price is split into stages, 50% upfront, and a month of free revisions after delivery.',
        'ab.processH': 'How I work',
        'ab.step1t': 'We get acquainted',
        'ab.step1': 'I ask about the task, the deadline and examples you like.',
        'ab.step2t': 'Plan and estimate',
        'ab.step2': 'I break the work into stages, each with its own price. We start once everything is agreed.',
        'ab.step3t': '50% upfront',
        'ab.step3': 'The rest after delivery.',
        'ab.step4t': 'Progress you can see',
        'ab.step4': 'You see work in progress and can change direction before it is finished.',
        'ab.step5t': 'Delivery and a month of support',
        'ab.step5': 'A month of free revisions and help if anything goes wrong.',
        'ab.hours': 'Available 9:00–22:00 Moscow time (UTC+3), and I reply as fast as I can.',
        'ab.aiH': 'How I use AI',
        'ab.ai1': "I like it. AI is a tool, like a hammer. You can drive a nail by hand, but a hammer is faster, as long as you know how to use it and don't hit your fingers.",
        'ab.ai2': 'Do I use AI? Yes, but with my head on. It speeds up the routine, while the decisions and the quality stay with me: I know what I am doing, and I answer for every line in the project.',
        'ab.musicH': 'Music',
        'ab.music': 'Besides code, I make beats. All of them are my own, and I post them on my channel.',
        'ab.findH': 'Where else to find me',
        'ab.tg': 'For getting in touch.',
        'ab.dev': 'A channel about development: my work from the inside and my thoughts on it. In Russian.',
        'ab.yt': "Let's plays with friends and other things just for fun.",
        'ab.tt': 'Also just for fun. Not about work, but still me.',
        'ab.ctaH': 'Got a task?',
        'ab.ctaLead': 'Message me on Telegram or leave a request, and I will reply within a day.',
        'ab.ctaForm': 'Leave a request',
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

export function applyTo(root) {
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
    document.title = t(document.documentElement.dataset.titleKey || 'meta.title');
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
