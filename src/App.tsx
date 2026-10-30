import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer, DashboardSidebar } from './components/Layout';
import { products, orders, recipes, inventory, customers, b2bPartners, events, chatMessages } from './data/mockData';
import { Search, ArrowRight, Star, Clock, Shield, Users, ChefHat, Sparkles, SlidersHorizontal, ShoppingCart, Heart, Share2, AlertTriangle, Plus, Edit3, Eye, EyeOff, Calculator, ChevronDown, ChevronUp, ArrowUpCircle, ArrowDownCircle, Mail, Phone, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, MapPin, Briefcase, Calendar, CheckCircle, Circle, Send, Bot, MessageCircle, LogOut, Package } from 'lucide-react';

// HomePage
function HomePage() {
  const navigate = useNavigate();
  const featured = products.filter(p => p.available).slice(0, 6);
  const occasions = ['День рождения', 'Свадьба', 'Юбилей', 'Детский праздник'];

  return (
    <div>
      <section className="bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl font-bold text-stone-800 mb-6">Торты и десерты от лучших кондитеров</h1>
            <p className="text-xl text-stone-600 mb-8">Находите уникальные торты для любого повода. Заказывайте напрямую у кондитеров.</p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/catalog')} className="bg-rose-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-rose-700 shadow-lg">Найти торт</button>
              <Link to="/auth" className="bg-white text-stone-800 px-8 py-4 rounded-xl font-medium hover:bg-stone-50 border border-stone-300">Стать кондитером</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-serif text-3xl font-bold text-stone-800 mb-8">Популярные торты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all">
              <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform">{product.images[0]}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{product.category}</span>
                  {product.rating && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>}
                </div>
                <h3 className="font-semibold text-stone-800 group-hover:text-rose-600">{product.name}</h3>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
                  <span className="text-xs text-stone-500">{product.weight}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-stone-800 text-center mb-12">Почему Conditera</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Проверенные кондитеры', desc: 'Каждый продавец проходит верификацию' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Уникальные рецепты', desc: 'Авторские торты, которых нет в магазинах' },
              { icon: <Users className="w-6 h-6" />, title: 'Прямое общение', desc: 'Обсуждайте детали напрямую с кондитером' },
              { icon: <ChefHat className="w-6 h-6" />, title: 'Гарантия качества', desc: 'Контроль качества на каждом этапе' },
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
    </div>
  );
}

// CatalogPage
function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const categories = ['Все', 'Торты', 'Пирожные', 'Свадебные', 'Детские'];

  const filtered = useMemo(() => {
    let result = products.filter(p => p.status === 'published');
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== 'Все') result = result.filter(p => p.category === selectedCategory);
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Каталог тортов и десертов</h1>
      <p className="text-stone-600 mb-8">Найдите идеальный торт для любого повода</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === cat ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-300'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all">
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center">
              <span className="text-7xl group-hover:scale-110 transition-transform">{product.images[0]}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{product.category}</span>
                {product.rating && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>}
              </div>
              <h3 className="font-semibold text-stone-800 group-hover:text-rose-600">{product.name}</h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
                <span className="text-xs text-stone-500">{product.seller}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ProductPage
function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useApp();
  const product = products.find(p => p.id === id);
  const [added, setAdded] = useState(false);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><h2 className="text-xl font-semibold">Товар не найден</h2><Link to="/catalog" className="text-rose-600 hover:underline mt-4 inline-block">Вернуться в каталог</Link></div>;

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-rose-600 mb-6"><ArrowRight className="w-4 h-4 rotate-180" /> Назад в каталог</Link>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-stone-100 rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-[150px]">{product.images[0]}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-stone-100 px-2.5 py-1 rounded-full text-stone-600">{product.category}</span>
            {product.rating && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> {product.rating}</span>}
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">{product.name}</h1>
          <p className="text-stone-600 mt-2">{product.seller}</p>

          <div className="mt-6"><span className="text-3xl font-bold">{product.price.toLocaleString()} ₽</span></div>

          <p className="mt-6 text-stone-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Вес</p><p className="font-semibold">{product.weight}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Порций</p><p className="font-semibold">{product.portions}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Срок изготовления</p><p className="font-semibold">{product.prepTime}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Доступность</p><p className={`font-semibold ${product.available ? 'text-emerald-600' : 'text-rose-600'}`}>{product.available ? 'Доступен' : 'Нет в наличии'}</p></div>
          </div>

          {product.allergens.length > 0 && (
            <div className="mt-6 flex items-start gap-2 bg-amber-50 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div><p className="text-sm font-medium">Аллергены</p><p className="text-xs text-stone-600 mt-0.5">{product.allergens.join(', ')}</p></div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button onClick={handleAddToCart} disabled={!product.available} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium ${product.available ? (added ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white hover:bg-rose-700') : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>
              <ShoppingCart className="w-5 h-5" />{added ? 'Добавлено!' : 'В корзину'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// DashboardPage
function DashboardPage() {
  const newOrders = orders.filter(o => o.status === 'new');
  const activeOrders = orders.filter(o => ['accepted', 'in_production'].includes(o.status));
  const lowStock = inventory.filter(i => i.stock <= i.minStock);
  const todayRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-stone-800">Добро пожаловать, Анна!</h1>
        <p className="text-stone-600 text-sm mt-1">Вот что происходит в вашем бизнесе сегодня</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Новые заказы', value: newOrders.length, icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-rose-100 text-rose-600' },
          { label: 'В производстве', value: activeOrders.length, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
          { label: 'Выручка (сегодня)', value: `${todayRevenue.toLocaleString()} ₽`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Товаров активно', value: products.filter(p => p.status === 'published').length, icon: <Package className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Последние заказы</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
              <div>
                <p className="text-sm font-medium">{order.productName}</p>
                <p className="text-xs text-stone-500">{order.customer} · {order.deliveryDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{order.total.toLocaleString()} ₽</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'new' ? 'bg-rose-100 text-rose-600' : order.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>
                  {order.status === 'new' ? 'Новый' : order.status === 'completed' ? 'Завершён' : 'В работе'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// OrdersPage
function OrdersPage() {
  const statusLabels: Record<string, string> = { new: 'Новый', accepted: 'Принят', in_production: 'Готовится', ready: 'Готов', completed: 'Завершён', cancelled: 'Отменён' };

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-stone-800 mb-6">Заказы</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-stone-500">{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'new' ? 'bg-rose-100 text-rose-600' : order.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>{statusLabels[order.status]}</span>
                </div>
                <h3 className="font-semibold text-stone-800">{order.productName}</h3>
                <p className="text-sm text-stone-500 mt-1">Покупатель: {order.customer}</p>
                <p className="text-sm text-stone-500">Доставка: {order.deliveryDate}</p>
              </div>
              <span className="text-lg font-bold">{order.total.toLocaleString()} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ProductsPage
function ProductsPage() {
  const myProducts = products.filter(p => p.sellerId === 's1');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-stone-800">Мои товары</h1>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Добавить товар</button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Товар</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Категория</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Цена</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Статус</th></tr></thead>
          <tbody>
            {myProducts.map(product => (
              <tr key={product.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-50">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xl">{product.images[0]}</div><div><p className="font-medium text-sm">{product.name}</p><p className="text-xs text-stone-500">{product.weight}</p></div></div></td>
                <td className="px-5 py-4 text-sm text-stone-500">{product.category}</td>
                <td className="px-5 py-4 text-sm font-semibold">{product.price.toLocaleString()} ₽</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${product.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{product.status === 'published' ? 'Опубликован' : 'Черновик'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// RecipesPage
function RecipesPage() {
  const totalCost = (recipe: typeof recipes[0]) => recipe.ingredients.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-stone-800">Рецепты</h1>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Новый рецепт</button>
      </div>

      <div className="space-y-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-stone-800">{recipe.name}</h3>
                <p className="text-xs text-stone-500">Выход: {recipe.yield}</p>
              </div>
              <div className="text-right"><p className="text-sm font-bold">{totalCost(recipe).toLocaleString()} ₽</p><p className="text-xs text-stone-500">себестоимость</p></div>
            </div>
            <table className="w-full">
              <tbody>
                {recipe.ingredients.map((ing, i) => (
                  <tr key={i} className="border-t border-stone-100"><td className="py-2 text-sm">{ing.name}</td><td className="py-2 text-sm text-right text-stone-500">{ing.amount} {ing.unit}</td><td className="py-2 text-sm text-right font-medium">{ing.cost} ₽</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// InventoryPage
function InventoryPage() {
  const lowStock = inventory.filter(i => i.stock <= i.minStock);

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-stone-800 mb-6">Склад</h1>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div><p className="text-sm font-medium text-stone-800">Внимание: дефицит ингредиентов</p><p className="text-xs text-stone-600 mt-1">{lowStock.map(i => i.name).join(', ')}</p></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Ингредиент</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Остаток</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Мин. остаток</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Цена за ед.</th></tr></thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className={`border-b border-stone-200 last:border-0 ${item.stock <= item.minStock ? 'bg-rose-50' : ''}`}>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2">{item.stock <= item.minStock && <AlertTriangle className="w-4 h-4 text-amber-600" />}<span className="text-sm font-medium">{item.name}</span></div></td>
                <td className="px-5 py-3.5 text-right"><span className={`text-sm font-semibold ${item.stock <= item.minStock ? 'text-rose-600' : ''}`}>{item.stock} {item.unit}</span></td>
                <td className="px-5 py-3.5 text-right text-sm text-stone-500">{item.minStock} {item.unit}</td>
                <td className="px-5 py-3.5 text-right text-sm">{item.costPerUnit.toLocaleString()} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CustomersPage
function CustomersPage() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-stone-800 mb-6">Покупатели</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{customer.name.charAt(0)}</span></div>
              <div><h3 className="font-semibold text-sm">{customer.name}</h3><p className="text-xs text-stone-500">Последний заказ: {customer.lastOrder}</p></div>
            </div>
            <div className="space-y-1.5 text-xs text-stone-500">
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {customer.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {customer.phone}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200">
              <div className="text-center"><p className="text-sm font-bold">{customer.ordersCount}</p><p className="text-[10px] text-stone-500">заказов</p></div>
              <div className="text-center"><p className="text-sm font-bold">{customer.totalSpent.toLocaleString()} ₽</p><p className="text-[10px] text-stone-500">потрачено</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FinancePage
function FinancePage() {
  const completed = orders.filter(o => o.status === 'completed');
  const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
  const commission = Math.round(totalRevenue * 0.08);
  const netIncome = totalRevenue - commission;

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-stone-800 mb-6">Финансы</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Выручка</p><p className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Комиссия (8%)</p><p className="text-2xl font-bold">{commission.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">К выплате</p><p className="text-2xl font-bold text-emerald-600">{netIncome.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Заказов завершено</p><p className="text-2xl font-bold">{completed.length}</p></div>
      </div>
    </div>
  );
}

// AIAssistantPage
function AIAssistantPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Bot className="w-6 h-6 text-purple-600" /></div>
        <div><h1 className="font-serif text-2xl font-bold text-stone-800">AI-помощник</h1><p className="text-xs text-stone-500">Демо-режим · Ollama не подключена</p></div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <Bot className="w-16 h-16 text-purple-300 mx-auto mb-4" />
        <h3 className="font-semibold text-stone-800 mb-2">AI-помощник в демо-режиме</h3>
        <p className="text-sm text-stone-500">Для работы с реальным AI подключите локальный Ollama</p>
      </div>
    </div>
  );
}

// B2BPage
function B2BPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Профессиональные партнёры</h1>
      <p className="text-stone-600 mb-8">Найдите поставщиков и специалистов для вашего бизнеса</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {b2bPartners.map(partner => (
          <div key={partner.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Briefcase className="w-5 h-5 text-purple-600" /></div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${partner.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{partner.status === 'active' ? 'Активен' : 'На проверке'}</span>
            </div>
            <h3 className="font-semibold text-sm">{partner.name}</h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{partner.region}</p>
            <p className="text-xs text-stone-500 mt-2 line-clamp-2">{partner.description}</p>
            <p className="text-xs text-rose-600 mt-3">{partner.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// EventPlannerPage
function EventPlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Планировщик мероприятий</h1>
      <div className="space-y-6">
        {events.map(event => {
          const doneTasks = event.tasks.filter(t => t.done).length;
          const progress = event.tasks.length > 0 ? Math.round((doneTasks / event.tasks.length) * 100) : 0;
          return (
            <div key={event.id} className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="font-serif text-xl font-bold">{event.name}</h2><div className="flex items-center gap-4 text-sm text-stone-500 mt-1"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span><span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span></div></div>
                <div className="text-right"><p className="text-2xl font-bold">{progress}%</p><p className="text-xs text-stone-500">{doneTasks} из {event.tasks.length}</p></div>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 mb-4"><div className="bg-rose-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
              <div className="space-y-2">
                {event.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                    {task.done ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-stone-400" />}
                    <span className={`text-sm flex-1 ${task.done ? 'line-through text-stone-400' : ''}`}>{task.title}</span>
                    {task.assignee && <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-500">{task.assignee}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ChatPage
function ChatPage() {
  const { messages, sendMessage } = useApp();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">А</span></div>
          <div><h2 className="font-semibold text-sm">Анна Пекарская</h2><p className="text-xs text-emerald-600">● Онлайн</p></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === 'user' ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-stone-500'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Напишите сообщение..." className="flex-1 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AuthPage
function AuthPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: 'buyer' | 'seller') => {
    login(role);
    navigate(role === 'seller' ? '/dashboard' : '/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-3xl">C</span></div>
          <h1 className="font-serif text-2xl font-bold text-stone-800">Вход в Conditera</h1>
          <p className="text-stone-600 mt-2">Войдите в свой аккаунт</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium bg-yellow-400 text-black hover:bg-yellow-500"><span>Я</span><span>Войти через Яндекс ID</span></button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700"><span>VK</span><span>Войти через VK ID</span></button>
          </div>

          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div><div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-stone-500">или через email</span></div></div>

          <div className="space-y-4">
            <div><label className="text-sm font-medium text-stone-700 mb-1 block">Email</label><input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300" /></div>
            <div><label className="text-sm font-medium text-stone-700 mb-1 block">Пароль</label><input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300" /></div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleLogin('buyer')} className="bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700">Войти как покупатель</button>
              <button onClick={() => handleLogin('seller')} className="bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700">Войти как кондитер</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CartPage
function CartPage() {
  const { cart, removeFromCart, clearCart } = useApp();
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Корзина пуста</h2>
        <p className="text-sm text-stone-500 mb-6">Добавьте торты из каталога</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-stone-800 mb-6">Корзина</h1>
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">🎂</div>
            <div className="flex-1"><h3 className="font-medium text-sm">{item.name}</h3><p className="text-xs text-stone-500">Количество: {item.qty}</p></div>
            <div className="text-right"><p className="font-bold">{(item.price * item.qty).toLocaleString()} ₽</p><button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-600 hover:underline mt-1">Удалить</button></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4"><span className="text-stone-500">Итого:</span><span className="text-2xl font-bold">{total.toLocaleString()} ₽</span></div>
        <button className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-medium hover:bg-rose-700">Оформить заказ</button>
        <button onClick={clearCart} className="w-full mt-3 py-2 text-sm text-stone-500 hover:text-rose-600">Очистить корзину</button>
      </div>
    </div>
  );
}

// Main App
function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <>
        <Header />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto bg-stone-50">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/orders" element={<OrdersPage />} />
              <Route path="/dashboard/products" element={<ProductsPage />} />
              <Route path="/dashboard/recipes" element={<RecipesPage />} />
              <Route path="/dashboard/inventory" element={<InventoryPage />} />
              <Route path="/dashboard/customers" element={<CustomersPage />} />
              <Route path="/dashboard/finance" element={<FinancePage />} />
              <Route path="/dashboard/ai" element={<AIAssistantPage />} />
            </Routes>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/b2b" element={<B2BPage />} />
          <Route path="/events" element={<EventPlannerPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-stone-50">
          <AppRoutes />
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
