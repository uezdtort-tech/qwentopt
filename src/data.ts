import type { User, Product, Order, Recipe, InventoryItem, Conversation, Message, Event } from './types';

export const initialUsers: User[] = [
  { id: 'u1', email: 'anna@conditera.ru', name: 'Анна Пекарская', role: 'confectioner', phone: '+7 (900) 111-22-33', city: 'Москва', about: 'Кондитер с 10-летним опытом. Свадебные торты и французские десерты.', rating: 4.9, joinedAt: '2024-03-15' },
  { id: 'u2', email: 'maria@mail.ru', name: 'Мария Иванова', role: 'client', phone: '+7 (900) 222-33-44', city: 'Москва', about: 'Люблю сладкое', joinedAt: '2024-06-20' },
  { id: 'u3', email: 'sweet@home.ru', name: 'Сладкий Дом', role: 'confectioner', phone: '+7 (900) 333-44-55', city: 'Санкт-Петербург', about: 'Семейная кондитерская', rating: 4.7, joinedAt: '2024-01-10' },
  { id: 'u4', email: 'supplier@moloko.ru', name: 'Молочный комбинат «Заречье»', role: 'supplier', phone: '+7 (900) 444-55-66', city: 'Москва', about: 'Свежие молочные продукты оптом', joinedAt: '2024-02-01' },
  { id: 'u5', email: 'decor@shop.ru', name: 'Декор-Шоп', role: 'decorator', phone: '+7 (900) 555-66-77', city: 'Москва', about: 'Топперы, свечи, фигурки для тортов', joinedAt: '2024-04-15' },
  { id: 'u6', email: 'anim@fun.ru', name: 'Аниматор Весельчак', role: 'animator', phone: '+7 (900) 666-77-88', city: 'Москва', about: 'Детские праздники, шоу программы', rating: 5.0, joinedAt: '2024-05-01' },
  { id: 'u7', email: 'org@event.ru', name: 'Event-агентство «Праздник»', role: 'organizer', phone: '+7 (900) 777-88-99', city: 'Москва', about: 'Организация свадеб и корпоративов', joinedAt: '2024-03-01' },
  { id: 'u8', email: 'admin@conditera.ru', name: 'Администратор', role: 'admin', joinedAt: '2024-01-01' },
];

export const initialProducts: Product[] = [
  { id: 'p1', sellerId: 'u1', name: 'Медовик классический', description: 'Традиционный медовый торт с нежным сметанным кремом. 8 коржей, пропитанных overnight.', category: 'Торты', price: 2800, weight: '1.2 кг', portions: 8, prepTime: '24 часа', emoji: '🎂', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.9 },
  { id: 'p2', sellerId: 'u1', name: 'Красный бархат', description: 'Яркий бисквит с бархатной текстурой и кремом из маскарпоне.', category: 'Торты', price: 3200, weight: '1.5 кг', portions: 10, prepTime: '12 часов', emoji: '🍰', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.8 },
  { id: 'p3', sellerId: 'u1', name: 'Набор макарон (12 шт)', description: 'Ассорти французских макарон: фисташка, малина, шоколад, ваниль.', category: 'Пирожные', price: 1800, weight: '360 г', portions: 12, prepTime: '48 часов', emoji: '🧁', allergens: ['Миндаль', 'Яйца', 'Молоко'], available: true, rating: 5.0 },
  { id: 'p4', sellerId: 'u3', name: 'Свадебный торт на заказ', description: 'Индивидуальный дизайн. Многоярусный торт с живыми цветами.', category: 'Свадебные', price: 8000, weight: 'от 3 кг', portions: 20, prepTime: '3-5 дней', emoji: '💒', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.7 },
  { id: 'p5', sellerId: 'u3', name: 'Чизкейк Нью-Йорк', description: 'Классический американский чизкейк на песочной основе с ягодным соусом.', category: 'Торты', price: 2400, weight: '1 кг', portions: 8, prepTime: '8 часов', emoji: '🍰', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.6 },
  { id: 'p6', sellerId: 'u1', name: 'Эклеры ассорти (6 шт)', description: 'Заварные пирожные с кремом: ваниль, шоколад, фисташка.', category: 'Пирожные', price: 1200, weight: '420 г', portions: 6, prepTime: '6 часов', emoji: '🥐', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.9 },
  { id: 'p7', sellerId: 'u3', name: 'Детский торт «Единорог»', description: 'Яркий торт для детского праздника с фигуркой единорога.', category: 'Детские', price: 3500, weight: '2 кг', portions: 12, prepTime: '2 дня', emoji: '🦄', allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, rating: 4.8 },
  { id: 'p8', sellerId: 'u5', name: 'Топпер «С Днём Рождения»', description: 'Акриловый топпер с золотым тиснением', category: 'Декор', price: 450, weight: '50 г', portions: 1, prepTime: '1 день', emoji: '🎈', allergens: [], available: true, rating: 4.5 },
  { id: 'p9', sellerId: 'u5', name: 'Набор свечей «Спираль»', description: '12 спиральных свечей разных цветов', category: 'Декор', price: 350, weight: '100 г', portions: 12, prepTime: 'В наличии', emoji: '🕯️', allergens: [], available: true, rating: 4.7 },
];

export const initialOrders: Order[] = [
  { id: 'ORD-001', buyerId: 'u2', sellerId: 'u1', productId: 'p1', productName: 'Медовик классический', status: 'new', total: 2800, deliveryDate: '2026-01-20', notes: 'Без орехов', createdAt: '2026-01-15' },
  { id: 'ORD-002', buyerId: 'u2', sellerId: 'u1', productId: 'p2', productName: 'Красный бархат', status: 'accepted', total: 3200, deliveryDate: '2026-01-19', notes: 'Надпись: С Днём Рождения!', createdAt: '2026-01-14' },
  { id: 'ORD-003', buyerId: 'u2', sellerId: 'u1', productId: 'p3', productName: 'Набор макарон', status: 'in_production', total: 1800, deliveryDate: '2026-01-18', notes: '', createdAt: '2026-01-13' },
  { id: 'ORD-004', buyerId: 'u2', sellerId: 'u3', productId: 'p4', productName: 'Свадебный торт', status: 'ready', total: 12000, deliveryDate: '2026-01-17', notes: 'Белый крем, живые пионы', createdAt: '2026-01-10' },
  { id: 'ORD-005', buyerId: 'u2', sellerId: 'u3', productId: 'p5', productName: 'Чизкейк Нью-Йорк', status: 'completed', total: 2400, deliveryDate: '2026-01-12', notes: '', createdAt: '2026-01-08' },
];

export const initialRecipes: Recipe[] = [
  {
    id: 'r1', confectionerId: 'u1', name: 'Медовик классический',
    ingredients: [
      { name: 'Мука пшеничная', amount: 400, unit: 'г', cost: 40 },
      { name: 'Мёд', amount: 150, unit: 'г', cost: 120 },
      { name: 'Сахар', amount: 200, unit: 'г', cost: 20 },
      { name: 'Масло сливочное', amount: 200, unit: 'г', cost: 160 },
      { name: 'Яйца', amount: 4, unit: 'шт', cost: 48 },
      { name: 'Сметана 20%', amount: 500, unit: 'г', cost: 200 },
    ],
  },
];

export const initialInventory: InventoryItem[] = [
  { id: 'inv1', ownerId: 'u1', name: 'Мука пшеничная', unit: 'кг', stock: 25, minStock: 5, costPerUnit: 100 },
  { id: 'inv2', ownerId: 'u1', name: 'Сахар', unit: 'кг', stock: 15, minStock: 3, costPerUnit: 80 },
  { id: 'inv3', ownerId: 'u1', name: 'Масло сливочное', unit: 'кг', stock: 4, minStock: 2, costPerUnit: 800 },
  { id: 'inv4', ownerId: 'u1', name: 'Яйца', unit: 'дес', stock: 8, minStock: 3, costPerUnit: 120 },
  { id: 'inv5', ownerId: 'u1', name: 'Сметана 20%', unit: 'кг', stock: 2, minStock: 2, costPerUnit: 400 },
  { id: 'inv6', ownerId: 'u1', name: 'Маскарпоне', unit: 'кг', stock: 1.5, minStock: 1, costPerUnit: 900 },
  { id: 'inv7', ownerId: 'u1', name: 'Мёд', unit: 'кг', stock: 3, minStock: 1, costPerUnit: 800 },
];

export const initialConversations: Conversation[] = [
  { id: 'conv1', participants: ['u2', 'u1'], lastMessage: 'Отлично, оформляю заказ!' },
];

export const initialMessages: Message[] = [
  { id: 'm1', conversationId: 'conv1', senderId: 'u2', text: 'Здравствуйте! Можно ли заказать торт на 20 января?', time: '10:30' },
  { id: 'm2', conversationId: 'conv1', senderId: 'u1', text: 'Добрый день! Да, конечно. Какой торт вас интересует?', time: '10:32' },
  { id: 'm3', conversationId: 'conv1', senderId: 'u2', text: 'Хочу медовик, но без орехов. И можно ли сделать надпись?', time: '10:35' },
  { id: 'm4', conversationId: 'conv1', senderId: 'u1', text: 'Без проблем! Стоимость 2800₽, срок — 2 дня.', time: '10:38' },
  { id: 'm5', conversationId: 'conv1', senderId: 'u2', text: 'Отлично, оформляю заказ!', time: '10:40' },
];

export const initialEvents: Event[] = [
  {
    id: 'e1', organizerId: 'u7', name: 'Свадьба Ивановых', date: '2026-02-14', location: 'Ресторан «Белый сад»', budget: 150000,
    tasks: [
      { id: 't1', title: 'Свадебный торт 3 яруса', done: true, assignee: 'Анна Пекарская' },
      { id: 't2', title: 'Кенди-бар', done: false, assignee: 'Сладкий Дом' },
      { id: 't3', title: 'Флористическое оформление', done: false },
      { id: 't4', title: 'Аниматоры', done: false, assignee: 'Аниматор Весельчак' },
    ]
  },
];
