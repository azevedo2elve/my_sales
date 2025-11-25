import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import type { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

const redisConfig: any = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.warn(
        '⚠️  Redis connection failed after 3 attempts. Rate limiting disabled.',
      );
      return null; // Stop retrying
    }
    return Math.min(times * 100, 3000);
  },
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisConfig);

// Tratar erros de conexão do Redis
redisClient.on('error', error => {
  console.warn('⚠️  Redis rate limiter error:', error.message);
  console.warn('💡 Rate limiting will be disabled. Start Redis to enable it.');
});

redisClient.on('connect', () => {
  console.log('✅ Redis rate limiter connected');
});

// Tentar conectar
redisClient.connect().catch(error => {
  console.warn('⚠️  Rate limiter: Redis connection failed:', error.message);
  console.warn(
    '💡 Rate limiting disabled. Application will continue without rate limiting.',
  );
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 5,
  duration: 10,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Verificar se o Redis está conectado
    if (redisClient.status !== 'ready') {
      console.warn(
        '⚠️  Rate limiter: Redis not ready, bypassing rate limiting',
      );
      return next();
    }

    const result = await limiter.consume(request.ip as string);
    console.log(
      `✅ Rate limit OK - IP: ${request.ip}, Remaining: ${result.remainingPoints}`,
    );
    return next();
  } catch (err: any) {
    console.log('🚫 Rate limiter error:', err);

    if (err.remainingPoints !== undefined) {
      console.log(
        `Rate limit exceeded - IP: ${request.ip}, Retry after: ${Math.round(err.msBeforeNext / 1000)}s`,
      );
      throw new AppError('Too many requests. Try again later.', 429);
    }

    console.warn('Rate limiter bypassed due to error:', err.message);
    return next();
  }
}
