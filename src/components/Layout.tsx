import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Search, Menu, X, LogOut, ChevronDown, MessageCircle } from 'lucide-react';

export function Header() {
  const { isAuthenticated, userRole, userName, cart, logout, switchView, notifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-rose-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-display text-xl font-bold text-stone-800 hidden sm:block">Conditera</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className={`text-sm font-medium transition-colors ${location.pathname === '/catalog' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Каталог</Link>
            <Link to="/b2b" className={`text-sm font-medium transition-colors ${location.pathname === '/b2b' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Партнёрам</Link>
            <Link to="/events" className={`text-sm font-medium transition-colors ${location.pathname === '/events' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Мероприятия</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Кабинет</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/catalog')} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-stone-600" />
            </button>
            <Link to="/chat" className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
              <MessageCircle className="w-5 h-5 text-stone-600" />
              {notifications > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 rounded-full text-[10px] text-white flex items-center justify-center">{notifications}</span>}
            </Link>
            <Link to="/cart" className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-stone-600" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 rounded-full text-[10px] text-white flex items-center justify-center">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
                  <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{userName.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{userName.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-stone-600" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-stone-200">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-stone-500 capitalize">{userRole === 'seller' ? 'Кондитер' : userRole === 'buyer' ? 'Покупатель' : 'Администратор'}</p>
                    </div>
                    {(userRole === 'seller' || userRole === 'admin') && (
                      <button onClick={() => { switchView('dashboard'); navigate('/dashboard'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors">Кабинет</button>
                    )}
                    <button onClick={() => { switchView('public'); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors">Публичная часть</button>
                    <hr className="my-1 border-stone-200" />
                    <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-stone-50 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">Войти</Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-stone-100 rounded-lg">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100">Каталог</Link>
              <Link to="/b2b" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100">Партнёрам</Link>
              <Link to="/events" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100">Мероприятия</Link>
              {isAuthenticated && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100">Кабинет</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function DashboardSidebar() {
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Обзор', icon: '📊' },
    { to: '/dashboard/orders', label: 'Заказы', icon: '📋' },
    { to: '/dashboard/products', label: 'Товары', icon: '🎂' },
    { to: '/dashboard/recipes', label: 'Рецепты', icon: '📖' },
    { to: '/dashboard/inventory', label: 'Склад', icon: '📦' },
    { to: '/dashboard/customers', label: 'Покупатели', icon: '👥' },
    { to: '/dashboard/finance', label: 'Финансы', icon: '💰' },
    { to: '/dashboard/ai', label: 'AI-помощник', icon: '🤖' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-full hidden lg:block">
      <nav className="p-4 space-y-1">
        {links.map(link => (
          <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-rose-50 text-rose-600' : 'text-stone-600 hover:bg-stone-50'}`}>
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="bg-stone-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-display text-lg font-bold">Conditera</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">Современная экосистема для кондитеров. Создавайте, продавайте, управляйте — всё в одном месте.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Покупателям</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Каталог тортов</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Свадебные торты</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">На день рождения</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Кондитерам</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/auth" className="hover:text-white transition-colors">Начать продавать</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Кабинет кондитера</Link></li>
              <li><Link to="/b2b" className="hover:text-white transition-colors">B2B партнёрство</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Платформа</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">О проекте</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Условия использования</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">© 2026 Conditera Next. Все права защищены.</p>
          <p className="text-xs text-stone-600">Демо-версия платформы</p>
        </div>
      </div>
    </footer>
  );
}
