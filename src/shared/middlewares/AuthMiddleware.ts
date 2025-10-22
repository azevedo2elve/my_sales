import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import jwt, { type Secret } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default class AuthMiddleware {
  static execute(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.APP_SECRET as Secret);

      const { sub } = decoded as ITokenPayload;

      req.user = {
        id: sub,
      };

      return next();
    } catch (error) {
      throw new AppError('Invalid JWT token', 401);
    }
  }
}
