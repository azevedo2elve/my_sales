import type { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

export default class ErrorHandleMiddleware {
  public static handleError(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        type: 'error',
        message: error.message,
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error('Internal Server Error:', error);
    }

    return res.status(500).json({
      type: 'error',
      message: 'Internal server error',
    });
  }
}
