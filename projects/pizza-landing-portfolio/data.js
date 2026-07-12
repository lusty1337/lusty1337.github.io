// всё меню пиццерии. img — базовое имя файла (оно же уникальный id позиции),
// путь собирается как ./assets/{dir}/{img}.webp
// anim: spin — вращение (круглые кадры сверху), sway — покачивание (напитки 3/4)

export const CATEGORIES = [
  {
    key: "pizza", label: "Пицца", dir: "pizzas", anim: "spin",
    items: [
      { img: "pizza_margherita",           name: "Маргарита",     desc: "томаты, моцарелла, базилик",                price: 590 },
      { img: "pizza_pepperoni",            name: "Пепперони",     desc: "пепперони, моцарелла, томатный соус",       price: 690 },
      { img: "pizza_four_cheese",          name: "Четыре сыра",   desc: "моцарелла, горгонзола, пармезан, рикотта",  price: 750 },
      { img: "pizza_hawaiian",             name: "Гавайская",     desc: "ветчина, ананас, моцарелла",                price: 640 },
      { img: "pizza_carbonara",            name: "Карбонара",     desc: "бекон, яйцо, пармезан, сливочный соус",     price: 720 },
      { img: "pizza_mushroom_and_truffle", name: "Гриб & Трюфель", desc: "лесные грибы, трюфельное масло, моцарелла", price: 810 },
      { img: "pizza_bbq_chicken",          name: "BBQ Чикен",     desc: "курица гриль, соус BBQ, красный лук",        price: 670 },
      { img: "pizza_veggie_supreme",       name: "Вегги Суприм",  desc: "перец, томаты, маслины, базилик",           price: 620 },
    ],
  },
  {
    key: "appetizers", label: "Закуски", dir: "appetizers", anim: "spin",
    items: [
      { img: "appetizer_garlic_bread",      name: "Чесночный хлеб",     desc: "с сырным соусом",                 price: 290 },
      { img: "appetizer_bbq_chicken_wings", name: "Крылышки BBQ",       desc: "куриные крылышки в соусе барбекю", price: 490 },
      { img: "appetizer_mozzarella_sticks", name: "Моцарелла стики",    desc: "с томатным соусом маринара",       price: 380 },
      { img: "appetizer_bruschetta",        name: "Брускетта",          desc: "томаты, базилик, оливковое масло", price: 320 },
      { img: "appetizer_potato_wedges",     name: "Картофельные дольки", desc: "с соусом айоли",                  price: 270 },
      { img: "appetizer_caesar_salad",      name: "Салат Цезарь",       desc: "курица, романо, пармезан, крутоны", price: 420 },
    ],
  },
  {
    key: "drinks", label: "Напитки", dir: "drinks", anim: "sway",
    items: [
      { img: "drink_lemonade_strawberry", name: "Лимонад Клубника-Базилик",     desc: "клубника, базилик, лёд",   price: 250 },
      { img: "drink_soda_mango",          name: "Итальянская газировка Манго",  desc: "манго, пузырьки, лёд",     price: 230 },
      { img: "drink_cola_ice",            name: "Кола",                         desc: "классическая, со льдом",   price: 180 },
      { img: "drink_juice_orange",        name: "Апельсиновый фреш",            desc: "свежевыжатый апельсин",    price: 270 },
      { img: "drink_milkshake_vanilla",   name: "Молочный коктейль Ваниль",     desc: "ваниль, пломбир",          price: 320 },
      { img: "drink_water_sparkling",     name: "Минеральная вода с лимоном",   desc: "газированная, с лимоном",  price: 150 },
    ],
  },
  {
    key: "desserts", label: "Десерты", dir: "desserts", anim: "spin",
    items: [
      { img: "dessert_tiramisu",           name: "Тирамису",          desc: "маскарпоне, кофе, савоярди",     price: 380 },
      { img: "dessert_new_york_cheesecake", name: "Чизкейк Нью-Йорк", desc: "с клубникой",                    price: 350 },
      { img: "dessert_chocolate_fondant",  name: "Шоколадный фондан", desc: "с жидким центром",               price: 420 },
      { img: "dessert_panna_cotta",        name: "Панна котта",       desc: "с малиновым соусом",             price: 310 },
      { img: "dessert_cannoli",            name: "Канноли",           desc: "рикотта, фисташки, сахарная пудра", price: 290 },
      { img: "dessert_gelato",             name: "Джелато",           desc: "три шарика на выбор",            price: 280 },
    ],
  },
];

// плоская карта id → позиция (+ откуда она), нужна корзине для восстановления
export const ITEM_BY_ID = new Map();
for (const cat of CATEGORIES) {
  for (const it of cat.items) {
    ITEM_BY_ID.set(it.img, { ...it, dir: cat.dir });
  }
}

export const money = n => n.toLocaleString("ru-RU") + " ₽";
