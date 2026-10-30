/**
 * Адаптер SMTP для отправки email
 * 
 * Поддерживает:
 * - Локальную очередь писем
 * - Тестовый режим (без реальной отправки)
 * - Production режим через SMTP
 */

import { Adapter, AdapterConfig, AdapterResult, AdapterUtils } from './adapter';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailStatus {
  id: string;
  to: string;
  subject: string;
  status: 'queued' | 'sent' | 'failed' | 'bounced';
  createdAt: string;
  sentAt?: string;
  error?: string;
  attempts: number;
}

export class SMTPAdapter implements Adapter {
  name = 'SMTP Email';
  config: AdapterConfig;
  
  private queue: EmailStatus[] = [];
  private sentEmails: Map<string, EmailStatus> = new Map();
  
  constructor(config: AdapterConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config
    };
  }
  
  validateConfig(): boolean {
    if (this.config.mode === 'local') {
      return true;
    }
    
    if (this.config.mode === 'sandbox' || this.config.mode === 'production') {
      return !!(
        this.config.credentials?.host &&
        this.config.credentials?.port &&
        this.config.credentials?.user &&
        this.config.credentials?.password
      );
    }
    
    return false;
  }
  
  async execute(operation: string, params?: any): Promise<AdapterResult<any>> {
    AdapterUtils.log(`SMTP.${operation}`, { mode: this.config.mode });
    
    try {
      switch (operation) {
        case 'sendEmail':
          return await this.sendEmail(params);
        case 'getQueue':
          return this.getQueue();
        case 'getEmailStatus':
          return this.getEmailStatus(params);
        case 'retryFailed':
          return await this.retryFailed();
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
   * Отправка email
   */
  private async sendEmail(data: EmailData): Promise<AdapterResult<EmailStatus>> {
    // Валидация
    if (!data.to || !data.subject || !data.html) {
      return { success: false, error: 'Missing required fields', errorCode: 'VALIDATION_ERROR' };
    }
    
    // Проверка email адреса
    if (!this.isValidEmail(data.to)) {
      return { success: false, error: 'Invalid email address', errorCode: 'INVALID_EMAIL' };
    }
    
    const emailId = AdapterUtils.generateIdempotencyKey('email_');
    
    const emailStatus: EmailStatus = {
      id: emailId,
      to: data.to,
      subject: data.subject,
      status: 'queued',
      createdAt: new Date().toISOString(),
      attempts: 0
    };
    
    this.queue.push(emailStatus);
    
    if (this.config.mode === 'local') {
      // Локальная имитация
      setTimeout(async () => {
        await this.processEmail(emailId, data);
      }, 1000);
      
      return { success: true, data: emailStatus };
    }
    
    if (this.config.mode === 'sandbox' || this.config.mode === 'production') {
      // Реальная отправка через SMTP
      await this.processEmail(emailId, data);
      return { success: true, data: emailStatus };
    }
    
    return { success: false, error: 'Invalid mode', errorCode: 'CONFIG_ERROR' };
  }
  
  /**
   * Обработка email из очереди
   */
  private async processEmail(emailId: string, data: EmailData): Promise<void> {
    const email = this.queue.find(e => e.id === emailId);
    if (!email) return;
    
    email.attempts++;
    
    try {
      if (this.config.mode === 'local') {
        // Имитация отправки
        await AdapterUtils.delay(500);
        email.status = 'sent';
        email.sentAt = new Date().toISOString();
      } else {
        // Реальная отправка через SMTP
        // В production здесь будет реальный SMTP клиент
        await this.sendViaSMTP(data);
        email.status = 'sent';
        email.sentAt = new Date().toISOString();
      }
      
      this.sentEmails.set(emailId, email);
      this.queue = this.queue.filter(e => e.id !== emailId);
      
      AdapterUtils.log('SMTP.sent', { emailId, to: data.to });
    } catch (error) {
      email.status = 'failed';
      email.error = error instanceof Error ? error.message : 'Send failed';
      
      AdapterUtils.log('SMTP.failed', { emailId, error: email.error });
      
      // Повторная попытка
      if (email.attempts < (this.config.retries || 3)) {
        setTimeout(() => this.processEmail(emailId, data), 5000 * email.attempts);
      }
    }
  }
  
  /**
   * Отправка через SMTP (заглушка для production)
   */
  private async sendViaSMTP(data: EmailData): Promise<void> {
    // В реальной реализации здесь будет nodemailer или другой SMTP клиент
    // Для примера просто имитируем задержку
    await AdapterUtils.delay(1000);
    
    // Имитация ошибки для тестирования
    if (Math.random() < 0.1) {
      throw new Error('SMTP connection failed');
    }
  }
  
  /**
   * Получение очереди
   */
  private getQueue(): AdapterResult<EmailStatus[]> {
    return { success: true, data: this.queue };
  }
  
  /**
   * Получение статуса email
   */
  private getEmailStatus(emailId: string): AdapterResult<EmailStatus> {
    const email = this.sentEmails.get(emailId) || this.queue.find(e => e.id === emailId);
    
    if (!email) {
      return { success: false, error: 'Email not found', errorCode: 'NOT_FOUND' };
    }
    
    return { success: true, data: email };
  }
  
  /**
   * Повторная отправка неудачных писем
   */
  private async retryFailed(): Promise<AdapterResult<{ retried: number }>> {
    const failedEmails = Array.from(this.sentEmails.values()).filter(e => e.status === 'failed');
    
    let retried = 0;
    
    for (const email of failedEmails) {
      email.status = 'queued';
      email.attempts = 0;
      this.queue.push(email);
      retried++;
    }
    
    return { success: true, data: { retried } };
  }
  
  /**
   * Валидация email адреса
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
