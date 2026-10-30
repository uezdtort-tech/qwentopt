import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, LogOut, ChevronDown, MessageCircle, Home, Package, FileText, Users, DollarSign, CalendarDays, User, Heart, Shield, BarChart3 } from 'lucide-react';
import { useStore, useCurrentUser } from './store';

export function Header() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartCount = store.cart.reduce((s, c) => s + c.qty, 0);
  const isDashboard = location.pathname.startsWith('/dashboard');

  const roleNames: Record<string, string> = {
    client: 'Клиент', confectioner: 'Кондитер', supplier: 'Поставщик',
    decorator: 'Декоратор', animator: 'Аниматор', organizer: 'Организатор', admin: 'Администратор'
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-display text-xl font-bold text-stone-800 hidden sm:block">Conditera</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Главная</Link>
          <Link to="/catalog" className={`text-sm font-medium ${location.pathname.startsWith('/catalog') ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Каталог</Link>
          <Link to="/constructor" className={`text-sm font-medium ${location.pathname === '/constructor' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Конструктор</Link>
          <Link to="/events" className={`text-sm font-medium ${location.pathname === '/events' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Мероприятия</Link>
          <Link to="/b2b" className={`text-sm font-medium ${location.pathname === '/b2b' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Партнёрам</Link>
          {currentUser && (
            <Link to="/dashboard" className={`text-sm font-medium ${isDashboard ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Кабинет</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="p-2 hover:bg-stone-100 rounded-full relative">
            <ShoppingCart className="w-5 h-5 text-stone-600" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{cartCount}</span>}
          </Link>

          {currentUser ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-stone-100">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{currentUser.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium hidden sm:block text-stone-700">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-stone-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-stone-200">
                    <p className="text-sm font-semibold text-stone-800">{currentUser.name}</p>
                    <p className="text-xs text-stone-500">{currentUser.email}</p>
                    <p className="text-xs text-rose-600 mt-1">{roleNames[currentUser.role]}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Мой кабинет</Link>
                  <Link to="/chat" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Сообщения</Link>
                  <Link to="/projects" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Мои проекты</Link>
                  <hr className="my-1 border-stone-200" />
                  <button onClick={() => { setStore(s => ({ ...s, currentUserId: null })); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-stone-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700">Войти</Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 py-3 px-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Главная</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Каталог</Link>
            <Link to="/constructor" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Конструктор</Link>
            <Link to="/events" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Мероприятия</Link>
            <Link to="/b2b" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Партнёрам</Link>
            {currentUser && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Кабинет</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-stone-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold">C</span></div>
              <span className="font-display text-lg font-bold">Conditera</span>
            </div>
            <p className="text-sm text-stone-400">Цифровая экосистема для кондитерской индустрии</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Клиентам</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/catalog" className="hover:text-white">Каталог</Link></li>
              <li><Link to="/constructor" className="hover:text-white">Конструктор торта</Link></li>
              <li><Link to="/events" className="hover:text-white">Мероприятия</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Партнёрам</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/auth" className="hover:text-white">Стать кондитером</Link></li>
              <li><Link to="/b2b" className="hover:text-white">B2B</Link></li>
              <li><Link to="/auth" className="hover:text-white">Стать поставщиком</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Платформа</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white">О проекте</a></li>
              <li><a href="#" className="hover:text-white">Поддержка</a></li>
              <li><a href="#" className="hover:text-white">Условия</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-xs text-stone-500">
          © 2026 Conditera Next · Демо-версия с persistence в localStorage
        </div>
      </div>
    </footer>
  );
}

export function DashboardSidebar() {
  const currentUser = useCurrentUser();
  const location = useLocation();

  if (!currentUser) return null;

  const menus: Record<string, { to: string; label: string; icon: React.ReactNode }[]> = {
    confectioner: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Товары', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/recipes', label: 'Рецептуры', icon: <FileText className="w-4 h-4" /> },
      { to: '/dashboard/inventory', label: 'Склад', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
      { to: '/dashboard/customers', label: 'Клиенты', icon: <Users className="w-4 h-4" /> },
      { to: '/dashboard/production', label: 'Производство', icon: <CalendarDays className="w-4 h-4" /> },
    ],
    client: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Мои заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/favorites', label: 'Избранное', icon: <Heart className="w-4 h-4" /> },
      { to: '/dashboard/profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
    ],
    supplier: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Каталог', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
    ],
    organizer: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/events', label: 'Мероприятия', icon: <CalendarDays className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
    ],
    animator: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Бронирования', icon: <CalendarDays className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
    ],
    decorator: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Товары', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
    ],
    admin: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/users', label: 'Пользователи', icon: <Users className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Все заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/moderation', label: 'Модерация', icon: <Shield className="w-4 h-4" /> },
      { to: '/dashboard/analytics', label: 'Аналитика', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  };

  const items = menus[currentUser.role] || menus.client;

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-full hidden lg:block">
      <nav className="p-3 space-y-0.5">
        {items.map(item => (
          <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.to ? 'bg-rose-50 text-rose-600' : 'text-stone-600 hover:bg-stone-50'}`}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <hr className="my-3 border-stone-200" />
        <Link to="/chat" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/chat' ? 'bg-rose-50 text-rose-600' : 'text-stone-600 hover:bg-stone-50'}`}>
          <MessageCircle className="w-4 h-4" /> Сообщения
        </Link>
      </nav>
    </aside>
  );
}
