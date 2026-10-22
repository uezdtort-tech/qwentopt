/**
 * OAuth Service для Яндекс ID и VK ID
 * 
 * Реализует безопасный OAuth 2.0 / OIDC flow с:
 * - PKCE (Proof Key for Code Exchange)
 * - State parameter для защиты от CSRF
 * - Валидацией redirect URI
 * - Обработкой ошибок и edge cases
 */

export type OAuthProvider = 'yandex' | 'vk';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export interface OAuthState {
  provider: OAuthProvider;
  state: string;
  codeVerifier: string;
  returnUrl: string;
  timestamp: number;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserInfo {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider: OAuthProvider;
}

// Конфигурация провайдеров
const PROVIDER_CONFIGS: Record<OAuthProvider, Omit<OAuthConfig, 'clientId' | 'redirectUri'>> = {
  yandex: {
    provider: 'yandex',
    scope: ['login:email', 'login:info', 'login:avatar'],
    authUrl: 'https://oauth.yandex.ru/authorize',
    tokenUrl: 'https://oauth.yandex.ru/token',
    userInfoUrl: 'https://login.yandex.ru/info',
  },
  vk: {
    provider: 'vk',
    scope: ['email', 'profile'],
    authUrl: 'https://id.vk.com/authorize',
    tokenUrl: 'https://id.vk.com/oauth2/auth',
    userInfoUrl: 'https://id.vk.com/oauth2/user_info',
  },
};

// Допустимые redirect URI (allowlist)
const ALLOWED_REDIRECT_URIS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://conditera.ru',
  'https://www.conditera.ru',
];

// Время жизни state (5 минут)
const STATE_TTL_MS = 5 * 60 * 1000;

/**
 * Генерация криптографически безопасного случайного состояния
 */
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * Генерация code verifier для PKCE
 */
function generateCodeVerifier(): string {
  return generateRandomString(64);
}

/**
 * Хэширование code verifier для получения code challenge (S256)
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Генерация state параметра
 */
function generateState(): string {
  return generateRandomString(32);
}

/**
 * Валидация redirect URI по allowlist
 */
function validateRedirectUri(uri: string): boolean {
  try {
    const url = new URL(uri);
    return ALLOWED_REDIRECT_URIS.some(allowed => {
      const allowedUrl = new URL(allowed);
      return url.origin === allowedUrl.origin && url.pathname === allowedUrl.pathname;
    });
  } catch {
    return false;
  }
}

/**
 * Сохранение OAuth state в sessionStorage
 */
function saveOAuthState(state: OAuthState): void {
  sessionStorage.setItem(`oauth_state_${state.provider}`, JSON.stringify(state));
}

/**
 * Получение и валидация OAuth state
 */
function getAndValidateOAuthState(provider: OAuthProvider, stateParam: string): OAuthState | null {
  const stored = sessionStorage.getItem(`oauth_state_${provider}`);
  if (!stored) return null;

  try {
    const parsed: OAuthState = JSON.parse(stored);
    
    // Проверка совпадения state
    if (parsed.state !== stateParam) return null;
    
    // Проверка времени жизни
    if (Date.now() - parsed.timestamp > STATE_TTL_MS) {
      sessionStorage.removeItem(`oauth_state_${provider}`);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Удаление OAuth state после использования
 */
function clearOAuthState(provider: OAuthProvider): void {
  sessionStorage.removeItem(`oauth_state_${provider}`);
}

/**
 * Класс OAuth Service
 */
export class OAuthService {
  private configs: Record<OAuthProvider, OAuthConfig>;

  constructor() {
    const yandexClientId = import.meta.env.VITE_YANDEX_CLIENT_ID || '';
    const vkClientId = import.meta.env.VITE_VK_ID_CLIENT_ID || '';
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI || window.location.origin + '/auth/callback';

    if (!validateRedirectUri(redirectUri)) {
      console.error('Redirect URI не входит в allowlist:', redirectUri);
    }

    this.configs = {
      yandex: {
        ...PROVIDER_CONFIGS.yandex,
        clientId: yandexClientId,
        redirectUri,
      },
      vk: {
        ...PROVIDER_CONFIGS.vk,
        clientId: vkClientId,
        redirectUri,
      },
    };
  }

  /**
   * Начало OAuth flow — редирект на провайдера
   */
  async initiateAuth(provider: OAuthProvider, returnUrl: string = '/'): Promise<void> {
    const config = this.configs[provider];
    
    if (!config.clientId) {
      throw new Error(`Client ID для ${provider} не настроен. Проверьте переменные окружения.`);
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const oauthState: OAuthState = {
      provider,
      state,
      codeVerifier,
      returnUrl,
      timestamp: Date.now(),
    };

    saveOAuthState(oauthState);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    // Специфичные параметры для каждого провайдера
    if (provider === 'vk') {
      params.set('code_challenge_method', 'S256');
      params.set('provider', 'vk');
    }

    window.location.href = `${config.authUrl}?${params.toString()}`;
  }

  /**
   * Обработка callback — обмен кода на токены
   */
  async handleCallback(): Promise<{ user: UserInfo; returnUrl: string } | { error: string }> {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    // Обработка ошибки от провайдера
    if (error) {
      return { error: errorDescription || `Ошибка авторизации: ${error}` };
    }

    if (!code || !stateParam) {
      return { error: 'Неверный callback: отсутствуют необходимые параметры' };
    }

    // Определяем провайдера из state
    let provider: OAuthProvider | null = null;
    for (const p of ['yandex', 'vk'] as OAuthProvider[]) {
      if (getAndValidateOAuthState(p, stateParam)) {
        provider = p;
        break;
      }
    }

    if (!provider) {
      return { error: 'Неверный или истёкший state параметр' };
    }

    const oauthState = getAndValidateOAuthState(provider, stateParam)!;
    const config = this.configs[provider];

    try {
      // Обмен кода на токены
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri,
          code_verifier: oauthState.codeVerifier,
          client_id: config.clientId,
          // client_secret передаётся только на сервере!
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        return { error: errorData.error_description || 'Ошибка получения токенов' };
      }

      const tokenData = await tokenResponse.json();
      
      // Получение информации о пользователе
      const user = await this.fetchUserInfo(provider, tokenData.access_token);
      
      // Очистка state
      clearOAuthState(provider);

      return { user, returnUrl: oauthState.returnUrl };
    } catch (err) {
      return { error: 'Сетевая ошибка при авторизации. Попробуйте снова.' };
    }
  }

  /**
   * Получение информации о пользователе
   */
  private async fetchUserInfo(provider: OAuthProvider, accessToken: string): Promise<UserInfo> {
    const config = this.configs[provider];

    const response = await fetch(config.userInfoUrl, {
      headers: { Authorization: `OAuth ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Ошибка получения данных пользователя');
    }

    const data = await response.json();

    if (provider === 'yandex') {
      return {
        id: data.id,
        email: data.default_email || data.emails?.[0],
        name: data.display_name || data.real_name || data.login,
        avatar: data.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200` : undefined,
        provider,
      };
    }

    if (provider === 'vk') {
      const userInfo = data.user || data;
      return {
        id: userInfo.user_id || userInfo.id,
        email: userInfo.email || data.email,
        name: [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ') || userInfo.name,
        avatar: userInfo.avatar || userInfo.picture,
        provider,
      };
    }

    throw new Error('Неподдерживаемый провайдер');
  }

  /**
   * Проверка доступности провайдера
   */
  isProviderConfigured(provider: OAuthProvider): boolean {
    return !!this.configs[provider].clientId;
  }

  /**
   * Получение redirect URI для настройки в кабинете провайдера
   */
  getRedirectUri(): string {
    return this.configs.yandex.redirectUri;
  }
}

// Singleton
let instance: OAuthService | null = null;

export function getOAuthService(): OAuthService {
  if (!instance) {
    instance = new OAuthService();
  }
  return instance;
}
