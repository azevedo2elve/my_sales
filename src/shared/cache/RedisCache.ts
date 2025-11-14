import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCache {
  private client: RedisClient;
  private isConnected: boolean = false;

  constructor() {
    try {
      this.client = new Redis({
        ...cacheConfig.config.redis,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('🔗 Redis connected successfully');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        console.log('✅ Redis cache is ready and enabled');
      });

      this.client.on('error', error => {
        this.isConnected = false;
        console.warn('⚠️  Redis connection error:', error.message);
        console.warn(
          '💡 Make sure Redis is running: docker run -d -p 6379:6379 redis:alpine',
        );
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Attempting to reconnect to Redis...');
      });

      // Tentar conectar imediatamente
      this.client
        .connect()
        .then(() => {
          console.log('🚀 Redis connection initiated successfully');
        })
        .catch(error => {
          console.warn('❌ Initial Redis connection failed:', error.message);
        });
    } catch (error) {
      this.isConnected = false;
      console.warn('❌ Redis initialization failed. Cache disabled.');
    }
  }

  async save(key: string, value: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.set(key, value);
    } catch (error) {
      console.warn('Redis save failed:', error);
    }
  }

  async recover<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      return null;
    }

    try {
      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      const parsedData = JSON.parse(data) as T;
      return parsedData;
    } catch (error) {
      console.warn('Redis recover failed:', error);
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.warn('Redis invalidate failed:', error);
    }
  }
}
