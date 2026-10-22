import React from 'react';
import { Link } from 'react-router-dom';
import { orders, inventory, products } from '../data/mockData';
import { TrendingUp, Package, AlertTriangle, Clock, CheckCircle, ShoppingBag, Users, DollarSign } from 'lucide-react';

export function DashboardPage() {
  const newOrders = orders.filter(o => o.status === 'new');
  const activeOrders = orders.filter(o => ['accepted', 'in_production'].includes(o.status));
  const lowStock = inventory.filter(i => i.stock <= i.minStock);
  const todayRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-graphite">Добро пожаловать, Анна!</h1>
        <p className="text-graphite-light text-sm mt-1">Вот что происходит в вашем бизнесе сегодня</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Новые заказы', value: newOrders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-berry/10 text-berry' },
          { label: 'В производстве', value: activeOrders.length, icon: <Clock className="w-5 h-5" />, color: 'bg-gold/10 text-gold' },
          { label: 'Выручка (сегодня)', value: `${todayRevenue.toLocaleString()} ₽`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-sage/10 text-sage' },
          { label: 'Товаров активно', value: products.filter(p => p.status === 'published').length, icon: <Package className="w-5 h-5" />, color: 'bg-lavender/10 text-lavender' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-cream-dark p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-graphite">{stat.value}</p>
            <p className="text-xs text-graphite-light mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Priority Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-cream-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-graphite">Требуют внимания</h2>
            <Link to="/dashboard/orders" className="text-xs text-berry hover:underline">Все заказы →</Link>
          </div>
          <div className="space-y-3">
            {orders.filter(o => ['new', 'accepted', 'in_production', 'ready'].includes(o.status)).slice(0, 4).map(order => (
              <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-cream transition-colors">
                <div className={`w-2 h-2 rounded-full ${order.status === 'new' ? 'bg-berry' : order.status === 'accepted' ? 'bg-gold' : order.status === 'in_production' ? 'bg-lavender' : 'bg-sage'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{order.productName}</p>
                  <p className="text-xs text-graphite-light">{order.customer} · Доставка {order.deliveryDate}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === 'new' ? 'bg-berry/10 text-berry' :
                  order.status === 'accepted' ? 'bg-gold/10 text-gold' :
                  order.status === 'in_production' ? 'bg-lavender/10 text-lavender' :
                  'bg-sage/10 text-sage'
                }`}>
                  {order.status === 'new' ? 'Новый' : order.status === 'accepted' ? 'Принят' : order.status === 'in_production' ? 'Готовится' : 'Готов'}
                </span>
                <span className="text-sm font-semibold">{order.total.toLocaleString()} ₽</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-6">
          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-cream-dark p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-gold" />
              <h2 className="font-semibold text-graphite">Дефицит ингредиентов</h2>
            </div>
            {lowStock.length > 0 ? (
              <div className="space-y-2">
                {lowStock.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-graphite-light">{item.name}</span>
                    <span className="font-medium text-berry">{item.stock} {item.unit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-graphite-light">Всё в порядке ✓</p>
            )}
            <Link to="/dashboard/inventory" className="text-xs text-berry hover:underline mt-3 block">Перейти на склад →</Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-cream-dark p-6">
            <h2 className="font-semibold text-graphite mb-4">Быстрые действия</h2>
            <div className="space-y-2">
              <Link to="/dashboard/products" className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream transition-colors text-sm">
                <Package className="w-4 h-4 text-graphite-light" /> Добавить товар
              </Link>
              <Link to="/dashboard/recipes" className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream transition-colors text-sm">
                <Clock className="w-4 h-4 text-graphite-light" /> Новый рецепт
              </Link>
              <Link to="/dashboard/ai" className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream transition-colors text-sm">
                <TrendingUp className="w-4 h-4 text-graphite-light" /> Спросить AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
