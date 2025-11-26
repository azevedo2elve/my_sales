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
      if (process.env.NODE_ENV !== 'test') {
        console.warn(
          '⚠️  Redis connection failed after 3 attempts. Rate limiting disabled.',
        );
      }
      return null;
    }
    return Math.min(times * 100, 3000);
  },
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisConfig);

redisClient.on('error', error => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  Redis rate limiter error:', error.message);
    console.warn(
      '💡 Rate limiting will be disabled. Start Redis to enable it.',
    );
  }
});

redisClient.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Redis rate limiter connected');
  }
});

redisClient.connect().catch(error => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  Rate limiter: Redis connection failed:', error.message);
    console.warn(
      '💡 Rate limiting disabled. Application will continue without rate limiting.',
    );
  }
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
    if (redisClient.status !== 'ready') {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(
          '⚠️  Rate limiter: Redis not ready, bypassing rate limiting',
        );
      }
      return next();
    }

    const result = await limiter.consume(request.ip as string);
    if (process.env.NODE_ENV !== 'test') {
      console.log(
        `✅ Rate limit OK - IP: ${request.ip}, Remaining: ${result.remainingPoints}`,
      );
    }
    return next();
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('🚫 Rate limiter error:', err);
    }

    if (err.remainingPoints !== undefined) {
      if (process.env.NODE_ENV !== 'test') {
        console.log(
          `Rate limit exceeded - IP: ${request.ip}, Retry after: ${Math.round(err.msBeforeNext / 1000)}s`,
        );
      }
      throw new AppError('Too many requests. Try again later.', 429);
    }

    if (process.env.NODE_ENV !== 'test') {
      console.warn('Rate limiter bypassed due to error:', err.message);
    }
    return next();
  }
}

export async function closeRateLimiterConnection(): Promise<void> {
  try {
    await redisClient.quit();
  } catch (error) {}
}
