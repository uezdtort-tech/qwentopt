import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Search, Menu, X, User, LogOut, ChevronDown, Heart, MessageCircle, Bell } from 'lucide-react';

export function Header() {
  const { isAuthenticated, userRole, userName, cart, logout, switchView, notifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-berry rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-display text-xl font-bold text-graphite hidden sm:block">Conditera</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className={`text-sm font-medium transition-colors ${location.pathname === '/catalog' ? 'text-berry' : 'text-graphite-light hover:text-berry'}`}>Каталог</Link>
            <Link to="/b2b" className={`text-sm font-medium transition-colors ${location.pathname === '/b2b' ? 'text-berry' : 'text-graphite-light hover:text-berry'}`}>Партнёрам</Link>
            <Link to="/events" className={`text-sm font-medium transition-colors ${location.pathname === '/events' ? 'text-berry' : 'text-graphite-light hover:text-berry'}`}>Мероприятия</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-berry' : 'text-graphite-light hover:text-berry'}`}>Кабинет</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/catalog')} className="p-2 hover:bg-cream rounded-full transition-colors">
              <Search className="w-5 h-5 text-graphite-light" />
            </button>
            <Link to="/chat" className="p-2 hover:bg-cream rounded-full transition-colors relative">
              <MessageCircle className="w-5 h-5 text-graphite-light" />
              {notifications > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-berry rounded-full text-[10px] text-white flex items-center justify-center">{notifications}</span>}
            </Link>
            <Link to="/cart" className="p-2 hover:bg-cream rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-graphite-light" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-berry rounded-full text-[10px] text-white flex items-center justify-center">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full hover:bg-cream transition-colors">
                  <div className="w-7 h-7 bg-sage rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{userName.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{userName.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-graphite-light" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-cream-dark py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-cream-dark">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-graphite-light capitalize">{userRole === 'seller' ? 'Кондитер' : userRole === 'buyer' ? 'Покупатель' : 'Администратор'}</p>
                    </div>
                    {(userRole === 'seller' || userRole === 'admin') && (
                      <button onClick={() => { switchView('dashboard'); navigate('/dashboard'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors">Кабинет</button>
                    )}
                    <button onClick={() => { switchView('public'); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors">Публичная часть</button>
                    <hr className="my-1 border-cream-dark" />
                    <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-berry hover:bg-cream transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="bg-berry text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-berry-dark transition-colors">Войти</Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-cream rounded-lg">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cream-dark py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-cream">Каталог</Link>
              <Link to="/b2b" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-cream">Партнёрам</Link>
              <Link to="/events" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-cream">Мероприятия</Link>
              {isAuthenticated && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-cream">Кабинет</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function DashboardSidebar() {
  const location = useLocation();
  const { notifications } = useApp();

  const links = [
    { to: '/dashboard', label: 'Обзор', icon: '📊' },
    { to: '/dashboard/orders', label: 'Заказы', icon: '📋', badge: 2 },
    { to: '/dashboard/products', label: 'Товары', icon: '🎂' },
    { to: '/dashboard/recipes', label: 'Рецепты', icon: '📖' },
    { to: '/dashboard/inventory', label: 'Склад', icon: '📦', badge: 1 },
    { to: '/dashboard/customers', label: 'Покупатели', icon: '👥' },
    { to: '/dashboard/finance', label: 'Финансы', icon: '💰' },
    { to: '/dashboard/ai', label: 'AI-помощник', icon: '🤖' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-cream-dark min-h-[calc(100vh-64px)] hidden lg:block">
      <nav className="p-4 space-y-1">
        {links.map(link => (
          <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-berry/10 text-berry' : 'text-graphite-light hover:bg-cream'}`}>
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
            {link.badge && <span className="ml-auto bg-berry text-white text-[10px] px-1.5 py-0.5 rounded-full">{link.badge}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="bg-graphite text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-berry rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-display text-lg font-bold">Conditera</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Современная экосистема для кондитеров. Создавайте, продавайте, управляйте — всё в одном месте.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Покупателям</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Каталог тортов</Link></li>
              <li><Link to="/catalog?occasion=Свадьба" className="hover:text-white transition-colors">Свадебные торты</Link></li>
              <li><Link to="/catalog?occasion=День+рождения" className="hover:text-white transition-colors">На день рождения</Link></li>
              <li><Link to="/custom-order" className="hover:text-white transition-colors">Индивидуальный заказ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Кондитерам</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/for-sellers" className="hover:text-white transition-colors">Начать продавать</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Кабинет кондитера</Link></li>
              <li><Link to="/b2b" className="hover:text-white transition-colors">B2B партнёрство</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Частые вопросы</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Платформа</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">О проекте</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Поддержка</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Условия использования</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 Conditera Next. Все права защищены.</p>
          <p className="text-xs text-gray-600">Демо-версия платформы. Данные являются демонстрационными.</p>
        </div>
      </div>
    </footer>
  );
}
