export const CATEGORIES = [
    { id: 'roses', label: 'Розы' },
    { id: 'peonies', label: 'Пионы' },
    { id: 'mix', label: 'Сборные' },
    { id: 'box', label: 'В коробке' },
    { id: 'dried', label: 'Сухоцветы' },
    { id: 'addons', label: 'Дополнения' },
];

export const money = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

// img — имя файла без расширения из assets/bouquets/, расширение держим
// в одном месте — см. imgSrc() ниже
export const PRODUCTS = [
    {
        id: 'roses-red-25', category: 'roses', img: 'bouquet_roses_red_25',
        name: 'Розы Ред Наоми, красные',
        composition: [
            ['Роза Ред Наоми', '25 шт'],
            ['Зелень стандарт', '3 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [
            { label: '15 роз', qty: '15 шт', price: 4200 },
            { label: '25 роз', qty: '25 шт', price: 5700 },
            { label: '51 роза', qty: '51 шт', price: 10900 },
        ],
    },
    {
        id: 'roses-pink-51', category: 'roses', img: 'bouquet_roses_pink_51', badge: 'хит',
        name: 'Розы Пинк Флойд, розовые',
        composition: [
            ['Роза Пинк Флойд', '51 шт'],
            ['Зелень стандарт', '5 веток'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [
            { label: '25 роз', qty: '25 шт', price: 6900 },
            { label: '51 роза', qty: '51 шт', price: 9900 },
            { label: '101 роза', qty: '101 шт', price: 17900 },
        ],
    },
    {
        id: 'roses-white-15', category: 'roses', img: 'bouquet_roses_white_15',
        name: 'Розы Аваланч, белые',
        composition: [
            ['Роза Аваланч', '15 шт'],
            ['Зелень стандарт', '2 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [
            { label: '9 роз', qty: '9 шт', price: 3200 },
            { label: '15 роз', qty: '15 шт', price: 4200 },
            { label: '25 роз', qty: '25 шт', price: 6900 },
        ],
    },
    {
        id: 'peonies-julietta', category: 'peonies', img: 'bouquet_peonies_pink', badge: 'хит',
        name: 'Пионовидные розы «Джульетта»',
        desc: 'Кремово-персиковые садовые розы с эвкалиптом. Собираем утром в день доставки, держат форму 6–8 дней.',
        composition: [
            ['Роза пионовидная «Джульетта»', '25 шт'],
            ['Эвкалипт цинерея', '3 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [
            { label: '15 роз', qty: '15 шт', price: 4900 },
            { label: '25 роз', qty: '25 шт', price: 6400, tag: 'часто берут' },
            { label: '51 роза', qty: '51 шт', price: 12900 },
        ],
    },
    {
        id: 'peonies-sarah-bernard', category: 'peonies', img: 'bouquet_peonies_coral',
        name: 'Пионы «Сара Бернар»',
        composition: [
            ['Пион «Сара Бернар»', '15 шт'],
            ['Зелень стандарт', '2 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [
            { label: '9 пионов', qty: '9 шт', price: 5900 },
            { label: '15 пионов', qty: '15 шт', price: 8900 },
            { label: '25 пионов', qty: '25 шт', price: 14900 },
        ],
    },
    {
        id: 'mix-provence', category: 'mix', img: 'bouquet_mix_pastel', badge: 'хит',
        name: 'Сборный букет «Утро в Провансе»',
        desc: 'Кремовые розы, эустома, альстромерия и гипсофила с эвкалиптом — мягкая пастельная гамма.',
        composition: [
            ['Роза кремовая', '7 шт'],
            ['Эустома, альстромерия', '5 шт'],
            ['Гипсофила, эвкалипт', '2 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 4900 }],
    },
    {
        id: 'mix-summer-noon', category: 'mix', img: 'bouquet_mix_bright',
        name: 'Сборный букет «Летний полдень»',
        desc: 'Гербера, хризантема и альстромерия в тёплой яркой гамме с зеленью эвкалипта.',
        composition: [
            ['Гербера, хризантема', '9 шт'],
            ['Альстромерия', '5 шт'],
            ['Зелень эвкалипта', '2 ветки'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 5200 }],
    },
    {
        id: 'hydrangea-white', category: 'mix', img: 'bouquet_hydrangea_white',
        name: 'Гортензия с розами в крафте',
        desc: 'Две шапки белой гортензии, кремовые розы и зелёная гортензия — плотный светлый букет.',
        composition: [
            ['Гортензия белая', '2 шт'],
            ['Роза кремовая', '5 шт'],
            ['Гортензия зелёная', '1 шт'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 7200 }],
    },
    {
        id: 'tulips-yellow', category: 'mix', img: 'bouquet_tulips_yellow',
        name: 'Тюльпаны жёлтые, 15 шт',
        composition: [
            ['Тюльпан жёлтый', '15 шт'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 3600 }],
    },
    {
        id: 'chrysanthemum-green', category: 'mix', img: 'bouquet_chrysanthemum_green',
        name: 'Хризантемы сантини, зелёные',
        composition: [
            ['Хризантема сантини', '9 веток'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 3400 }],
    },
    {
        id: 'box-round-pastel', category: 'box', img: 'box_round_pastel',
        name: 'Цветы в шляпной коробке, пастель',
        desc: 'Розы, лизиантус и гипсофила плотным куполом в бежевой шляпной коробке. Не нужна ваза.',
        composition: [
            ['Роза, лизиантус', '30 шт'],
            ['Гипсофила', '5 веток'],
            ['Шляпная коробка', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 9900 }],
    },
    {
        id: 'box-square-red', category: 'box', img: 'box_square_red',
        name: 'Розы в коробке, красные',
        desc: 'Красные розы плотным купоном в квадратной коробке — держит форму и не мнётся при доставке.',
        composition: [
            ['Роза красная', '25 шт'],
            ['Квадратная коробка', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 8400 }],
    },
    {
        id: 'dried-quiet-light', category: 'dried', img: 'bouquet_dried_pampas',
        name: 'Сухоцветы «Тихий свет»',
        desc: 'Пампасная трава, сухие колосья и лагурус — стоит без воды месяцами, не осыпается.',
        composition: [
            ['Пампасная трава', '5 веток'],
            ['Колосья, лагурус', '7 шт'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 3200 }],
    },
    {
        id: 'dried-lavender', category: 'dried', img: 'bouquet_dried_lavender',
        name: 'Букет сухой лаванды',
        composition: [
            ['Лаванда сухая', '15 веток'],
            ['Упаковка — крафт и лента', '1 шт'],
        ],
        sizes: [{ label: 'Стандарт', qty: '', price: 2900 }],
    },
    {
        id: 'gift-card', category: 'addons', img: 'gift_card_kraft',
        name: 'Открытка в крафт-конверте',
        desc: 'Курьер впишет ваш текст от руки и вложит открытку в букет — место для текста на шаге оформления.',
        composition: [['Открытка + конверт', '1 шт']],
        sizes: [{ label: 'Стандарт', qty: '', price: 300 }],
    },
];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export const imgSrc = (name) => `./assets/bouquets/${name}.webp`;

export const priceFrom = (product) => Math.min(...product.sizes.map((s) => s.price));
