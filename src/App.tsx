import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { products } from './data/products';

function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Conditera</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}>Главная</Link>
          <Link to="/catalog" className={`text-sm font-medium ${isActive('/catalog') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}>Каталог</Link>
          <Link to="/dashboard" className={`text-sm font-medium ${isActive('/dashboard') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}>Кабинет</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link to="/auth" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700">
            Войти
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-lg font-bold">Conditera</span>
            </div>
            <p className="text-sm text-gray-400">Экосистема для кондитеров</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Покупателям</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/catalog" className="hover:text-white">Каталог</Link></li>
              <li><Link to="/catalog" className="hover:text-white">Свадебные торты</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Кондитерам</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard" className="hover:text-white">Кабинет</Link></li>
              <li><Link to="/auth" className="hover:text-white">Регистрация</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">О проекте</a></li>
              <li><a href="#" className="hover:text-white">Поддержка</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 Conditera Next
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const featured = products.slice(0, 6);
  
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-50 to-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Торты и десерты от лучших кондитеров
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Находите уникальные торты для любого повода. Заказывайте напрямую у кондитеров.
            </p>
            <div className="flex gap-4">
              <Link to="/catalog" className="bg-rose-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-rose-700 shadow-lg">
                Найти торт
              </Link>
              <Link to="/auth" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 border border-gray-300">
                Стать кондитером
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Популярные торты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-stone-100 flex items-center justify-center">
                <span className="text-8xl">{product.image}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-stone-100 px-2 py-1 rounded-full text-gray-600">{product.category}</span>
                  <span className="text-xs text-amber-500">⭐ {product.rating}</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
                  <span className="text-sm text-gray-500">{product.weight}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Почему Conditera</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Проверенные кондитеры</h3>
              <p className="text-gray-600">Каждый продавец проходит верификацию</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Уникальные рецепты</h3>
              <p className="text-gray-600">Авторские торты, которых нет в магазинах</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Прямое общение</h3>
              <p className="text-gray-600">Обсуждайте детали напрямую с кондитером</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог тортов и десертов</h1>
      <p className="text-gray-600 mb-8">Найдите идеальный торт для любого повода</p>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Поиск тортов..." 
          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-stone-100 flex items-center justify-center">
              <span className="text-8xl">{product.image}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-stone-100 px-2 py-1 rounded-full text-gray-600">{product.category}</span>
                <span className="text-xs text-amber-500">⭐ {product.rating}</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
                <span className="text-sm text-gray-500">{product.seller}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductPage() {
  const product = products[0];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/catalog" className="text-rose-600 hover:underline mb-6 inline-block">← Назад в каталог</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-stone-100 rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-[200px]">{product.image}</span>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-stone-100 px-3 py-1 rounded-full text-gray-600">{product.category}</span>
            <span className="text-sm text-amber-500">⭐ {product.rating}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.seller}</p>
          
          <div className="text-4xl font-bold text-gray-900 mb-6">{product.price.toLocaleString()} ₽</div>
          
          <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Вес</p>
              <p className="font-semibold">{product.weight}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Порций</p>
              <p className="font-semibold">{product.portions}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Срок изготовления</p>
              <p className="font-semibold">{product.prepTime}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Доступность</p>
              <p className="font-semibold text-emerald-600">В наличии</p>
            </div>
          </div>
          
          <button className="w-full bg-rose-600 text-white py-4 rounded-xl font-medium hover:bg-rose-700 shadow-lg">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Кабинет кондитера</h1>
      <p className="text-gray-600 mb-8">Добро пожаловать, Анна!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-rose-600 text-xl">📦</span>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-500">Новые заказы</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-amber-600 text-xl">⏱️</span>
          </div>
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-gray-500">В производстве</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-emerald-600 text-xl">💰</span>
          </div>
          <p className="text-2xl font-bold">24 800 ₽</p>
          <p className="text-sm text-gray-500">Выручка сегодня</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-purple-600 text-xl">🎂</span>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Товаров активно</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Последние заказы</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
              <div>
                <p className="font-medium">Заказ #{1000 + i}</p>
                <p className="text-sm text-gray-500">Медовик классический</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">2 800 ₽</p>
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">Новый</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Вход в Conditera</h1>
          <p className="text-gray-600 mt-2">Войдите в свой аккаунт</p>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium bg-yellow-400 text-black hover:bg-yellow-500">
              <span>Я</span>
              <span>Войти через Яндекс ID</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700">
              <span>VK</span>
              <span>Войти через VK ID</span>
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-500">или через email</span>
            </div>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Пароль</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700">
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
