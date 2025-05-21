
export interface StorageOptions {
  prefix?: string;
  expiryDays?: number;
}

export class StorageService {
  private prefix: string;
  private expiryDays?: number;
  
  constructor(options?: StorageOptions) {
    this.prefix = options?.prefix || 'app_';
    this.expiryDays = options?.expiryDays;
  }
  
  getItem<T>(key: string, defaultValue: T): T {
    const fullKey = this.getFullKey(key);
    try {
      const item = localStorage.getItem(fullKey);
      if (item === null) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      // Check if item has expired
      if (parsed.__expiryDate && new Date(parsed.__expiryDate) < new Date()) {
        this.removeItem(key);
        return defaultValue;
      }
      
      return parsed.value !== undefined ? parsed.value : parsed;
    } catch (e) {
      console.error(`Error retrieving ${key} from storage:`, e);
      return defaultValue;
    }
  }
  
  setItem<T>(key: string, value: T, expiryDays?: number): void {
    const fullKey = this.getFullKey(key);
    try {
      const daysToExpire = expiryDays !== undefined ? expiryDays : this.expiryDays;
      
      const item = daysToExpire
        ? {
            value,
            __expiryDate: this.calculateExpiryDate(daysToExpire)
          }
        : value;
        
      localStorage.setItem(fullKey, JSON.stringify(item));
    } catch (e) {
      console.error(`Error storing ${key} to storage:`, e);
    }
  }
  
  removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    localStorage.removeItem(fullKey);
  }
  
  clear(onlyWithPrefix: boolean = true): void {
    if (onlyWithPrefix) {
      // Clear only items with this service's prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      localStorage.clear();
    }
  }
  
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }
  
  private calculateExpiryDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}

// Export a default instance
export const storage = new StorageService({ 
  prefix: 'quiz_', 
  expiryDays: 30
});
