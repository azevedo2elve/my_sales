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
        if (process.env.NODE_ENV !== 'test') {
          console.log('🔗 Redis connected successfully');
        }
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        if (process.env.NODE_ENV !== 'test') {
          console.log('✅ Redis cache is ready and enabled');
        }
      });

      this.client.on('error', error => {
        this.isConnected = false;
        if (process.env.NODE_ENV !== 'test') {
          console.warn('⚠️  Redis connection error:', error.message);
          console.warn(
            '💡 Make sure Redis is running: docker run -d -p 6379:6379 redis:alpine',
          );
        }
      });

      this.client.on('reconnecting', () => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('🔄 Attempting to reconnect to Redis...');
        }
      });

      this.client
        .connect()
        .then(() => {
          if (process.env.NODE_ENV !== 'test') {
            console.log('🚀 Redis connection initiated successfully');
          }
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'test') {
            console.warn('❌ Initial Redis connection failed:', error.message);
          }
        });
    } catch (error) {
      this.isConnected = false;
      if (process.env.NODE_ENV !== 'test') {
        console.warn('❌ Redis initialization failed. Cache disabled.');
      }
    }
  }

  async save(key: string, value: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.set(key, value);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Redis save failed:', error);
      }
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
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Redis recover failed:', error);
      }
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
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Redis invalidate failed:', error);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        this.isConnected = false;
      } catch (error) {}
    }
  }
}
