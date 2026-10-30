/**
 * Адаптер Telegram для отправки уведомлений
 * 
 * Поддерживает:
 * - Локальный тестовый режим
 * - Production режим через Telegram Bot API
 */

import { Adapter, AdapterConfig, AdapterResult, AdapterUtils } from './adapter';

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disablePreview?: boolean;
}

export interface TelegramMessageStatus {
  id: string;
  chatId: string;
  text: string;
  status: 'queued' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  messageId?: number;
  error?: string;
}

export class TelegramAdapter implements Adapter {
  name = 'Telegram';
  config: AdapterConfig;
  
  private sentMessages: Map<string, TelegramMessageStatus> = new Map();
  
  constructor(config: AdapterConfig) {
    this.config = {
      timeout: 10000,
      retries: 2,
      ...config
    };
  }
  
  validateConfig(): boolean {
    if (this.config.mode === 'local') {
      return true;
    }
    
    if (this.config.mode === 'production') {
      return !!(
        this.config.credentials?.botToken &&
        this.config.credentials?.chatId
      );
    }
    
    return false;
  }
  
  async execute(operation: string, params?: any): Promise<AdapterResult<any>> {
    AdapterUtils.log(`Telegram.${operation}`, { mode: this.config.mode });
    
    try {
      switch (operation) {
        case 'sendMessage':
          return await this.sendMessage(params);
        case 'getMessageStatus':
          return this.getMessageStatus(params);
        case 'testConnection':
          return await this.testConnection();
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
   * Отправка сообщения
   */
  private async sendMessage(data: TelegramMessage): Promise<AdapterResult<TelegramMessageStatus>> {
    // Валидация
    if (!data.chatId || !data.text) {
      return { success: false, error: 'Missing required fields', errorCode: 'VALIDATION_ERROR' };
    }
    
    const messageId = AdapterUtils.generateIdempotencyKey('tg_');
    
    const messageStatus: TelegramMessageStatus = {
      id: messageId,
      chatId: data.chatId,
      text: data.text,
      status: 'queued',
      createdAt: new Date().toISOString()
    };
    
    if (this.config.mode === 'local') {
      // Локальная имитация
      messageStatus.status = 'sent';
      messageStatus.sentAt = new Date().toISOString();
      messageStatus.messageId = Math.floor(Math.random() * 1000000);
      
      this.sentMessages.set(messageId, messageStatus);
      
      AdapterUtils.log('Telegram.sent', { messageId, chatId: data.chatId, testMode: true });
      
      return { success: true, data: messageStatus };
    }
    
    if (this.config.mode === 'production') {
      // Реальная отправка через Telegram Bot API
      try {
        const result = await AdapterUtils.withRetry(async () => {
          const response = await fetch(
            `https://api.telegram.org/bot${this.config.credentials?.botToken}/sendMessage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                chat_id: data.chatId,
                text: data.text,
                parse_mode: data.parseMode || 'HTML',
                disable_web_page_preview: data.disablePreview || false
              })
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Telegram API error');
          }
          
          return await response.json();
        }, this.config.retries, 1000);
        
        messageStatus.status = 'sent';
        messageStatus.sentAt = new Date().toISOString();
        messageStatus.messageId = result.result.message_id;
        
        this.sentMessages.set(messageId, messageStatus);
        
        return { success: true, data: messageStatus };
      } catch (error) {
        messageStatus.status = 'failed';
        messageStatus.error = error instanceof Error ? error.message : 'Send failed';
        
        this.sentMessages.set(messageId, messageStatus);
        
        return {
          success: false,
          error: messageStatus.error,
          errorCode: 'TELEGRAM_ERROR',
          data: messageStatus
        };
      }
    }
    
    return { success: false, error: 'Invalid mode', errorCode: 'CONFIG_ERROR' };
  }
  
  /**
   * Получение статуса сообщения
   */
  private getMessageStatus(messageId: string): AdapterResult<TelegramMessageStatus> {
    const message = this.sentMessages.get(messageId);
    
    if (!message) {
      return { success: false, error: 'Message not found', errorCode: 'NOT_FOUND' };
    }
    
    return { success: true, data: message };
  }
  
  /**
   * Проверка соединения с Telegram API
   */
  private async testConnection(): Promise<AdapterResult<{ ok: boolean; botInfo?: any }>> {
    if (this.config.mode === 'local') {
      return { success: true, data: { ok: true, botInfo: { name: 'Test Bot', testMode: true } } };
    }
    
    if (this.config.mode === 'production') {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${this.config.credentials?.botToken}/getMe`
        );
        
        if (!response.ok) {
          return { success: false, error: 'Connection failed', errorCode: 'CONNECTION_ERROR' };
        }
        
        const data = await response.json();
        
        return {
          success: true,
          data: {
            ok: data.ok,
            botInfo: data.result
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Connection failed',
          errorCode: 'CONNECTION_ERROR'
        };
      }
    }
    
    return { success: false, error: 'Invalid mode', errorCode: 'CONFIG_ERROR' };
  }
}
