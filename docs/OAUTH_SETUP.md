# Настройка социальной авторизации

## Обзор

Conditera Next поддерживает авторизацию через:
- **Яндекс ID** — для пользователей из России
- **VK ID** — для пользователей из России и СНГ

Оба провайдера интегрированы через OAuth 2.0 с PKCE для максимальной безопасности.

## Архитектура

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Supabase    │────▶│  OAuth      │
│  (React)    │◀────│  Auth        │◀────│  Provider   │
└─────────────┘     └──────────────┘     └─────────────┘
      │                    │
      │                    ▼
      │             ┌──────────────┐
      └────────────▶│  Profiles    │
                    │  Database    │
                    └──────────────┘
```

### Поток авторизации

1. Пользователь нажимает «Войти через Яндекс ID» или «Войти через VK ID»
2. Frontend генерирует `state` и `code_verifier` (PKCE)
3. Редирект на провайдера с параметрами OAuth
4. Пользователь авторизуется у провайдера
5. Провайдер редиректит на `/auth/callback` с `code` и `state`
6. Frontend валидирует `state` и обменивает `code` на токены
7. Получение информации о пользователе
8. Создание/обновление профиля в Supabase
9. Редирект в приложение

## Настройка Яндекс ID

### 1. Регистрация приложения

1. Перейдите на https://oauth.yandex.ru/client/new
2. Заполните данные:
   - **Название**: Conditera
   - **Платформа**: Веб-сервисы
   - **Redirect URI**: 
     - Локальная разработка: `http://localhost:5173/auth/callback`
     - Production: `https://conditera.ru/auth/callback`
3. Выберите права доступа:
   - `login:email` — получение email
   - `login:info` — получение имени
   - `login:avatar` — получение аватара
4. Сохраните **Client ID** и **Client Password** (secret)

### 2. Добавление переменных окружения

```env
VITE_YANDEX_CLIENT_ID=your-yandex-client-id
# YANDEX_CLIENT_SECRET=your-yandex-client-secret  # Только на сервере
```

### 3. Настройка Supabase (если используется)

В Supabase Dashboard → Authentication → Providers:
1. Добавьте Custom Provider или используйте OIDC
2. Укажите:
   - Client ID из Яндекс
   - Client Secret из Яндекс
   - Issuer: `https://login.yandex.ru`

## Настройка VK ID

### 1. Регистрация приложения

1. Перейдите на https://dev.vk.com/
2. Создайте новое приложение:
   - **Тип**: Сайт
   - **Адрес сайта**: 
     - Локальная разработка: `http://localhost:5173`
     - Production: `https://conditera.ru`
   - **Базовый домен**: 
     - Локальная разработка: `localhost`
     - Production: `conditera.ru`
   - **Redirect URI**:
     - Локальная разработка: `http://localhost:5173/auth/callback`
     - Production: `https://conditera.ru/auth/callback`
3. Выберите права доступа:
   - `email` — получение email
   - `profile` — получение профиля
4. Сохраните **App ID** (Client ID) и **Secure Key** (Client Secret)

### 2. Добавление переменных окружения

```env
VITE_VK_ID_CLIENT_ID=your-vk-app-id
# VK_ID_CLIENT_SECRET=your-vk-secure-key  # Только на сервере
```

### 3. Настройка Supabase (если используется)

Аналогично Яндекс ID — добавьте как Custom OIDC Provider.

## Безопасность OAuth

### Реализованные меры

✅ **PKCE (Proof Key for Code Exchange)**
- Генерация `code_verifier` и `code_challenge` (S256)
- Защита от перехвата authorization code

✅ **State Parameter**
- Криптографически безопасная генерация
- Валидация при callback
- Защита от CSRF-атак
- TTL: 5 минут

✅ **Redirect URI Allowlist**
- Жёсткий список разрешённых URI
- Валидация на стороне клиента
- Защита от open redirect

✅ **Безопасное хранение**
- Client secrets только на сервере
- Токены не сохраняются в localStorage без необходимости
- State хранится в sessionStorage (удаляется после использования)

✅ **Валидация данных**
- Проверка подписи токенов (при OIDC)
- Проверка issuer, audience, expiration
- Проверка nonce (если используется)

### НЕ реализовано (требует серверной части)

⚠️ **Server-side token exchange**
- Текущая реализация обменивает code на токены на клиенте
- В production необходимо перенести на Edge Function или backend
- Client secret должен использоваться только на сервере

⚠️ **Token signature verification**
- Полная проверка JWT подписей требует серверной валидации
- Реализуется через Supabase Auth или custom backend

## Связывание аккаунтов

### Сценарий

Пользователь зарегистрирован через email, затем входит через Яндекс ID с тем же email.

### Правила

1. **Автоматическое связывание НЕ происходит**
2. Пользователь получает ошибку: «Аккаунт с таким email уже существует»
3. Пользователь должен:
   - Войти через email/пароль
   - Перейти в настройки профиля
   - Связать аккаунт с Яндекс ID / VK ID
4. После связывания можно входить любым способом

### Реализация

```typescript
// Проверка существующего email
const existingUser = await findUserByEmail(userInfo.email);

if (existingUser) {
  // Не связываем автоматически
  return { 
    success: false, 
    needsLinking: true, 
    error: 'Аккаунт с таким email уже существует...' 
  };
}
```

### Уникальность

- Пара `(provider, provider_user_id)` уникальна
- Один провайдерский аккаунт не может быть связан с несколькими пользователями
- Один пользователь может связать несколько провайдеров

## Callback URI

### Локальная разработка

```
http://localhost:5173/auth/callback
```

### Production

```
https://conditera.ru/auth/callback
https://www.conditera.ru/auth/callback
```

### Настройка в провайдерах

**Яндекс ID:**
- Добавьте оба URI в список разрешённых
- Поддерживает несколько redirect URI

**VK ID:**
- Добавьте основной URI
- www-версия опциональна

## Тестирование

### Локальное тестирование

1. Настройте переменные окружения в `.env`
2. Запустите приложение: `npm run dev`
3. Перейдите на `/auth`
4. Нажмите «Войти через Яндекс ID» или «Войти через VK ID»
5. Авторизуйтесь у провайдера
6. Проверьте редирект на `/auth/callback`
7. Проверьте создание профиля

### Проверка безопасности

✅ **State validation**
- Измените `state` в URL → должна быть ошибка
- Используйте старый `state` → должна быть ошибка
- Подождите 5 минут → должна быть ошибка

✅ **PKCE**
- Измените `code_verifier` → обмен кода должен провалиться

✅ **Redirect URI**
- Попробуйте другой redirect URI → должна быть ошибка

✅ **Повторное использование**
- Попробуйте использовать `code` дважды → должна быть ошибка

### Интеграционное тестирование

```bash
# Запуск тестов
npm test

# Конкретные тесты OAuth
npm test -- oauth
```

## Переменные окружения

| Переменная | Описание | Обязательность |
|------------|----------|----------------|
| `VITE_YANDEX_CLIENT_ID` | Client ID из Яндекс OAuth | Для Яндекс ID |
| `VITE_VK_ID_CLIENT_ID` | App ID из VK Dev | Для VK ID |
| `VITE_OAUTH_REDIRECT_URI` | Callback URI | Да |
| `YANDEX_CLIENT_SECRET` | Client Secret (сервер) | Production |
| `VK_ID_CLIENT_SECRET` | Secure Key (сервер) | Production |

## Известные ограничения

### Текущая реализация

⚠️ **Token exchange на клиенте**
- В текущей версии code обменивается на токены на клиенте
- Client secret не используется (только для серверного flow)
- Для production необходимо перенести на сервер

⚠️ **Демо-режим без Supabase**
- Если Supabase не настроен, используется localStorage
- Профили не сохраняются между сессиями
- Связывание аккаунтов не работает

⚠️ **Отсутствие OIDC discovery**
- Не используется автоматическое discovery
- Endpoints захардкожены
- При изменении API провайдеров требуется обновление

### Рекомендации для production

1. **Перенести token exchange на сервер**
   - Supabase Edge Function или Node.js backend
   - Использовать client secret
   - Валидировать токены на сервере

2. **Использовать Supabase Auth**
   - Настроить OAuth providers в Supabase Dashboard
   - Использовать встроенный flow
   - Получить автоматическую интеграцию с RLS

3. **Добавить аудит**
   - Логировать успешные/неуспешные попытки
   - Не логировать токены и секреты
   - Мониторить подозрительную активность

4. **Rate limiting**
   - Ограничить количество попыток входа
   - Защита от brute force
   - Блокировка при подозрительной активности

## Поддержка

### Документация провайдеров

- **Яндекс ID**: https://yandex.ru/dev/id/
- **VK ID**: https://dev.vk.com/

### Контакты

При возникновении проблем:
1. Проверьте переменные окружения
2. Проверьте redirect URI в кабинете провайдера
3. Проверьте логи браузера (Network tab)
4. Проверьте консоль сервера

## Changelog

### v1.0 (2026-01-15)
- ✅ Базовая реализация OAuth flow
- ✅ Интеграция Яндекс ID
- ✅ Интеграция VK ID
- ✅ PKCE и state validation
- ✅ Demo mode без Supabase
- ⚠️ Token exchange на клиенте (требует переноса на сервер)

### Planned
- [ ] Server-side token exchange
- [ ] Полная OIDC валидация
- [ ] Интеграция с Supabase Auth
- [ ] Аудит и логирование
- [ ] Rate limiting
