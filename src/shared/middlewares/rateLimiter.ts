import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import type { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

const redisConfig: any = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisConfig);

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
