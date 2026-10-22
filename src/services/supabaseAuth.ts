/**
 * Supabase Auth Integration Service
 * 
 * Интеграция OAuth с Supabase Auth для:
 * - Создания/обновления профилей
 * - Связывания аккаунтов
 * - Управления сессиями
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserInfo, OAuthProvider } from './oauth';

// Supabase client
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.warn('Supabase не настроен. Социальная авторизация работает в демо-режиме.');
    return null;
  }
  
  supabase = createClient(url, key);
  return supabase;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  isNewUser?: boolean;
  needsLinking?: boolean;
  existingEmail?: string;
  error?: string;
}

/**
 * Обработка OAuth пользователя через Supabase Auth
 */
export async function handleOAuthUser(userInfo: UserInfo): Promise<AuthResult> {
  const sb = getSupabase();
  
  // Демо-режим без Supabase
  if (!sb) {
    return handleDemoMode(userInfo);
  }

  try {
    // Проверка существующей связи с провайдером
    const { data: identityData, error: identityError } = await sb
      .from('identities')
      .select('user_id')
      .eq('provider_id', userInfo.id)
      .eq('provider', userInfo.provider)
      .single();

    if (identityData) {
      // Пользователь уже связан — входим
      const { data: sessionData, error: sessionError } = await sb.auth.getSession();
      if (sessionData.session) {
        return { success: true, user: sessionData.session.user, isNewUser: false };
      }
    }

    // Проверка существующего пользователя по email
    if (userInfo.email) {
      const { data: existingUsers } = await sb.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(u => u.email === userInfo.email);
      
      if (existing) {
        // Email совпадает, но аккаунт не связан
        return { 
          success: false, 
          needsLinking: true, 
          existingEmail: userInfo.email,
          error: 'Аккаунт с таким email уже существует. Войдите через email/пароль и свяжите аккаунт в настройках.' 
        };
      }
    }

    // В production: создание профиля после успешного OAuth
    // Supabase Auth уже обработал OAuth flow через callback
    // Здесь мы только создаём/обновляем профиль в нашей БД
    const { data: profileData, error: profileError } = await sb
      .from('profiles')
      .upsert({
        id: userInfo.id,
        email: userInfo.email,
        full_name: userInfo.name,
        avatar_url: userInfo.avatar,
        provider: userInfo.provider,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Ошибка создания профиля:', profileError);
    }

    return { success: true, isNewUser: true };
  } catch (err) {
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' };
  }
}

/**
 * Демо-режим без Supabase
 */
function handleDemoMode(userInfo: UserInfo): AuthResult {
  // В демо-режиме просто создаём mock-пользователя
  const mockUser: User = {
    id: `demo-${userInfo.provider}-${userInfo.id}`,
    email: userInfo.email || `${userInfo.provider}-${userInfo.id}@demo.conditera.ru`,
    user_metadata: {
      name: userInfo.name,
      avatar_url: userInfo.avatar,
      provider: userInfo.provider,
    },
    app_metadata: {
      provider: userInfo.provider,
      providers: [userInfo.provider],
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  // Сохраняем в localStorage для демо
  localStorage.setItem('demo_auth_user', JSON.stringify({
    user: mockUser,
    provider: userInfo.provider,
    providerId: userInfo.id,
  }));

  return { success: true, user: mockUser, isNewUser: true };
}

/**
 * Связывание OAuth аккаунта с существующим пользователем
 */
export async function linkOAuthAccount(userInfo: UserInfo): Promise<{ success: boolean; error?: string }> {
  const sb = getSupabase();
  
  if (!sb) {
    // Демо-режим
    const stored = localStorage.getItem('demo_auth_user');
    if (stored) {
      const data = JSON.parse(stored);
      data.provider = userInfo.provider;
      data.providerId = userInfo.id;
      localStorage.setItem('demo_auth_user', JSON.stringify(data));
      return { success: true };
    }
    return { success: false, error: 'Нет активной сессии' };
  }

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      return { success: false, error: 'Необходима авторизация' };
    }

    // Проверка, не связан ли уже этот провайдер
    const { data: existing } = await sb
      .from('identities')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', userInfo.provider)
      .single();

    if (existing) {
      return { success: false, error: 'Этот аккаунт уже связан с вашим профилем' };
    }

    // Создание связи
    const { error } = await sb.from('identities').insert({
      user_id: user.id,
      provider: userInfo.provider,
      provider_id: userInfo.id,
      identity_data: {
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.avatar,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Ошибка сервера' };
  }
}

/**
 * Отвязка OAuth аккаунта
 */
export async function unlinkOAuthAccount(provider: OAuthProvider): Promise<{ success: boolean; error?: string }> {
  const sb = getSupabase();
  
  if (!sb) {
    return { success: false, error: 'Supabase не настроен' };
  }

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      return { success: false, error: 'Необходима авторизация' };
    }

    // Проверка, что есть другой способ входа
    const { data: identities } = await sb
      .from('identities')
      .select('provider')
      .eq('user_id', user.id);

    if (identities && identities.length <= 1) {
      return { success: false, error: 'Нельзя отвязать единственный способ входа' };
    }

    const { error } = await sb
      .from('identities')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Ошибка сервера' };
  }
}

/**
 * Получение связанных провайдеров
 */
export async function getLinkedProviders(): Promise<OAuthProvider[]> {
  const sb = getSupabase();
  
  if (!sb) {
    const stored = localStorage.getItem('demo_auth_user');
    if (stored) {
      const data = JSON.parse(stored);
      return [data.provider];
    }
    return [];
  }

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return [];

    const { data: identities } = await sb
      .from('identities')
      .select('provider')
      .eq('user_id', user.id);

    return (identities || []).map(i => i.provider as OAuthProvider);
  } catch {
    return [];
  }
}

/**
 * Выход из системы
 */
export async function signOut(): Promise<void> {
  const sb = getSupabase();
  
  if (sb) {
    await sb.auth.signOut();
  }
  
  localStorage.removeItem('demo_auth_user');
}

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser(): Promise<User | null> {
  const sb = getSupabase();
  
  if (!sb) {
    const stored = localStorage.getItem('demo_auth_user');
    if (stored) {
      const data = JSON.parse(stored);
      return data.user;
    }
    return null;
  }

  const { data: { user } } = await sb.auth.getUser();
  return user;
}
