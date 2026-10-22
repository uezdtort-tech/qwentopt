import React from 'react';
import { orders } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function FinancePage() {
  const completed = orders.filter(o => o.status === 'completed');
  const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
  const commission = Math.round(totalRevenue * 0.08);
  const netIncome = totalRevenue - commission;
  const pendingOrders = orders.filter(o => ['new', 'accepted', 'in_production'].includes(o.status));
  const pendingAmount = pendingOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-graphite mb-6">Финансы</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-sage" />
            <p className="text-xs text-graphite-light">Выручка</p>
          </div>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-sage">
            <ArrowUpRight className="w-3 h-3" /> +12% к прошлому месяцу
          </div>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-berry" />
            <p className="text-xs text-graphite-light">Комиссия (8%)</p>
          </div>
          <p className="text-2xl font-bold">{commission.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-sage" />
            <p className="text-xs text-graphite-light">К выплате</p>
          </div>
          <p className="text-2xl font-bold text-sage">{netIncome.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-gold" />
            <p className="text-xs text-graphite-light">Ожидает подтверждения</p>
          </div>
          <p className="text-2xl font-bold">{pendingAmount.toLocaleString()} ₽</p>
          <p className="text-xs text-graphite-light mt-1">{pendingOrders.length} заказов</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-cream-dark overflow-hidden">
        <div className="p-5 border-b border-cream-dark">
          <h2 className="font-semibold">История операций</h2>
        </div>
        <div className="divide-y divide-cream-dark">
          {completed.map(order => (
            <div key={order.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium">{order.productName}</p>
                <p className="text-xs text-graphite-light">{order.customer} · {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-sage">+{order.total.toLocaleString()} ₽</p>
                <p className="text-xs text-graphite-light">Комиссия: -{Math.round(order.total * 0.08).toLocaleString()} ₽</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 bg-cream rounded-xl p-4 border border-cream-dark">
        <p className="text-xs text-graphite-light">
          <strong>Примечание:</strong> Интеграция с платёжным провайдером не настроена. Данные о выплатах отображаются на основании подтверждённых заказов. 
          Для подключения реальных платежей необходимо настроить адаптер платёжного провайдера.
        </p>
      </div>
    </div>
  );
}
