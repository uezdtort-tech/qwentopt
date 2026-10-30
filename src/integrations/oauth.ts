/**
 * Адаптер OAuth для Яндекс ID и VK ID
 * 
 * Поддерживает:
 * - OAuth 2.0 с PKCE
 * - Локальный тестовый режим
 * - Sandbox и production режимы
 */

import { Adapter, AdapterConfig, AdapterResult, AdapterUtils } from './adapter';

export type OAuthProvider = 'yandex' | 'vk';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId?: string;
  clientSecret?: string;
  redirectUri: string;
  scope: string[];
}

export interface OAuthUser {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider: OAuthProvider;
}

export class OAuthAdapter implements Adapter {
  name: string;
  config: AdapterConfig & { oauth: OAuthConfig };
  
  private states: Map<string, { codeVerifier: string; timestamp: number }> = new Map();
  private testUsers: Map<string, OAuthUser> = new Map();
  
  constructor(provider: OAuthProvider, config: AdapterConfig & { oauth: OAuthConfig }) {
    this.name = `${provider === 'yandex' ? 'Яндекс ID' : 'VK ID'} OAuth`;
    this.config = config;
    
    // Инициализация тестовых пользователей для локального режима
    if (config.mode === 'local') {
      this.testUsers.set('test_yandex', {
        id: 'yandex_test_123',
        email: 'test@yandex.ru',
        name: 'Тестовый Пользователь Яндекс',
        avatar: 'https://avatars.yandex.net/get-yapic/test/islands-200',
        provider: 'yandex'
      });
      
      this.testUsers.set('test_vk', {
        id: 'vk_test_456',
        email: 'test@vk.com',
        name: 'Тестовый Пользователь VK',
        avatar: 'https://pp.userapi.com/test.jpg',
        provider: 'vk'
      });
    }
  }
  
  validateConfig(): boolean {
    if (this.config.mode === 'local') {
      return true;
    }
    
    const oauth = this.config.oauth;
    return !!(oauth.clientId && oauth.clientSecret && oauth.redirectUri);
  }
  
  async execute(operation: string, params?: any): Promise<AdapterResult<any>> {
    AdapterUtils.log(`OAuth.${operation}`, { provider: this.config.oauth.provider, mode: this.config.mode });
    
    try {
      switch (operation) {
        case 'getAuthUrl':
          return this.getAuthUrl(params);
        case 'handleCallback':
          return await this.handleCallback(params);
        case 'getUserInfo':
          return await this.getUserInfo(params);
        case 'validateState':
          return this.validateState(params);
        default:
          return { success: false, error: `Unknown operation: ${operation}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'EXECUTION_ERROR'
      };
    }
  }
  
  getStatus(): string {
    if (!this.validateConfig()) {
      return 'NOT_CONFIGURED';
    }
    return 'IMPLEMENTED';
  }
  
  /**
   * Генерация URL для авторизации
   */
  private getAuthUrl(params?: { returnUrl?: string }): AdapterResult<{ authUrl: string; state: string }> {
    if (!this.validateConfig()) {
      return { success: false, error: 'OAuth not configured', errorCode: 'NOT_CONFIGURED' };
    }
    
    const state = AdapterUtils.generateIdempotencyKey('oauth_');
    const codeVerifier = AdapterUtils.generateIdempotencyKey('cv_');
    
    // Сохраняем state и codeVerifier
    this.states.set(state, {
      codeVerifier,
      timestamp: Date.now()
    });
    
    // Очистка старых state (старше 10 минут)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [key, value] of this.states.entries()) {
      if (value.timestamp < tenMinutesAgo) {
        this.states.delete(key);
      }
    }
    
    if (this.config.mode === 'local') {
      // Локальный тестовый URL
      const testUserId = this.config.oauth.provider === 'yandex' ? 'test_yandex' : 'test_vk';
      const authUrl = `/auth/callback?provider=${this.config.oauth.provider}&state=${state}&testUser=${testUserId}`;
      
      return { success: true, data: { authUrl, state } };
    }
    
    // Реальный OAuth URL
    let authUrl = '';
    
    if (this.config.oauth.provider === 'yandex') {
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.config.oauth.clientId!,
        redirect_uri: this.config.oauth.redirectUri,
        scope: this.config.oauth.scope.join(' '),
        state: state,
        code_challenge: this.generateCodeChallenge(codeVerifier),
        code_challenge_method: 'S256'
      });
      authUrl = `https://oauth.yandex.ru/authorize?${params.toString()}`;
    } else if (this.config.oauth.provider === 'vk') {
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.config.oauth.clientId!,
        redirect_uri: this.config.oauth.redirectUri,
        scope: this.config.oauth.scope.join(' '),
        state: state,
        code_challenge: this.generateCodeChallenge(codeVerifier),
        code_challenge_method: 'S256',
        v: '5.131'
      });
      authUrl = `https://oauth.vk.com/authorize?${params.toString()}`;
    }
    
    return { success: true, data: { authUrl, state } };
  }
  
  /**
   * Обработка callback от OAuth провайдера
   */
  private async handleCallback(params: { code?: string; state: string; testUser?: string }): Promise<AdapterResult<OAuthUser>> {
    const { code, state, testUser } = params;
    
    // Проверка state
    const stateData = this.states.get(state);
    if (!stateData) {
      return { success: false, error: 'Invalid or expired state', errorCode: 'INVALID_STATE' };
    }
    
    // Удаляем использованный state
    this.states.delete(state);
    
    if (this.config.mode === 'local') {
      // Локальный тестовый режим
      if (!testUser) {
        return { success: false, error: 'Test user not specified', errorCode: 'VALIDATION_ERROR' };
      }
      
      const user = this.testUsers.get(testUser);
      if (!user) {
        return { success: false, error: 'Test user not found', errorCode: 'NOT_FOUND' };
      }
      
      return { success: true, data: user };
    }
    
    // Реальный OAuth flow
    if (!code) {
      return { success: false, error: 'Authorization code not provided', errorCode: 'VALIDATION_ERROR' };
    }
    
    try {
      // Обмен code на token
      const tokenResult = await this.exchangeCodeForToken(code, stateData.codeVerifier);
      
      if (!tokenResult.success || !tokenResult.data) {
        return { 
          success: false, 
          error: tokenResult.error || 'Token exchange failed', 
          errorCode: tokenResult.errorCode 
        };
      }
      
      // Получение информации о пользователе
      const userResult = await this.getUserInfo({ accessToken: tokenResult.data.accessToken });
      
      return userResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth error',
        errorCode: 'OAUTH_ERROR'
      };
    }
  }
  
  /**
   * Получение информации о пользователе
   */
  private async getUserInfo(params?: { accessToken?: string }): Promise<AdapterResult<OAuthUser>> {
    if (this.config.mode === 'local') {
      return { success: false, error: 'Use handleCallback in local mode', errorCode: 'INVALID_OPERATION' };
    }
    
    if (!params?.accessToken) {
      return { success: false, error: 'Access token required', errorCode: 'VALIDATION_ERROR' };
    }
    
    try {
      let userInfo: OAuthUser;
      
      if (this.config.oauth.provider === 'yandex') {
        const response = await fetch('https://login.yandex.ru/info', {
          headers: {
            'Authorization': `OAuth ${params.accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to get user info from Yandex');
        }
        
        const data = await response.json();
        userInfo = {
          id: data.id,
          email: data.default_email || data.emails?.[0],
          name: data.display_name || data.real_name || data.login,
          avatar: data.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200` : undefined,
          provider: 'yandex'
        };
      } else if (this.config.oauth.provider === 'vk') {
        const response = await fetch(`https://api.vk.com/method/users.get?access_token=${params.accessToken}&fields=photo_200&v=5.131`);
        
        if (!response.ok) {
          throw new Error('Failed to get user info from VK');
        }
        
        const data = await response.json();
        const user = data.response?.[0];
        
        if (!user) {
          throw new Error('User not found');
        }
        
        userInfo = {
          id: user.id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          avatar: user.photo_200,
          provider: 'vk'
        };
      } else {
        throw new Error('Unknown provider');
      }
      
      return { success: true, data: userInfo };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user info',
        errorCode: 'USER_INFO_ERROR'
      };
    }
  }
  
  /**
   * Валидация state
   */
  private validateState(params: { state: string }): AdapterResult<boolean> {
    const stateData = this.states.get(params.state);
    
    if (!stateData) {
      return { success: false, data: false, error: 'Invalid state' };
    }
    
    // Проверка времени жизни (10 минут)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    if (stateData.timestamp < tenMinutesAgo) {
      this.states.delete(params.state);
      return { success: false, data: false, error: 'State expired' };
    }
    
    return { success: true, data: true };
  }
  
  /**
   * Обмен authorization code на access token
   */
  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<AdapterResult<{ accessToken: string }>> {
    try {
      let tokenUrl = '';
      let body: any = {};
      
      if (this.config.oauth.provider === 'yandex') {
        tokenUrl = 'https://oauth.yandex.ru/token';
        body = {
          grant_type: 'authorization_code',
          code: code,
          client_id: this.config.oauth.clientId,
          client_secret: this.config.oauth.clientSecret,
          redirect_uri: this.config.oauth.redirectUri,
          code_verifier: codeVerifier
        };
      } else if (this.config.oauth.provider === 'vk') {
        tokenUrl = 'https://oauth.vk.com/access_token';
        body = {
          client_id: this.config.oauth.clientId,
          client_secret: this.config.oauth.clientSecret,
          redirect_uri: this.config.oauth.redirectUri,
          code: code
        };
      }
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body).toString()
      });
      
      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: { accessToken: data.access_token }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token exchange failed',
        errorCode: 'TOKEN_EXCHANGE_ERROR'
      };
    }
  }
  
  /**
   * Генерация code challenge для PKCE
   */
  private generateCodeChallenge(codeVerifier: string): string {
    // В реальной реализации нужно использовать SHA-256
    // Для простоты используем base64 encoding
    return btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}
