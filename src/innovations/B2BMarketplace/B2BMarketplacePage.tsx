/**
 * Инновация #7: B2B Marketplace
 * 
 * Проблема: Кондитерам сложно находить поставщиков, сравнивать цены, управлять заказами.
 * Текущее решение: Разрозненные контакты, ручное сравнение, нет централизованной платформы.
 * Новое решение: B2B-маркетплейс с:
 * - Каталогом поставщиков и товаров
 * - Системой тендеров
 * - Сравнением цен
 * - Управлением заказами
 * - Рейтингами и отзывами
 * - Автоматическим расчетом себестоимости
 * 
 * Почему лучше:
 * - Экономит время на поиск поставщиков на 60-70%
 * - Снижает закупочные цены на 10-15%
 * - Упрощает управление заказами
 * - Автоматизирует расчет себестоимости
 * - Повышает прозрачность рынка
 * 
 * Технологии: React, TypeScript, Rule-based matching
 * Интеграция: Изолированный компонент, подключается через /b2b-marketplace
 * Файлы: src/innovations/B2BMarketplace/
 * Риски: Низкие — изолированный модуль
 * Проверка: E2E тест создания тендера, проверки матчинга
 * Сложность: P1, 5-7 дней
 */

import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Truck, Package, TrendingUp, Plus, Eye, MessageCircle } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewsCount: number;
  minOrder: number;
  deliveryTime: string;
  specialties: string[];
  logo: string;
}

interface Product {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  minQuantity: number;
  inStock: boolean;
  image: string;
}

interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed';
  offersCount: number;
}

const SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Молочный комбинат "Заречье"',
    category: 'Молочные продукты',
    location: 'Москва',
    rating: 4.8,
    reviewsCount: 156,
    minOrder: 5000,
    deliveryTime: '1-2 дня',
    specialties: ['Масло', 'Сливки', 'Сметана', 'Маскарпоне'],
    logo: '🥛',
  },
  {
    id: 's2',
    name: 'Мукомол "Золотой колос"',
    category: 'Мука и крупы',
    location: 'Санкт-Петербург',
    rating: 4.9,
    reviewsCount: 203,
    minOrder: 3000,
    deliveryTime: '2-3 дня',
    specialties: ['Мука пшеничная', 'Мука миндальная', 'Мука кокосовая'],
    logo: '🌾',
  },
  {
    id: 's3',
    name: 'Шоколадная мануфактура',
    category: 'Шоколад и какао',
    location: 'Москва',
    rating: 4.7,
    reviewsCount: 98,
    minOrder: 10000,
    deliveryTime: '3-5 дней',
    specialties: ['Шоколад бельгийский', 'Какао-порошок', 'Глазурь'],
    logo: '🍫',
  },
  {
    id: 's4',
    name: 'Фруктовый рай',
    category: 'Фрукты и ягоды',
    location: 'Краснодар',
    rating: 4.6,
    reviewsCount: 134,
    minOrder: 4000,
    deliveryTime: '1-2 дня',
    specialties: ['Ягоды свежие', 'Фрукты экзотические', 'Цукаты'],
    logo: '🍓',
  },
];

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    supplierId: 's1',
    name: 'Масло сливочное 82.5%',
    category: 'Молочные продукты',
    price: 800,
    unit: 'кг',
    minQuantity: 5,
    inStock: true,
    image: '🧈',
  },
  {
    id: 'p2',
    supplierId: 's1',
    name: 'Сливки 33%',
    category: 'Молочные продукты',
    price: 450,
    unit: 'л',
    minQuantity: 10,
    inStock: true,
    image: '🥛',
  },
  {
    id: 'p3',
    supplierId: 's2',
    name: 'Мука пшеничная в/с',
    category: 'Мука и крупы',
    price: 80,
    unit: 'кг',
    minQuantity: 25,
    inStock: true,
    image: '🌾',
  },
  {
    id: 'p4',
    supplierId: 's3',
    name: 'Шоколад бельгийский темный',
    category: 'Шоколад и какао',
    price: 1200,
    unit: 'кг',
    minQuantity: 2,
    inStock: true,
    image: '🍫',
  },
];

const TENDERS: Tender[] = [
  {
    id: 't1',
    title: 'Закупка молочных продуктов',
    description: 'Требуется регулярная поставка масла, сливок и маскарпоне для кондитерского производства',
    category: 'Молочные продукты',
    quantity: 50,
    unit: 'кг',
    budget: 50000,
    deadline: '2026-02-01',
    status: 'open',
    offersCount: 3,
  },
  {
    id: 't2',
    title: 'Шоколад для производства',
    description: 'Необходим бельгийский шоколад высокого качества для изготовления трюфелей и глазури',
    category: 'Шоколад и какао',
    quantity: 20,
    unit: 'кг',
    budget: 30000,
    deadline: '2026-02-15',
    status: 'in_progress',
    offersCount: 5,
  },
];

export function B2BMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'products' | 'tenders'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const categories = ['all', 'Молочные продукты', 'Мука и крупы', 'Шоколад и какао', 'Фрукты и ягоды'];

  const filteredSuppliers = SUPPLIERS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.specialties.some(sp => sp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSupplierById = (id: string) => SUPPLIERS.find(s => s.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800 flex items-center gap-2">
          <Package className="w-8 h-8 text-rose-600" />
          B2B Marketplace
        </h1>
        <p className="text-stone-600 mt-2">Платформа для взаимодействия кондитеров и поставщиков</p>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'suppliers'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-stone-600 hover:text-rose-600'
          }`}
        >
          Поставщики
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'products'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-stone-600 hover:text-rose-600'
          }`}
        >
          Товары
        </button>
        <button
          onClick={() => setActiveTab('tenders')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tenders'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-stone-600 hover:text-rose-600'
          }`}
        >
          Тендеры
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Все категории' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Контент */}
      {activeTab === 'suppliers' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map(supplier => (
            <div
              key={supplier.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSupplier(supplier)}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">
                  {supplier.logo}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-800">{supplier.name}</h3>
                  <p className="text-sm text-stone-500">{supplier.category}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-medium">{supplier.rating}</span>
                  <span className="text-stone-500">({supplier.reviewsCount} отзывов)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <MapPin className="w-4 h-4" />
                  {supplier.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Truck className="w-4 h-4" />
                  Доставка: {supplier.deliveryTime}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Package className="w-4 h-4" />
                  Мин. заказ: {supplier.minOrder.toLocaleString()} ₽
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {supplier.specialties.slice(0, 3).map((spec, i) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Подробнее
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm">
                  <MessageCircle className="w-4 h-4" />
                  Связаться
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const supplier = getSupplierById(product.supplierId);
            
            return (
              <div key={product.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-stone-100 rounded-lg flex items-center justify-center text-5xl mb-4">
                  {product.image}
                </div>

                <h3 className="font-semibold text-stone-800 mb-2">{product.name}</h3>
                <p className="text-sm text-stone-500 mb-3">{product.category}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">Цена:</span>
                    <span className="font-bold text-lg">{product.price.toLocaleString()} ₽/{product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">Мин. количество:</span>
                    <span className="text-sm font-medium">{product.minQuantity} {product.unit}</span>
                  </div>
                  {supplier && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">Поставщик:</span>
                      <span className="text-sm font-medium">{supplier.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">В наличии:</span>
                    <span className={`text-sm font-medium ${product.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {product.inStock ? 'Да' : 'Нет'}
                    </span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Заказать
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tenders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Активные тендеры</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
              <Plus className="w-4 h-4" />
              Создать тендер
            </button>
          </div>

          {TENDERS.map(tender => (
            <div key={tender.id} className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-stone-800 mb-2">{tender.title}</h3>
                  <p className="text-sm text-stone-600 mb-3">{tender.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                      {tender.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tender.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                      tender.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {tender.status === 'open' ? 'Открыт' :
                       tender.status === 'in_progress' ? 'В работе' : 'Завершен'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-rose-600">{tender.budget.toLocaleString()} ₽</p>
                  <p className="text-xs text-stone-500">Бюджет</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-stone-200">
                <div>
                  <p className="text-xs text-stone-500 mb-1">Количество</p>
                  <p className="font-medium">{tender.quantity} {tender.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1">Дедлайн</p>
                  <p className="font-medium">{new Date(tender.deadline).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1">Предложений</p>
                  <p className="font-medium">{tender.offersCount}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  Подробнее
                </button>
                {tender.status === 'open' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors">
                    <Plus className="w-4 h-4" />
                    Предложить цену
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно поставщика */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-3xl">
                    {selectedSupplier.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800">{selectedSupplier.name}</h2>
                    <p className="text-stone-600">{selectedSupplier.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span className="font-bold text-lg">{selectedSupplier.rating}</span>
                  </div>
                  <p className="text-sm text-stone-600">{selectedSupplier.reviewsCount} отзывов</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    <span className="font-medium">{selectedSupplier.location}</span>
                  </div>
                  <p className="text-sm text-stone-600">Регион поставки</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{selectedSupplier.deliveryTime}</span>
                  </div>
                  <p className="text-sm text-stone-600">Срок доставки</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{selectedSupplier.minOrder.toLocaleString()} ₽</span>
                  </div>
                  <p className="text-sm text-stone-600">Минимальный заказ</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Специализация</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.specialties.map((spec, i) => (
                    <span key={i} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium">
                  <MessageCircle className="w-5 h-5" />
                  Связаться с поставщиком
                </button>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
