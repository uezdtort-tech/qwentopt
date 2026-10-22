import React from 'react';
import { customers } from '../data/mockData';
import { Search, Mail, Phone, ShoppingBag } from 'lucide-react';

export function CustomersPage() {
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-graphite">Покупатели</h1>
        <span className="text-sm text-graphite-light">{customers.length} клиентов</span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-graphite-light" />
        <input type="text" placeholder="Поиск по имени или телефону..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl border border-cream-dark p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{customer.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{customer.name}</h3>
                <p className="text-xs text-graphite-light">Последний заказ: {customer.lastOrder}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-graphite-light">
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {customer.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {customer.phone}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-dark">
              <div className="text-center">
                <p className="text-sm font-bold">{customer.ordersCount}</p>
                <p className="text-[10px] text-graphite-light">заказов</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">{customer.totalSpent.toLocaleString()} ₽</p>
                <p className="text-[10px] text-graphite-light">потрачено</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-graphite-light max-w-[80px] truncate">{customer.preferences}</p>
                <p className="text-[10px] text-graphite-light">предпочтения</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
