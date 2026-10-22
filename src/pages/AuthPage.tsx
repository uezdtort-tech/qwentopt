import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(role === 'seller' ? '/dashboard' : '/');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-berry rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-graphite">
            {mode === 'login' ? 'Вход в Conditera' : 'Регистрация'}
          </h1>
          <p className="text-sm text-graphite-light mt-2">
            {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт кондитера или покупателя'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-cream-dark p-6 shadow-sm">
          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setRole('buyer')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${role === 'buyer' ? 'bg-berry text-white' : 'bg-cream-dark text-graphite-light'}`}>
              Покупатель
            </button>
            <button onClick={() => setRole('seller')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${role === 'seller' ? 'bg-berry text-white' : 'bg-cream-dark text-graphite-light'}`}>
              Кондитер
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm font-medium text-graphite mb-1 block">Имя</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Пароль</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-light hover:text-graphite">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-graphite-light">
                  <input type="checkbox" className="accent-berry rounded" /> Запомнить меня
                </label>
                <button type="button" className="text-xs text-berry hover:underline">Забыли пароль?</button>
              </div>
            )}

            <button type="submit" className="w-full bg-berry text-white py-3 rounded-xl font-medium hover:bg-berry-dark transition-colors shadow-lg shadow-berry/20">
              {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-graphite-light">
              {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-berry font-medium hover:underline">
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo notice */}
        <div className="mt-6 bg-cream rounded-xl p-4 border border-cream-dark text-center">
          <p className="text-xs text-graphite-light">
            <strong>Демо-режим:</strong> Нажмите «Войти» для входа с демонстрационными данными. 
            В production используется Supabase Auth с проверкой на сервере.
          </p>
        </div>
      </div>
    </div>
  );
}
