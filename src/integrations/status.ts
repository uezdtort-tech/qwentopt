/**
 * Система статусов интеграций
 */

export type IntegrationStatus = 
  | 'NOT_IMPLEMENTED'    // Реализация отсутствует
  | 'IMPLEMENTED'        // Код интеграции создан
  | 'LOCAL_TESTED'       // Локальные тесты пройдены
  | 'SANDBOX_TESTED'     // Тестовая среда провайдера проверена
  | 'PROVIDER_VERIFIED'  // Реальное взаимодействие подтверждено
  | 'NOT_CONFIGURED'     // Credentials отсутствуют
  | 'DEGRADED'           // Сервис временно недоступен
  | 'FAILED';            // Обнаружена конкретная неисправность

export interface IntegrationInfo {
  name: string;
  status: IntegrationStatus;
  description: string;
  lastChecked?: string;
  error?: string;
}

export interface IntegrationsRegistry {
  yookassa: IntegrationInfo;
  yandex_oauth: IntegrationInfo;
  vk_oauth: IntegrationInfo;
  smtp: IntegrationInfo;
  telegram: IntegrationInfo;
  supabase: IntegrationInfo;
  ollama: IntegrationInfo;
  n8n: IntegrationInfo;
}

export const initialIntegrations: IntegrationsRegistry = {
  yookassa: {
    name: 'YooKassa Payments',
    status: 'IMPLEMENTED',
    description: 'Платёжная система с локальным тестовым режимом'
  },
  yandex_oauth: {
    name: 'Яндекс ID OAuth',
    status: 'IMPLEMENTED',
    description: 'OAuth 2.0 с PKCE и локальным тестовым режимом'
  },
  vk_oauth: {
    name: 'VK ID OAuth',
    status: 'IMPLEMENTED',
    description: 'OAuth 2.0 с PKCE и локальным тестовым режимом'
  },
  smtp: {
    name: 'Email (SMTP)',
    status: 'IMPLEMENTED',
    description: 'Отправка email с локальной очередью'
  },
  telegram: {
    name: 'Telegram Notifications',
    status: 'IMPLEMENTED',
    description: 'Уведомления в Telegram с тестовым режимом'
  },
  supabase: {
    name: 'Supabase Database',
    status: 'NOT_CONFIGURED',
    description: 'PostgreSQL база данных (используется localStorage)'
  },
  ollama: {
    name: 'Ollama AI',
    status: 'NOT_CONFIGURED',
    description: 'Локальный AI-помощник'
  },
  n8n: {
    name: 'n8n Automation',
    status: 'NOT_CONFIGURED',
    description: 'Автоматизация процессов'
  }
};
