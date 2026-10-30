import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { initializeIntegrations, getAdapter, IntegrationsRegistry } from '../integrations';
import { CheckCircle, XCircle, AlertCircle, Settings, RefreshCw } from 'lucide-react';

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationsRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Инициализация интеграций в локальном режиме
    const registry = initializeIntegrations('local');
    setIntegrations(registry);
    setLoading(false);
  }, []);
  
  const handleTest = async (name: string) => {
    const adapter = getAdapter(name);
    if (!adapter) return;
    
    setLoading(true);
    
    try {
      let result;
      
      switch (name) {
        case 'yookassa':
          result = await adapter.execute('createPayment', {
            orderId: `test_${Date.now()}`,
            amount: 1000,
            currency: 'RUB',
            description: 'Тестовый платеж',
            returnUrl: window.location.origin
          });
          break;
          
        case 'yandex_oauth':
        case 'vk_oauth':
          result = await adapter.execute('getAuthUrl', { returnUrl: '/' });
          break;
          
        case 'smtp':
          result = await adapter.execute('sendEmail', {
            to: 'test@example.com',
            subject: 'Тестовое письмо',
            html: '<p>Это тестовое письмо</p>'
          });
          break;
          
        case 'telegram':
          result = await adapter.execute('testConnection');
          break;
          
        default:
          result = { success: false, error: 'Unknown adapter' };
      }
      
      console.log(`Test result for ${name}:`, result);
      alert(`Тест ${name}: ${result.success ? 'Успешно' : 'Ошибка'}\n${result.error || ''}`);
    } catch (error) {
      console.error(`Test failed for ${name}:`, error);
      alert(`Тест ${name} завершился с ошибкой`);
    }
    
    setLoading(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IMPLEMENTED':
      case 'LOCAL_TESTED':
      case 'SANDBOX_TESTED':
      case 'PROVIDER_VERIFIED':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'NOT_CONFIGURED':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'DEGRADED':
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-stone-400" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IMPLEMENTED':
      case 'LOCAL_TESTED':
      case 'SANDBOX_TESTED':
      case 'PROVIDER_VERIFIED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'NOT_CONFIGURED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DEGRADED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'NOT_IMPLEMENTED': 'Не реализовано',
      'IMPLEMENTED': 'Реализовано',
      'LOCAL_TESTED': 'Протестировано локально',
      'SANDBOX_TESTED': 'Протестировано в sandbox',
      'PROVIDER_VERIFIED': 'Подтверждено провайдером',
      'NOT_CONFIGURED': 'Не настроено',
      'DEGRADED': 'Деградация',
      'FAILED': 'Ошибка'
    };
    return labels[status] || status;
  };
  
  if (loading || !integrations) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-stone-400" />
        </div>
      </div>
    );
  }
  
  const integrationList = Object.entries(integrations);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Интеграции</h1>
          <p className="text-stone-600 text-sm mt-1">Управление внешними сервисами и адаптерами</p>
        </div>
        <button
          onClick={() => {
            const registry = initializeIntegrations('local');
            setIntegrations(registry);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium hover:bg-stone-200"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Локальный режим разработки</p>
            <p className="text-xs text-amber-700 mt-1">
              Все интеграции работают в тестовом режиме. Для подключения production-сервисов настройте credentials в переменных окружения.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {integrationList.map(([key, integration]) => (
          <div key={key} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {getStatusIcon(integration.status)}
                <div>
                  <h3 className="font-semibold text-stone-800">{integration.name}</h3>
                  <p className="text-sm text-stone-600 mt-1">{integration.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                {getStatusLabel(integration.status)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleTest(key)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
              >
                <Settings className="w-4 h-4" />
                Тестировать
              </button>
              
              {integration.lastChecked && (
                <span className="text-xs text-stone-500">
                  Последняя проверка: {new Date(integration.lastChecked).toLocaleString('ru-RU')}
                </span>
              )}
            </div>
            
            {integration.error && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-xs text-rose-700">{integration.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-stone-50 rounded-xl p-6">
        <h3 className="font-semibold text-stone-800 mb-3">Инструкция по подключению</h3>
        <div className="space-y-3 text-sm text-stone-600">
          <p>Для подключения production-сервисов необходимо:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Получить credentials у соответствующего провайдера</li>
            <li>Добавить переменные окружения в файл <code className="px-2 py-0.5 bg-stone-200 rounded">.env</code></li>
            <li>Перезапустить приложение</li>
            <li>Проверить статус интеграции на этой странице</li>
          </ol>
          <p className="mt-4 text-xs text-stone-500">
            <strong>Важно:</strong> Никогда не коммитьте файл .env с реальными credentials в Git.
          </p>
        </div>
      </div>
    </div>
  );
}
