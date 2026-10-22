export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceFrom: boolean;
  seller: string;
  sellerId: string;
  weight: string;
  portions: number;
  prepTime: string;
  status: 'published' | 'draft' | 'archived';
  allergens: string[];
  images: string[];
  available: boolean;
  rating?: number;
}

export interface Order {
  id: string;
  customer: string;
  productId: string;
  productName: string;
  status: 'new' | 'accepted' | 'in_production' | 'ready' | 'completed' | 'cancelled';
  date: string;
  deliveryDate: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  notes: string;
}

export interface Recipe {
  id: string;
  name: string;
  productId?: string;
  yield: string;
  ingredients: { name: string; amount: number; unit: string; cost: number }[];
  notes: string;
  lastModified: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
  lastUpdated: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
  preferences: string;
}

export interface B2BPartner {
  id: string;
  name: string;
  category: string;
  region: string;
  description: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  budget: number;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
  tasks: { id: string; title: string; done: boolean; assignee?: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'seller' | 'system';
  text: string;
  time: string;
  isAI?: boolean;
}

export const products: Product[] = [
  {
    id: '1', name: 'Медовик классический', description: 'Традиционный медовый торт с нежным сметанным кремом. 8 коржей, пропитанных overnight.', category: 'Торты', price: 2800, priceFrom: false, seller: 'Анна Пекарская', sellerId: 's1', weight: '1.2 кг', portions: 8, prepTime: '24 часа', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['🍰'], available: true, rating: 4.9
  },
  {
    id: '2', name: 'Красный бархат', description: 'Яркий бисквит с бархатной текстурой и кремом из маскарпоне. Идеален для особых случаев.', category: 'Торты', price: 3200, priceFrom: false, seller: 'Сладкий Дом', sellerId: 's2', weight: '1.5 кг', portions: 10, prepTime: '12 часов', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['🎂'], available: true, rating: 4.8
  },
  {
    id: '3', name: 'Набор макарон (12 шт)', description: 'Ассорти французских макарон: фисташка, малина, шоколад, ваниль, лаванда, карамель.', category: 'Пирожные', price: 1800, priceFrom: false, seller: 'Анна Пекарская', sellerId: 's1', weight: '360 г', portions: 12, prepTime: '48 часов', status: 'published', allergens: ['Миндаль', 'Яйца', 'Молоко'], images: ['🧁'], available: true, rating: 5.0
  },
  {
    id: '4', name: 'Свадебный торт на заказ', description: 'Индивидуальный дизайн. Многоярусный торт с живыми цветами или сахарными украшениями.', category: 'Свадебные', price: 8000, priceFrom: true, seller: 'Sweet Atelier', sellerId: 's3', weight: 'от 3 кг', portions: 20, prepTime: '3-5 дней', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['💒'], available: true, rating: 4.7
  },
  {
    id: '5', name: 'Чизкейк Нью-Йорк', description: 'Классический американский чизкейк на песочной основе с ягодным соусом.', category: 'Торты', price: 2400, priceFrom: false, seller: 'Сладкий Дом', sellerId: 's2', weight: '1 кг', portions: 8, prepTime: '8 часов', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['🍰'], available: true, rating: 4.6
  },
  {
    id: '6', name: 'Эклеры ассорти (6 шт)', description: 'Заварные пирожные с кремом: ваниль, шоколад, фисташка, карамель, малина, кофе.', category: 'Пирожные', price: 1200, priceFrom: false, seller: 'Анна Пекарская', sellerId: 's1', weight: '420 г', portions: 6, prepTime: '6 часов', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['🥐'], available: true, rating: 4.9
  },
  {
    id: '7', name: 'Детский торт «Единорог»', description: 'Яркий торт для детского праздника с фигуркой единорога и радужными слоями.', category: 'Детские', price: 3500, priceFrom: false, seller: 'Sweet Atelier', sellerId: 's3', weight: '2 кг', portions: 12, prepTime: '2 дня', status: 'published', allergens: ['Глютен', 'Молоко', 'Яйца'], images: ['🦄'], available: true, rating: 4.8
  },
  {
    id: '8', name: 'Тарт Татен', description: 'Французский яблочный торт карамелизированными яблоками и слоёным тестом.', category: 'Торты', price: 2200, priceFrom: false, seller: 'Сладкий Дом', sellerId: 's2', weight: '900 г', portions: 6, prepTime: '4 часа', status: 'published', allergens: ['Глютен', 'Молоко'], images: ['🍎'], available: false, rating: 4.5
  },
];

export const orders: Order[] = [
  { id: 'ORD-001', customer: 'Мария Иванова', productId: '1', productName: 'Медовик классический', status: 'new', date: '2026-01-15', deliveryDate: '2026-01-18', total: 2800, items: [{ name: 'Медовик классический', qty: 1, price: 2800 }], notes: 'Без орехов, пожалуйста' },
  { id: 'ORD-002', customer: 'Дмитрий Петров', productId: '2', productName: 'Красный бархат', status: 'accepted', date: '2026-01-14', deliveryDate: '2026-01-17', total: 3200, items: [{ name: 'Красный бархат', qty: 1, price: 3200 }], notes: 'Надпись: С Днём Рождения!' },
  { id: 'ORD-003', customer: 'Елена Козлова', productId: '3', productName: 'Набор макарон (12 шт)', status: 'in_production', date: '2026-01-13', deliveryDate: '2026-01-16', total: 1800, items: [{ name: 'Набор макарон (12 шт)', qty: 1, price: 1800 }], notes: '' },
  { id: 'ORD-004', customer: 'Алексей Смирнов', productId: '4', productName: 'Свадебный торт на заказ', status: 'ready', date: '2026-01-10', deliveryDate: '2026-01-15', total: 12000, items: [{ name: 'Свадебный торт 3 яруса', qty: 1, price: 12000 }], notes: 'Белый крем, живые пионы' },
  { id: 'ORD-005', customer: 'Ольга Новикова', productId: '5', productName: 'Чизкейк Нью-Йорк', status: 'completed', date: '2026-01-08', deliveryDate: '2026-01-10', total: 2400, items: [{ name: 'Чизкейк Нью-Йорк', qty: 1, price: 2400 }], notes: '' },
  { id: 'ORD-006', customer: 'Сергей Волков', productId: '6', productName: 'Эклеры ассорти (6 шт)', status: 'completed', date: '2026-01-05', deliveryDate: '2026-01-07', total: 1200, items: [{ name: 'Эклеры ассорти', qty: 2, price: 1200 }], notes: 'Корпоративный заказ' },
];

export const recipes: Recipe[] = [
  {
    id: 'r1', name: 'Медовик классический', productId: '1', yield: '1.2 кг (8 порций)',
    ingredients: [
      { name: 'Мука пшеничная', amount: 400, unit: 'г', cost: 40 },
      { name: 'Мёд', amount: 150, unit: 'г', cost: 120 },
      { name: 'Сахар', amount: 200, unit: 'г', cost: 20 },
      { name: 'Масло сливочное', amount: 200, unit: 'г', cost: 160 },
      { name: 'Яйца', amount: 4, unit: 'шт', cost: 48 },
      { name: 'Сметана 20%', amount: 500, unit: 'г', cost: 200 },
      { name: 'Сода', amount: 10, unit: 'г', cost: 5 },
    ],
    notes: 'Коржи печь при 180°C по 5-7 минут. Крем взбивать 10 минут. Пропитка минимум 8 часов.',
    lastModified: '2026-01-10'
  },
  {
    id: 'r2', name: 'Красный бархат', productId: '2', yield: '1.5 кг (10 порций)',
    ingredients: [
      { name: 'Мука пшеничная', amount: 350, unit: 'г', cost: 35 },
      { name: 'Какао', amount: 30, unit: 'г', cost: 45 },
      { name: 'Сахар', amount: 300, unit: 'г', cost: 30 },
      { name: 'Масло растительное', amount: 200, unit: 'мл', cost: 60 },
      { name: 'Яйца', amount: 3, unit: 'шт', cost: 36 },
      { name: 'Краситель красный', amount: 15, unit: 'мл', cost: 80 },
      { name: 'Маскарпоне', amount: 500, unit: 'г', cost: 450 },
      { name: 'Сливки 33%', amount: 300, unit: 'мл', cost: 210 },
    ],
    notes: 'Бисквит печь при 170°C 30-35 минут. Крем из маскарпоне не перевзбивать.',
    lastModified: '2026-01-08'
  },
];

export const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Мука пшеничная в/с', unit: 'кг', stock: 25, minStock: 5, costPerUnit: 100, lastUpdated: '2026-01-14' },
  { id: 'i2', name: 'Сахар', unit: 'кг', stock: 15, minStock: 3, costPerUnit: 80, lastUpdated: '2026-01-14' },
  { id: 'i3', name: 'Масло сливочное 82%', unit: 'кг', stock: 4, minStock: 2, costPerUnit: 800, lastUpdated: '2026-01-13' },
  { id: 'i4', name: 'Яйца куриные', unit: 'дес', stock: 8, minStock: 3, costPerUnit: 120, lastUpdated: '2026-01-14' },
  { id: 'i5', name: 'Сметана 20%', unit: 'кг', stock: 2, minStock: 2, costPerUnit: 400, lastUpdated: '2026-01-12' },
  { id: 'i6', name: 'Маскарпоне', unit: 'кг', stock: 1.5, minStock: 1, costPerUnit: 900, lastUpdated: '2026-01-13' },
  { id: 'i7', name: 'Сливки 33%', unit: 'л', stock: 3, minStock: 1, costPerUnit: 700, lastUpdated: '2026-01-14' },
  { id: 'i8', name: 'Мёд', unit: 'кг', stock: 3, minStock: 1, costPerUnit: 800, lastUpdated: '2026-01-10' },
  { id: 'i9', name: 'Какао-порошок', unit: 'кг', stock: 0.5, minStock: 0.3, costPerUnit: 1500, lastUpdated: '2026-01-11' },
  { id: 'i10', name: 'Шоколад тёмный', unit: 'кг', stock: 1, minStock: 0.5, costPerUnit: 1200, lastUpdated: '2026-01-12' },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Мария Иванова', email: 'maria@mail.ru', phone: '+7 (900) 123-45-67', ordersCount: 5, totalSpent: 14200, lastOrder: '2026-01-15', preferences: 'Без орехов, умеренно сладко' },
  { id: 'c2', name: 'Дмитрий Петров', email: 'd.petrov@gmail.com', phone: '+7 (900) 234-56-78', ordersCount: 3, totalSpent: 9600, lastOrder: '2026-01-14', preferences: 'Любит шоколад' },
  { id: 'c3', name: 'Елена Козлова', email: 'elena.k@yandex.ru', phone: '+7 (900) 345-67-89', ordersCount: 8, totalSpent: 22400, lastOrder: '2026-01-13', preferences: 'Французские десерты, без глютена' },
  { id: 'c4', name: 'Алексей Смирнов', email: 'a.smirnov@mail.ru', phone: '+7 (900) 456-78-90', ordersCount: 1, totalSpent: 12000, lastOrder: '2026-01-10', preferences: 'Свадебные торты' },
  { id: 'c5', name: 'Ольга Новикова', email: 'olga.n@gmail.com', phone: '+7 (900) 567-89-01', ordersCount: 12, totalSpent: 28800, lastOrder: '2026-01-08', preferences: 'Классические торты, постоянный клиент' },
];

export const b2bPartners: B2BPartner[] = [
  { id: 'b1', name: 'Молочный комбинат «Заречье»', category: 'Поставщики ингредиентов', region: 'Москва и МО', description: 'Свежие молочные продукты оптом: сливки, маскарпоне, сметана, масло.', status: 'active' },
  { id: 'b2', name: 'Упак-Сервис', category: 'Поставщики упаковки', region: 'Россия', description: 'Коробки для тортов, подложки, ленты, упаковочные материалы.', status: 'active' },
  { id: 'b3', name: 'Флористика «Лаванда»', category: 'Флористы', region: 'Санкт-Петербург', description: 'Живые цветы для декора тортов и мероприятий.', status: 'active' },
  { id: 'b4', name: 'Event-агентство «Праздник»', category: 'Организаторы мероприятий', region: 'Москва', description: 'Полный цикл организации свадеб и корпоративных мероприятий.', status: 'pending' },
  { id: 'b5', name: 'Фото-студия «Объектив»', category: 'Фотографы и видеографы', region: 'Москва и МО', description: 'Фуд-фотография, съёмка мероприятий, контент для социальных сетей.', status: 'active' },
];

export const events: Event[] = [
  {
    id: 'e1', name: 'Свадьба Ивановых', date: '2026-02-14', location: 'Ресторан «Белый сад»', budget: 150000, status: 'confirmed',
    tasks: [
      { id: 't1', title: 'Свадебный торт 3 яруса', done: true, assignee: 'Sweet Atelier' },
      { id: 't2', title: 'Кенди-бар', done: false, assignee: 'Анна Пекарская' },
      { id: 't3', title: 'Флористическое оформление', done: false, assignee: 'Флористика «Лаванда»' },
      { id: 't4', title: 'Фотограф', done: true, assignee: 'Фото-студия «Объектив»' },
    ]
  },
  {
    id: 'e2', name: 'Корпоратив IT-компании', date: '2026-03-08', location: 'Лофт «Пространство»', budget: 80000, status: 'planning',
    tasks: [
      { id: 't5', title: 'Торт с логотипом', done: false },
      { id: 't6', title: 'Набор капкейков (50 шт)', done: false },
      { id: 't7', title: 'Кейтеринг', done: false },
    ]
  },
];

export const chatMessages: ChatMessage[] = [
  { id: 'm1', sender: 'user', text: 'Здравствуйте! Можно ли заказать торт на 18 января?', time: '10:30' },
  { id: 'm2', sender: 'seller', text: 'Добрый день! Да, конечно. Какой торт вас интересует?', time: '10:32' },
  { id: 'm3', sender: 'user', text: 'Хочу медовик, но без орехов. И можно ли сделать надпись?', time: '10:35' },
  { id: 'm4', sender: 'seller', text: 'Без проблем! Медовик готовим без орехов. Надпись сделаем. Стоимость 2800₽, срок — 2 дня.', time: '10:38' },
  { id: 'm5', sender: 'user', text: 'Отлично, оформляю заказ!', time: '10:40' },
];

export const categories = ['Все', 'Торты', 'Пирожные', 'Свадебные', 'Детские', 'Капкейки', 'Макаруны', 'Пряники'];
export const occasions = ['День рождения', 'Свадьба', 'Юбилей', 'Детский праздник', 'Корпоратив', '14 февраля', '8 марта'];
