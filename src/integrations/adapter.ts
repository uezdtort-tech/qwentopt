/**
 * Базовый интерфейс адаптера внешнего сервиса
 */

export interface AdapterConfig {
  mode: 'production' | 'sandbox' | 'local';
  credentials?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface AdapterResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  metadata?: Record<string, any>;
}

export interface Adapter<T = any> {
  name: string;
  config: AdapterConfig;
  
  /**
   * Проверка конфигурации
   */
  validateConfig(): boolean;
  
  /**
   * Выполнение операции
   */
  execute(operation: string, params?: any): Promise<AdapterResult<T>>;
  
  /**
   * Получение статуса
   */
  getStatus(): string;
}

/**
 * Фабрика адаптеров
 */
export class AdapterFactory {
  private static adapters: Map<string, Adapter> = new Map();
  
  static register(name: string, adapter: Adapter): void {
    this.adapters.set(name, adapter);
  }
  
  static get(name: string): Adapter | undefined {
    return this.adapters.get(name);
  }
  
  static getAll(): Map<string, Adapter> {
    return this.adapters;
  }
}

/**
 * Утилиты для адаптеров
 */
export class AdapterUtils {
  /**
   * Генерация идемпотентности ключа
   */
  static generateIdempotencyKey(prefix: string = ''): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}${timestamp}_${random}`;
  }
  
  /**
   * Задержка перед повторной попыткой
   */
  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Выполнение с повторными попытками
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await this.delay(delayMs * (i + 1));
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Логирование без секретов
   */
  static log(operation: string, data: Record<string, any>): void {
    const sanitized = { ...data };
    
    // Удаляем потенциальные секреты
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credentials'];
    sensitiveKeys.forEach(key => {
      if (key in sanitized) {
        sanitized[key] = '***';
      }
    });
    
    console.log(`[${new Date().toISOString()}] ${operation}:`, sanitized);
  }
  
  /**
   * Валидация URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
