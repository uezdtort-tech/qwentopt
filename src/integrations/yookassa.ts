/**
 * Адаптер YooKassa для обработки платежей
 * 
 * Поддерживает три режима:
 * - local: локальная имитация платежей (для разработки)
 * - sandbox: тестовая среда YooKassa
 * - production: боевая среда
 */

import { Adapter, AdapterConfig, AdapterResult, AdapterUtils } from './adapter';

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'succeeded' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  metadata?: Record<string, any>;
}

export interface RefundData {
  paymentId: string;
  amount: number;
  reason?: string;
}

export class YooKassaAdapter implements Adapter {
  name = 'YooKassa';
  config: AdapterConfig;
  
  private payments: Map<string, PaymentStatus> = new Map();
  
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
        this.config.credentials?.shopId &&
        this.config.credentials?.secretKey
      );
    }
    
    return false;
  }
  
  async execute(operation: string, params?: any): Promise<AdapterResult<any>> {
    AdapterUtils.log(`YooKassa.${operation}`, { mode: this.config.mode });
    
    try {
      switch (operation) {
        case 'createPayment':
          return await this.createPayment(params);
        case 'getPayment':
          return await this.getPayment(params);
        case 'cancelPayment':
          return await this.cancelPayment(params);
        case 'createRefund':
          return await this.createRefund(params);
        case 'handleWebhook':
          return await this.handleWebhook(params);
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
   * Создание платежа
   */
  private async createPayment(data: PaymentData): Promise<AdapterResult<PaymentStatus>> {
    // Валидация
    if (!data.orderId || !data.amount || data.amount <= 0) {
      return { success: false, error: 'Invalid payment data', errorCode: 'VALIDATION_ERROR' };
    }
    
    if (this.config.mode === 'local') {
      // Локальная имитация
      const payment: PaymentStatus = {
        id: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        status: 'pending',
        amount: data.amount,
        currency: data.currency || 'RUB',
        createdAt: new Date().toISOString(),
        metadata: {
          orderId: data.orderId,
          description: data.description,
          testMode: true
        }
      };
      
      this.payments.set(payment.id, payment);
      
      // Автоматически подтверждаем через 2 секунды в тестовом режиме
      setTimeout(() => {
        const p = this.payments.get(payment.id);
        if (p && p.status === 'pending') {
          p.status = 'succeeded';
          p.paidAt = new Date().toISOString();
        }
      }, 2000);
      
      return { success: true, data: payment };
    }
    
    if (this.config.mode === 'sandbox' || this.config.mode === 'production') {
      // Реальный API вызов
      return await AdapterUtils.withRetry(async () => {
        const response = await fetch('https://api.yookassa.ru/v3/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotence-Key': AdapterUtils.generateIdempotencyKey('payment_'),
            'Authorization': `Basic ${btoa(`${this.config.credentials?.shopId}:${this.config.credentials?.secretKey}`)}`
          },
          body: JSON.stringify({
            amount: {
              value: data.amount.toFixed(2),
              currency: data.currency || 'RUB'
            },
            confirmation: {
              type: 'redirect',
              return_url: data.returnUrl
            },
            description: data.description,
            metadata: {
              orderId: data.orderId,
              ...data.metadata
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`YooKassa API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        const payment: PaymentStatus = {
          id: result.id,
          status: result.status,
          amount: parseFloat(result.amount.value),
          currency: result.amount.currency,
          createdAt: result.created_at,
          metadata: result.metadata
        };
        
        this.payments.set(payment.id, payment);
        
        return { success: true, data: payment };
      }, this.config.retries, 1000);
    }
    
    return { success: false, error: 'Invalid mode', errorCode: 'CONFIG_ERROR' };
  }
  
  /**
   * Получение статуса платежа
   */
  private async getPayment(paymentId: string): Promise<AdapterResult<PaymentStatus>> {
    const payment = this.payments.get(paymentId);
    
    if (!payment) {
      return { success: false, error: 'Payment not found', errorCode: 'NOT_FOUND' };
    }
    
    return { success: true, data: payment };
  }
  
  /**
   * Отмена платежа
   */
  private async cancelPayment(paymentId: string): Promise<AdapterResult<PaymentStatus>> {
    const payment = this.payments.get(paymentId);
    
    if (!payment) {
      return { success: false, error: 'Payment not found', errorCode: 'NOT_FOUND' };
    }
    
    if (payment.status !== 'pending') {
      return { success: false, error: 'Cannot cancel non-pending payment', errorCode: 'INVALID_STATE' };
    }
    
    payment.status = 'cancelled';
    
    return { success: true, data: payment };
  }
  
  /**
   * Создание возврата
   */
  private async createRefund(data: RefundData): Promise<AdapterResult<PaymentStatus>> {
    const payment = this.payments.get(data.paymentId);
    
    if (!payment) {
      return { success: false, error: 'Payment not found', errorCode: 'NOT_FOUND' };
    }
    
    if (payment.status !== 'succeeded') {
      return { success: false, error: 'Cannot refund non-succeeded payment', errorCode: 'INVALID_STATE' };
    }
    
    if (data.amount > payment.amount) {
      return { success: false, error: 'Refund amount exceeds payment', errorCode: 'VALIDATION_ERROR' };
    }
    
    payment.status = 'refunded';
    payment.refundedAt = new Date().toISOString();
    
    return { success: true, data: payment };
  }
  
  /**
   * Обработка webhook от YooKassa
   */
  private async handleWebhook(payload: any): Promise<AdapterResult<void>> {
    // Проверка подписи (в production)
    if (this.config.mode === 'production') {
      // TODO: Реализовать проверку подписи согласно документации YooKassa
      AdapterUtils.log('YooKassa.webhook', { event: payload.event });
    }
    
    const { event, object } = payload;
    
    switch (event) {
      case 'payment.succeeded':
        const payment = this.payments.get(object.id);
        if (payment) {
          payment.status = 'succeeded';
          payment.paidAt = object.paid_at;
        }
        break;
        
      case 'payment.canceled':
        const cancelledPayment = this.payments.get(object.id);
        if (cancelledPayment) {
          cancelledPayment.status = 'cancelled';
        }
        break;
        
      case 'refund.succeeded':
        // Обработка возврата
        break;
    }
    
    return { success: true };
  }
}
