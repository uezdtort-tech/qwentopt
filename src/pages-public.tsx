import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, ArrowRight, Star, Clock, Shield, Users, ChefHat, Sparkles, SlidersHorizontal, ShoppingCart, AlertTriangle, ArrowLeft, Send, Plus, CheckCircle, Circle, Calendar, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { useStore, useCurrentUser } from './store';
import type { Product } from './types';

// ==================== HOME PAGE ====================
export function HomePage() {
  const { store } = useStore();
  const navigate = useNavigate();
  const featured = store.products.filter(p => p.available).slice(0, 6);

  return (
    <div>
      <section className="bg-gradient-to-br from-stone-50 via-rose-50/30 to-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" /> Экосистема для кондитеров
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
                Торты, десерты<br />и услуги для<br />вашего праздника
              </h1>
              <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-lg">
                Закажите уникальный торт у проверенного кондитера, спланируйте мероприятие, найдите аниматоров и декор — всё в одной платформе.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/catalog')} className="bg-rose-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-rose-700 shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                  Найти торт <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/constructor')} className="bg-white text-stone-800 px-8 py-4 rounded-xl font-medium hover:bg-stone-50 border border-stone-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Конструктор торта
                </button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { emoji: '🎂', title: 'Торты на заказ', price: 'от 2 200 ₽' },
                { emoji: '🧁', title: 'Макаруны', price: 'от 1 800 ₽' },
                { emoji: '💒', title: 'Свадебные', price: 'от 8 000 ₽' },
                { emoji: '🦄', title: 'Детские', price: 'от 3 500 ₽' },
              ].map((item, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 shadow-lg border border-stone-200 ${i % 2 ? 'mt-8' : ''}`}>
                  <div className="text-5xl mb-3">{item.emoji}</div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-stone-800 mb-8">Направления экосистемы</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '🎂', title: 'Торты', color: 'bg-rose-50 text-rose-600' },
            { icon: '🎈', title: 'Декор', color: 'bg-purple-50 text-purple-600' },
            { icon: '📅', title: 'Мероприятия', color: 'bg-amber-50 text-amber-600' },
            { icon: '🎭', title: 'Аниматоры', color: 'bg-blue-50 text-blue-600' },
            { icon: '🌸', title: 'Флористы', color: 'bg-pink-50 text-pink-600' },
            { icon: '📸', title: 'Фотографы', color: 'bg-emerald-50 text-emerald-600' },
          ].map((item, i) => (
            <Link key={i} to="/catalog" className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-rose-300 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl ${item.color}`}>{item.icon}</div>
              <p className="font-medium text-sm group-hover:text-rose-600">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-800">Популярные торты</h2>
          <Link to="/catalog" className="text-rose-600 text-sm font-medium hover:underline flex items-center gap-1">Все <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-stone-800 text-center mb-12">Почему Conditera</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Проверенные кондитеры', desc: 'Модерация и верификация всех продавцов' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Уникальные рецепты', desc: 'Авторские торты от лучших мастеров' },
              { icon: <Users className="w-6 h-6" />, title: 'Прямое общение', desc: 'Чат напрямую с кондитером' },
              { icon: <ChefHat className="w-6 h-6" />, title: 'Полный цикл', desc: 'От торта до оформления мероприятия' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">{item.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">Вы кондитер? Присоединяйтесь</h2>
              <p className="text-stone-300 leading-relaxed mb-6">
                Получайте заказы, управляйте рецептами и себестоимостью, ведите склад и общайтесь с клиентами.
              </p>
              <Link to="/auth" className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500">Стать кондитером</Link>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: '📋', title: 'Управление заказами' },
                { icon: '📖', title: 'Рецепты и себестоимость' },
                { icon: '📦', title: 'Склад и ингредиенты' },
                { icon: '💰', title: 'Финансы и аналитика' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4">
                  <p className="text-2xl">{item.icon}</p>
                  <p className="text-sm mt-2">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== PRODUCT CARD ====================
function ProductCard({ product }: { product: Product }) {
  const { store } = useStore();
  const seller = store.users.find(u => u.id === product.sellerId);

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all">
      <div className="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
        <span className="text-7xl group-hover:scale-110 transition-transform">{product.emoji}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{product.category}</span>
          {product.rating > 0 && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>}
        </div>
        <h3 className="font-semibold text-stone-800 group-hover:text-rose-600">{product.name}</h3>
        <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
          <div className="flex items-center gap-1 text-xs text-stone-500"><Clock className="w-3 h-3" /> {product.prepTime}</div>
        </div>
        <p className="text-xs text-stone-500 mt-2">{seller?.name} · {product.weight}</p>
      </div>
    </Link>
  );
}

// ==================== CATALOG PAGE ====================
export function CatalogPage() {
  const { store } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState('popular');
  const categories = ['Все', 'Торты', 'Пирожные', 'Свадебные', 'Детские', 'Декор'];

  const filtered = useMemo(() => {
    let result = store.products.filter(p => p.available);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'Все') result = result.filter(p => p.category === category);
    if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [store.products, search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Каталог</h1>
      <p className="text-stone-600 mb-8">Торты, десерты, декор и услуги</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm">
          <option value="popular">По популярности</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium ${category === cat ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-300'}`}>{cat}</button>
        ))}
      </div>

      <p className="text-sm text-stone-500 mb-4">Найдено: {filtered.length}</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Ничего не найдено</h3>
          <p className="text-stone-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}

// ==================== PRODUCT PAGE ====================
export function ProductPage() {
  const { id } = useParams();
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const product = store.products.find(p => p.id === id);
  const [added, setAdded] = useState(false);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><h2>Товар не найден</h2><Link to="/catalog" className="text-rose-600">← В каталог</Link></div>;

  const seller = store.users.find(u => u.id === product.sellerId);
  const handleAdd = () => {
    setStore(s => {
      const existing = s.cart.find(c => c.productId === product.id);
      if (existing) {
        return { ...s, cart: s.cart.map(c => c.productId === product.id ? { ...c, qty: c.qty + 1 } : c) };
      }
      return { ...s, cart: [...s.cart, { productId: product.id, name: product.name, price: product.price, qty: 1, sellerId: product.sellerId }] };
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-rose-600 mb-6"><ArrowLeft className="w-4 h-4" /> В каталог</Link>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-[180px]">{product.emoji}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-stone-100 px-2.5 py-1 rounded-full text-stone-600">{product.category}</span>
            {product.rating > 0 && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> {product.rating}</span>}
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800">{product.name}</h1>
          <p className="text-stone-600 mt-2">{seller?.name}</p>

          <div className="mt-6"><span className="text-3xl font-bold">{product.price.toLocaleString()} ₽</span></div>

          <p className="mt-6 text-stone-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Вес</p><p className="font-semibold">{product.weight}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Порций</p><p className="font-semibold">{product.portions}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Срок</p><p className="font-semibold">{product.prepTime}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Наличие</p><p className={`font-semibold ${product.available ? 'text-emerald-600' : 'text-rose-600'}`}>{product.available ? 'Доступен' : 'Нет'}</p></div>
          </div>

          {product.allergens.length > 0 && (
            <div className="mt-6 flex items-start gap-2 bg-amber-50 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div><p className="text-sm font-medium">Аллергены</p><p className="text-xs text-stone-600 mt-0.5">{product.allergens.join(', ')}</p></div>
            </div>
          )}

          <button onClick={handleAdd} disabled={!product.available} className={`w-full mt-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${product.available ? (added ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white hover:bg-rose-700') : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>
            <ShoppingCart className="w-5 h-5" />{added ? 'Добавлено!' : 'В корзину'}
          </button>

          {seller && (
            <div className="mt-6 bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold">{seller.name.charAt(0)}</span></div>
              <div className="flex-1"><p className="font-medium text-sm">{seller.name}</p><p className="text-xs text-stone-500">{seller.city}</p></div>
              <Link to="/chat" className="text-sm text-rose-600 font-medium">Написать</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== CONSTRUCTOR PAGE ====================
export function ConstructorPage() {
  const currentUser = useCurrentUser();
  const { setStore } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: 'Торт', shape: 'Круглый', weight: 2, portions: 10,
    layers: [] as string[], filling: '', cream: '', coating: '',
    decor: [] as string[], inscription: '', deliveryDate: '', notes: '',
  });

  const price = 1500 + (form.weight * 1200) + (form.decor.length * 500) + (form.coating ? 800 : 0);

  const handleSave = () => {
    if (!currentUser) { navigate('/auth'); return; }
    setStore(s => ({
      ...s,
      cakeProjects: [...s.cakeProjects, {
        id: 'cp' + Date.now(),
        userId: currentUser.id,
        ...form,
        price,
      }]
    }));
    alert('Проект сохранён!');
    navigate('/projects');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Конструктор торта</h1>
      <p className="text-stone-600 mb-8">Создайте торт вашей мечты — мы рассчитаем стоимость</p>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {['Категория', 'Размер', 'Начинка', 'Декор', 'Детали'].map((label, i) => (
          <button key={i} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${step === i + 1 ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6">
          {step === 1 && (
            <div>
              <h3 className="font-semibold mb-4">Категория изделия</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Торт', 'Капкейки', 'Макаруны', 'Чизкейк', 'Муссовый', 'Безе'].map(cat => (
                  <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`p-4 rounded-xl border text-sm font-medium ${form.category === cat ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-stone-200 hover:border-rose-300'}`}>{cat}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-semibold mb-4">Форма и размер</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Круглый', 'Квадратный', 'Сердце'].map(s => (
                  <button key={s} onClick={() => setForm({ ...form, shape: s })} className={`p-4 rounded-xl border text-sm ${form.shape === s ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-stone-200'}`}>{s}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Вес (кг)</label><input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
                <div><label className="text-sm font-medium mb-1 block">Порций</label><input type="number" value={form.portions} onChange={(e) => setForm({ ...form, portions: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Начинка и крем</h3>
              <div><label className="text-sm font-medium mb-2 block">Коржи</label>
                <div className="flex flex-wrap gap-2">
                  {['Медовый', 'Шоколадный', 'Ванильный', 'Красный бархат', 'Морковный'].map(l => (
                    <button key={l} onClick={() => setForm({ ...form, layers: form.layers.includes(l) ? form.layers.filter(x => x !== l) : [...form.layers, l] })} className={`px-3 py-1.5 rounded-full text-xs ${form.layers.includes(l) ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Начинка</label>
                <select value={form.filling} onChange={(e) => setForm({ ...form, filling: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                  <option value="">Выберите...</option><option>Ягодная</option><option>Шоколадная</option><option>Карамельная</option><option>Фисташковая</option>
                </select>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Крем</label>
                <select value={form.cream} onChange={(e) => setForm({ ...form, cream: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                  <option value="">Выберите...</option><option>Сметанный</option><option>Маскарпоне</option><option>Шоколадный</option><option>Сливочный</option>
                </select>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Покрытие</label>
                <select value={form.coating} onChange={(e) => setForm({ ...form, coating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                  <option value="">Без покрытия</option><option>Крем-чиз</option><option>Шоколадная глазурь</option><option>Мастика</option>
                </select>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="font-semibold mb-4">Декор</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Живые цветы', 'Ягоды', 'Макаруны', 'Шоколадный декор', 'Безе', 'Топпер', 'Надпись', 'Фигурки'].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, decor: form.decor.includes(d) ? form.decor.filter(x => x !== d) : [...form.decor, d] })} className={`px-3 py-1.5 rounded-full text-xs ${form.decor.includes(d) ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>{d}</button>
                ))}
              </div>
              <div><label className="text-sm font-medium mb-1 block">Надпись</label><input type="text" value={form.inscription} onChange={(e) => setForm({ ...form, inscription: e.target.value })} placeholder="С Днём Рождения!" className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Детали заказа</h3>
              <div><label className="text-sm font-medium mb-1 block">Дата доставки</label><input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
              <div><label className="text-sm font-medium mb-1 block">Комментарий</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-stone-200 resize-none" /></div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-lg border border-stone-200 text-sm font-medium">← Назад</button>}
            {step < 5 ? <button onClick={() => setStep(step + 1)} className="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">Далее →</button> : <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">Сохранить проект</button>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-stone-50 rounded-2xl border border-rose-200 p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Ваш торт</h3>
          <div className="text-6xl text-center mb-4">🎂</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Категория:</span><span className="font-medium">{form.category}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Форма:</span><span className="font-medium">{form.shape}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Вес:</span><span className="font-medium">{form.weight} кг</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Порций:</span><span className="font-medium">{form.portions}</span></div>
            {form.layers.length > 0 && <div className="flex justify-between"><span className="text-stone-500">Коржи:</span><span className="font-medium text-right">{form.layers.join(', ')}</span></div>}
            {form.filling && <div className="flex justify-between"><span className="text-stone-500">Начинка:</span><span className="font-medium">{form.filling}</span></div>}
            {form.cream && <div className="flex justify-between"><span className="text-stone-500">Крем:</span><span className="font-medium">{form.cream}</span></div>}
            {form.decor.length > 0 && <div className="flex justify-between"><span className="text-stone-500">Декор:</span><span className="font-medium text-right">{form.decor.join(', ')}</span></div>}
          </div>
          <hr className="my-4 border-rose-200" />
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Итого:</span>
            <span className="text-2xl font-bold text-rose-600">{price.toLocaleString()} ₽</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">Точная цена после согласования с кондитером</p>
        </div>
      </div>
    </div>
  );
}

// ==================== CART PAGE ====================
export function CartPage() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const total = store.cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (store.cart.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
      <Link to="/catalog" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700 mt-4">В каталог</Link>
    </div>
  );

  const handleCheckout = () => {
    if (!currentUser) { navigate('/auth'); return; }
    if (!deliveryDate) { alert('Укажите дату доставки'); return; }
    
    const newOrders = store.cart.map(item => ({
      id: 'ORD-' + Date.now() + Math.floor(Math.random() * 1000),
      buyerId: currentUser.id,
      sellerId: item.sellerId,
      productId: item.productId,
      productName: item.name,
      status: 'new' as const,
      total: item.price * item.qty,
      deliveryDate,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    
    setStore(s => ({ ...s, orders: [...s.orders, ...newOrders], cart: [] }));
    alert(`Заказ оформлен!`);
    navigate('/dashboard/orders');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Корзина</h1>
      <div className="space-y-3 mb-6">
        {store.cart.map(item => (
          <div key={item.productId} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">🎂</div>
            <div className="flex-1"><h3 className="font-medium text-sm">{item.name}</h3><p className="text-xs text-stone-500">Количество: {item.qty}</p></div>
            <div className="text-right"><p className="font-bold">{(item.price * item.qty).toLocaleString()} ₽</p><button onClick={() => setStore(s => ({ ...s, cart: s.cart.filter(c => c.productId !== item.productId) }))} className="text-xs text-rose-600 hover:underline mt-1">Удалить</button></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
        <div><label className="text-sm font-medium mb-1 block">Дата доставки</label><input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm" /></div>
        <div><label className="text-sm font-medium mb-1 block">Комментарий</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none" /></div>
        <div className="flex justify-between items-center pt-3 border-t border-stone-200"><span className="text-stone-500">Итого:</span><span className="text-2xl font-bold">{total.toLocaleString()} ₽</span></div>
        <button onClick={handleCheckout} className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-medium hover:bg-rose-700">Оформить заказ</button>
        <button onClick={() => setStore(s => ({ ...s, cart: [] }))} className="w-full py-2 text-sm text-stone-500 hover:text-rose-600">Очистить корзину</button>
      </div>
    </div>
  );
}

// ==================== AUTH PAGE ====================
export function AuthPage() {
  const { store, setStore } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'confectioner' | 'supplier' | 'decorator' | 'animator' | 'organizer' | 'florist' | 'photographer' | 'host' | 'caterer' | 'venue' | 'courier' | 'corporate'>('client');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        setStore(s => ({ ...s, currentUserId: user.id }));
        navigate('/');
      } else {
        setError('Пользователь не найден. Попробуйте: anna@conditera.ru, maria@mail.ru, admin@conditera.ru');
      }
    } else {
      if (!name || !email) { setError('Заполните все поля'); return; }
      if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) { setError('Email уже зарегистрирован'); return; }
      const newUser = { id: 'u' + Date.now(), email, name, role, joinedAt: new Date().toISOString().split('T')[0] };
      setStore(s => ({ ...s, users: [...s.users, newUser], currentUserId: newUser.id }));
      navigate('/');
    }
  };

  const quickLogin = (email: string) => {
    const user = store.users.find(u => u.email === email);
    if (user) {
      setStore(s => ({ ...s, currentUserId: user.id }));
      navigate('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-3xl">C</span></div>
          <h1 className="font-display text-2xl font-bold text-stone-800">{mode === 'login' ? 'Вход в Conditera' : 'Регистрация'}</h1>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="space-y-2 mb-4">
            <p className="text-xs text-stone-500 mb-2">Быстрый вход (демо):</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin('maria@mail.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">👤 Клиент</button>
              <button onClick={() => quickLogin('anna@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🎂 Кондитер</button>
              <button onClick={() => quickLogin('supplier@moloko.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">📦 Поставщик</button>
              <button onClick={() => quickLogin('admin@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🛡️ Админ</button>
              <button onClick={() => quickLogin('super@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">👑 Super Admin</button>
              <button onClick={() => quickLogin('moderator@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🔍 Модератор</button>
              <button onClick={() => quickLogin('operator@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🎧 Оператор</button>
              <button onClick={() => quickLogin('support@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">💬 Поддержка</button>
              <button onClick={() => quickLogin('flora@lavanda.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🌸 Флорист</button>
              <button onClick={() => quickLogin('photo@objectiv.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">📸 Фотограф</button>
              <button onClick={() => quickLogin('host@prazdnik.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🎤 Ведущий</button>
              <button onClick={() => quickLogin('catering@vkusno.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🍽️ Кейтеринг</button>
              <button onClick={() => quickLogin('venue@beliySad.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🏛️ Площадка</button>
              <button onClick={() => quickLogin('courier@delivery.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🚚 Курьер</button>
              <button onClick={() => quickLogin('corp@company.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🏢 Корпоративный</button>
              <button onClick={() => quickLogin('anim@fun.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🎭 Аниматор</button>
            </div>
          </div>

          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div><div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-stone-500">или</span></div></div>

          {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm">
                  <option value="client">Клиент</option>
                  <option value="confectioner">Кондитер</option>
                  <option value="supplier">Поставщик ингредиентов</option>
                  <option value="decorator">Магазин декора</option>
                  <option value="animator">Аниматор</option>
                  <option value="organizer">Организатор мероприятий</option>
                  <option value="florist">Флорист</option>
                  <option value="photographer">Фотограф</option>
                  <option value="host">Ведущий</option>
                  <option value="caterer">Кейтеринг</option>
                  <option value="venue">Площадка</option>
                  <option value="courier">Курьер</option>
                  <option value="corporate">Корпоративный клиент</option>
                </select>
              </>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <button type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-4">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-rose-600 font-medium hover:underline">{mode === 'login' ? 'Регистрация' : 'Войти'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== CHAT PAGE ====================
export function ChatPage() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [input, setInput] = useState('');

  if (!currentUser) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p>Войдите, чтобы общаться</p><Link to="/auth" className="text-rose-600">Войти</Link></div>;

  const myConvs = store.conversations.filter(c => c.participants.includes(currentUser.id));
  const activeMessages = activeConv ? store.messages.filter(m => m.conversationId === activeConv) : [];
  const activeConvData = store.conversations.find(c => c.id === activeConv);
  const otherUserId = activeConvData?.participants.find(p => p !== currentUser.id);
  const otherUser = otherUserId ? store.users.find(u => u.id === otherUserId) : null;

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    setStore(s => ({
      ...s,
      messages: [...s.messages, { id: 'm' + Date.now(), conversationId: activeConv, senderId: currentUser.id, text: input.trim(), time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }],
      conversations: s.conversations.map(c => c.id === activeConv ? { ...c, lastMessage: input.trim() } : c)
    }));
    setInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Сообщения</h1>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        <div className="border-r border-stone-200 overflow-y-auto">
          {myConvs.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone-500">Нет диалогов</div>
          ) : myConvs.map(conv => {
            const other = store.users.find(u => u.id === conv.participants.find(p => p !== currentUser.id));
            return (
              <button key={conv.id} onClick={() => setActiveConv(conv.id)} className={`w-full text-left p-4 border-b border-stone-100 hover:bg-stone-50 ${activeConv === conv.id ? 'bg-rose-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{other?.name.charAt(0)}</span></div>
                  <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{other?.name}</p><p className="text-xs text-stone-500 truncate">{conv.lastMessage}</p></div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="md:col-span-2 flex flex-col">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-stone-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{otherUser?.name.charAt(0)}</span></div>
                <div><p className="font-medium text-sm">{otherUser?.name}</p><p className="text-xs text-emerald-600">● Онлайн</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.senderId === currentUser.id ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.senderId === currentUser.id ? 'text-white/70' : 'text-stone-500'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-stone-200">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Сообщение..." className="flex-1 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">Выберите диалог</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== EVENTS PAGE ====================
export function EventsPage() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', location: '', budget: 0 });

  const handleCreate = () => {
    if (!currentUser || !form.name || !form.date) return;
    setStore(s => ({ ...s, events: [...s.events, { id: 'e' + Date.now(), organizerId: currentUser.id, ...form, tasks: [] }] }));
    setShowForm(false);
    setForm({ name: '', date: '', location: '', budget: 0 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl font-bold text-stone-800">Мероприятия</h1><p className="text-stone-600 mt-1">Планируйте и управляйте событиями</p></div>
        {currentUser && <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Создать</button>}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Место" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} placeholder="Бюджет" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
          </div>
          <div className="flex gap-3 mt-4"><button onClick={handleCreate} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Создать</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="space-y-6">
        {store.events.map(event => {
          const doneTasks = event.tasks.filter(t => t.done).length;
          const progress = event.tasks.length > 0 ? Math.round((doneTasks / event.tasks.length) * 100) : 0;
          return (
            <div key={event.id} className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="font-display text-xl font-bold">{event.name}</h2><div className="flex items-center gap-4 text-sm text-stone-500 mt-1"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span><span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span><span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {event.budget.toLocaleString()} ₽</span></div></div>
                <div className="text-right"><p className="text-2xl font-bold">{progress}%</p><p className="text-xs text-stone-500">{doneTasks} из {event.tasks.length}</p></div>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 mb-4"><div className="bg-rose-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
              <div className="space-y-2">
                {event.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                    <button onClick={() => setStore(s => ({ ...s, events: s.events.map(e => e.id === event.id ? { ...e, tasks: e.tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t) } : e) }))}>{task.done ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-stone-400" />}</button>
                    <span className={`text-sm flex-1 ${task.done ? 'line-through text-stone-400' : ''}`}>{task.title}</span>
                    {task.assignee && <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full">{task.assignee}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {store.events.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📅</div><h3 className="text-lg font-semibold mb-2">Нет мероприятий</h3><p className="text-stone-500">Создайте первое мероприятие</p></div>}
      </div>
    </div>
  );
}

// ==================== B2B PAGE ====================
export function B2BPage() {
  const { store } = useStore();
  const suppliers = store.users.filter(u => ['supplier', 'decorator'].includes(u.role));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Партнёрам</h1>
      <p className="text-stone-600 mb-8">Поставщики, декор, оборудование и услуги</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Briefcase className="w-5 h-5 text-purple-600" /></div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-600">Активен</span>
            </div>
            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</p>
            <p className="text-xs text-stone-500 mt-2">{p.about}</p>
            <p className="text-xs text-rose-600 mt-3">{p.role === 'supplier' ? 'Поставщик' : 'Магазин декора'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
