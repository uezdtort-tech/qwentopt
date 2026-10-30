/**
 * Главный модуль интеграций
 * 
 * Экспортирует все адаптеры и систему управления интеграциями
 */

export * from './status';
export * from './adapter';
export * from './yookassa';
export * from './oauth';
export * from './smtp';
export * from './telegram';

import { AdapterFactory } from './adapter';
import { YooKassaAdapter } from './yookassa';
import { OAuthAdapter } from './oauth';
import { SMTPAdapter } from './smtp';
import { TelegramAdapter } from './telegram';
import { IntegrationsRegistry, initialIntegrations } from './status';

/**
 * Инициализация всех интеграций
 */
export function initializeIntegrations(mode: 'local' | 'sandbox' | 'production' = 'local'): IntegrationsRegistry {
  const config = { mode };
  
  // Инициализация YooKassa
  const yookassa = new YooKassaAdapter(config);
  AdapterFactory.register('yookassa', yookassa);
  
  // Инициализация OAuth
  const yandexOAuth = new OAuthAdapter('yandex', {
    ...config,
    oauth: {
      provider: 'yandex',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: ['login:email', 'login:info', 'login:avatar']
    }
  });
  AdapterFactory.register('yandex_oauth', yandexOAuth);
  
  const vkOAuth = new OAuthAdapter('vk', {
    ...config,
    oauth: {
      provider: 'vk',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: ['email', 'profile']
    }
  });
  AdapterFactory.register('vk_oauth', vkOAuth);
  
  // Инициализация SMTP
  const smtp = new SMTPAdapter(config);
  AdapterFactory.register('smtp', smtp);
  
  // Инициализация Telegram
  const telegram = new TelegramAdapter(config);
  AdapterFactory.register('telegram', telegram);
  
  return initialIntegrations;
}

/**
 * Получение адаптера по имени
 */
export function getAdapter(name: string) {
  return AdapterFactory.get(name);
}

/**
 * Получение всех адаптеров
 */
export function getAllAdapters() {
  return AdapterFactory.getAll();
}
