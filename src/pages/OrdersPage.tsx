import React, { useState } from 'react';
import { orders as initialOrders, Order } from '../data/mockData';
import { Clock, CheckCircle, XCircle, AlertCircle, MessageCircle } from 'lucide-react';

const statusLabels: Record<string, string> = { new: 'Новый', accepted: 'Принят', in_production: 'Готовится', ready: 'Готов', completed: 'Завершён', cancelled: 'Отменён' };
const statusColors: Record<string, string> = { new: 'bg-berry/10 text-berry', accepted: 'bg-gold/10 text-gold', in_production: 'bg-lavender/10 text-lavender', ready: 'bg-sage/10 text-sage', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' };

export function OrdersPage() {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? ordersList : ordersList.filter(o => o.status === filter);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-graphite">Заказы</h1>
        <span className="text-sm text-graphite-light">{filtered.length} заказов</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'new', 'accepted', 'in_production', 'ready', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === s ? 'bg-berry text-white' : 'bg-white border border-cream-dark text-graphite-light hover:border-berry/30'}`}>
            {s === 'all' ? 'Все' : statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-cream-dark p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-graphite-light">{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                </div>
                <h3 className="font-semibold text-graphite">{order.productName}</h3>
                <p className="text-sm text-graphite-light mt-1">Покупатель: {order.customer}</p>
                <p className="text-sm text-graphite-light">Доставка: {order.deliveryDate}</p>
                {order.notes && <p className="text-xs text-graphite-light mt-2 italic">«{order.notes}»</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-bold">{order.total.toLocaleString()} ₽</span>
                <div className="flex gap-2">
                  {order.status === 'new' && (
                    <>
                      <button onClick={() => updateStatus(order.id, 'accepted')} className="px-3 py-1.5 bg-sage text-white text-xs rounded-lg hover:bg-sage/80">Принять</button>
                      <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200">Отклонить</button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button onClick={() => updateStatus(order.id, 'in_production')} className="px-3 py-1.5 bg-lavender text-white text-xs rounded-lg hover:bg-lavender/80">Начать готовить</button>
                  )}
                  {order.status === 'in_production' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="px-3 py-1.5 bg-gold text-white text-xs rounded-lg hover:bg-gold/80">Готов</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'completed')} className="px-3 py-1.5 bg-graphite text-white text-xs rounded-lg hover:bg-graphite-light">Выдан</button>
                  )}
                  <button className="p-1.5 rounded-lg border border-cream-dark hover:border-berry/30 transition-colors">
                    <MessageCircle className="w-4 h-4 text-graphite-light" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-graphite mb-2">Нет заказов</h3>
          <p className="text-sm text-graphite-light">Заказы появятся здесь, когда покупатели начнут оформлять</p>
        </div>
      )}
    </div>
  );
}
