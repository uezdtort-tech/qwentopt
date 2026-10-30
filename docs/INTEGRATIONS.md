# Документация по интеграциям Conditera Next

## Обзор

Conditera Next использует модульную архитектуру адаптеров для интеграции с внешними сервисами. Каждый адаптер поддерживает три режима работы:

- **local** — локальная имитация для разработки
- **sandbox** — тестовая среда провайдера
- **production** — боевая среда

## Статусы интеграций

| Статус | Описание |
|--------|----------|
| `NOT_IMPLEMENTED` | Реализация отсутствует |
| `IMPLEMENTED` | Код интеграции создан |
| `LOCAL_TESTED` | Локальные тесты пройдены |
| `SANDBOX_TESTED` | Тестовая среда провайдера проверена |
| `PROVIDER_VERIFIED` | Реальное взаимодействие подтверждено |
| `NOT_CONFIGURED` | Credentials отсутствуют |
| `DEGRADED` | Сервис временно недоступен |
| `FAILED` | Обнаружена конкретная неисправность |

## Реализованные интеграции

### 1. YooKassa (Платежи)

**Статус:** ✅ IMPLEMENTED (local mode)

**Возможности:**
- Создание платежей
- Проверка статуса платежей
- Отмена платежей
- Создание возвратов (полных и частичных)
- Обработка webhook уведомлений
- Идемпотентность операций
- Повторные попытки при ошибках

**Локальный режим:**
В локальном режиме платежи автоматически подтверждаются через 2 секунды. Это позволяет тестировать полный цикл заказа без реальных платежей.

**Подключение production:**
```env
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
YOOKASSA_MODE=production
```

**Документация провайдера:**
https://yookassa.ru/developers/

---

### 2. Яндекс ID (OAuth)

**Статус:** ✅ IMPLEMENTED (local mode)

**Возможности:**
- OAuth 2.0 с PKCE
- Генерация URL авторизации
- Обработка callback
- Получение профиля пользователя
- Привязка к существующему аккаунту
- Защита от CSRF через state parameter

**Локальный режим:**
В локальном режиме используется тестовый пользователь:
- Email: test@yandex.ru
- Имя: Тестовый Пользователь Яндекс

**Подключение production:**
```env
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
YANDEX_REDIRECT_URI=https://yourdomain.com/auth/callback
```

**Регистрация приложения:**
https://oauth.yandex.com/client/new

---

### 3. VK ID (OAuth)

**Статус:** ✅ IMPLEMENTED (local mode)

**Возможности:**
- OAuth 2.0 с PKCE
- Генерация URL авторизации
- Обработка callback
- Получение профиля пользователя
- Привязка к существующему аккаунту

**Локальный режим:**
В локальном режиме используется тестовый пользователь:
- Email: test@vk.com
- Имя: Тестовый Пользователь VK

**Подключение production:**
```env
VK_CLIENT_ID=your_client_id
VK_CLIENT_SECRET=your_client_secret
VK_REDIRECT_URI=https://yourdomain.com/auth/callback
```

**Регистрация приложения:**
https://dev.vk.com/

---

### 4. SMTP (Email)

**Статус:** ✅ IMPLEMENTED (local mode)

**Возможности:**
- Отправка email
- Очередь писем
- Повторные попытки при ошибках
- Отслеживание статуса доставки
- Валидация email адресов

**Локальный режим:**
В локальном режиме письма не отправляются реально, но сохраняются в очереди и помечаются как отправленные через 1 секунду.

**Подключение production:**
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@yourdomain.com
```

---

### 5. Telegram (Уведомления)

**Статус:** ✅ IMPLEMENTED (local mode)

**Возможности:**
- Отправка сообщений
- Проверка соединения
- Отслеживание статуса доставки
- Поддержка HTML и Markdown

**Локальный режим:**
В локальном режиме сообщения не отправляются реально, но помечаются как отправленные с тестовым message_id.

**Подключение production:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

**Создание бота:**
https://t.me/BotFather

---

### 6. Supabase (База данных)

**Статус:** ⚠️ NOT_CONFIGURED

**Текущая реализация:**
В настоящее время используется localStorage для хранения данных. Это позволяет работать без настройки базы данных, но имеет ограничения:
- Данные хранятся только в браузере пользователя
- Нет синхронизации между устройствами
- Нет резервного копирования

**Подключение production:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Документация:**
https://supabase.com/docs

---

### 7. Ollama (AI)

**Статус:** ⚠️ NOT_CONFIGURED

**Текущая реализация:**
AI-помощник работает в демо-режиме с захардкоженными ответами.

**Подключение production:**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

**Установка Ollama:**
https://ollama.ai/

---

### 8. n8n (Автоматизация)

**Статус:** ⚠️ NOT_CONFIGURED

**Текущая реализация:**
Автоматизация не реализована.

**Подключение production:**
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_WEBHOOK_SECRET=your_webhook_secret
```

**Установка n8n:**
https://docs.n8n.io/getting-started/installation/

---

## Управление интеграциями

### Страница администратора

Все интеграции можно просмотреть и протестировать на странице `/dashboard/integrations` (доступна для ролей admin и superadmin).

### Тестирование

Для каждой интеграции доступна кнопка "Тестировать", которая выполняет базовую проверку работоспособности.

### Безопасная деградация

Если интеграция не настроена или недоступна:
- Приложение продолжает работать
- Соответствующая функциональность отключается
- Пользователь видит понятное сообщение
- Остальные функции не страдают

Примеры:
- OAuth не настроен → работает только email-вход
- YooKassa не настроена → заказы создаются, но оплата недоступна
- SMTP не настроен → уведомления сохраняются в очередь
- Telegram не настроен → другие каналы уведомлений работают

---

## Архитектура адаптеров

### Базовый интерфейс

```typescript
interface Adapter {
  name: string;
  config: AdapterConfig;
  
  validateConfig(): boolean;
  execute(operation: string, params?: any): Promise<AdapterResult>;
  getStatus(): string;
}
```

### Результат выполнения

```typescript
interface AdapterResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  metadata?: Record<string, any>;
}
```

### Режимы работы

```typescript
type AdapterMode = 'local' | 'sandbox' | 'production';

interface AdapterConfig {
  mode: AdapterMode;
  credentials?: Record<string, string>;
  timeout?: number;
  retries?: number;
}
```

---

## Добавление новой интеграции

1. Создайте файл адаптера в `src/integrations/`
2. Реализуйте интерфейс `Adapter`
3. Добавьте поддержку всех трех режимов
4. Зарегистрируйте адаптер в `src/integrations/index.ts`
5. Добавьте запись в `IntegrationsRegistry`
6. Добавьте страницу тестирования (опционально)

### Пример минимального адаптера

```typescript
import { Adapter, AdapterConfig, AdapterResult } from './adapter';

export class MyServiceAdapter implements Adapter {
  name = 'My Service';
  config: AdapterConfig;
  
  constructor(config: AdapterConfig) {
    this.config = config;
  }
  
  validateConfig(): boolean {
    if (this.config.mode === 'local') return true;
    return !!this.config.credentials?.apiKey;
  }
  
  async execute(operation: string, params?: any): Promise<AdapterResult> {
    if (this.config.mode === 'local') {
      // Локальная имитация
      return { success: true, data: { test: true } };
    }
    
    // Реальный API вызов
    // ...
  }
  
  getStatus(): string {
    return this.validateConfig() ? 'IMPLEMENTED' : 'NOT_CONFIGURED';
  }
}
```

---

## Безопасность

### Хранение секретов

- **Никогда** не коммитьте `.env` файлы с реальными credentials
- Используйте `.env.example` как шаблон
- Добавьте `.env` в `.gitignore`
- Используйте менеджеры секретов для production (Vault, AWS Secrets Manager, etc.)

### Логирование

Адаптеры автоматически удаляют чувствительные данные из логов:
- Пароли
- Токены
- Секретные ключи
- Credentials

### Валидация

Все адаптеры проверяют:
- Наличие необходимых credentials
- Корректность формата данных
- Валидность URL и email адресов
- Права доступа

---

## Мониторинг

### Локальное тестирование

Используйте страницу `/dashboard/integrations` для:
- Проверки статуса интеграций
- Тестирования базовой функциональности
- Просмотра логов

### Production мониторинг

Рекомендуется настроить:
- Алерты при смене статуса на FAILED
- Метрики успешности операций
- Логи ошибок
- Время отклика API

---

## Поддержка

При возникновении проблем с интеграциями:

1. Проверьте статус на странице `/dashboard/integrations`
2. Проверьте логи приложения
3. Проверьте credentials в `.env`
4. Проверьте документацию провайдера
5. Обратитесь в поддержку провайдера

---

**Версия документации:** 1.0  
**Дата обновления:** 2026-01-15
