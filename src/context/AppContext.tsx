import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, ChatMessage, chatMessages as initialMessages } from '../data/mockData';

interface AppState {
  isAuthenticated: boolean;
  userRole: 'guest' | 'buyer' | 'seller' | 'admin';
  userName: string;
  currentView: 'public' | 'dashboard';
  orders: Order[];
  messages: ChatMessage[];
  notifications: number;
  cart: { id: string; name: string; price: number; qty: number }[];
}

interface AppContextType extends AppState {
  login: (role: 'buyer' | 'seller' | 'admin') => void;
  logout: () => void;
  switchView: (view: 'public' | 'dashboard') => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  sendMessage: (text: string) => void;
  addToCart: (item: { id: string; name: string; price: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    userRole: 'guest',
    userName: '',
    currentView: 'public',
    orders: [],
    messages: initialMessages,
    notifications: 3,
    cart: [],
  });

  const login = (role: 'buyer' | 'seller' | 'admin') => {
    const names = { buyer: 'Мария Иванова', seller: 'Анна Пекарская', admin: 'Администратор' };
    setState(s => ({ ...s, isAuthenticated: true, userRole: role, userName: names[role], currentView: role === 'seller' || role === 'admin' ? 'dashboard' : 'public' }));
  };

  const logout = () => {
    setState(s => ({ ...s, isAuthenticated: false, userRole: 'guest', userName: '', currentView: 'public' }));
  };

  const switchView = (view: 'public' | 'dashboard') => {
    setState(s => ({ ...s, currentView: view }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setState(s => ({ ...s, orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o) }));
  };

  const sendMessage = (text: string) => {
    const newMsg: ChatMessage = { id: `m${Date.now()}`, sender: 'user', text, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) };
    setState(s => ({ ...s, messages: [...s.messages, newMsg] }));
  };

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setState(s => {
      const existing = s.cart.find(c => c.id === item.id);
      if (existing) {
        return { ...s, cart: s.cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) };
      }
      return { ...s, cart: [...s.cart, { ...item, qty: 1 }] };
    });
  };

  const removeFromCart = (id: string) => {
    setState(s => ({ ...s, cart: s.cart.filter(c => c.id !== id) }));
  };

  const clearCart = () => setState(s => ({ ...s, cart: [] }));

  return (
    <AppContext.Provider value={{ ...state, login, logout, switchView, updateOrderStatus, sendMessage, addToCart, removeFromCart, clearCart }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
