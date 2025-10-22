import type { Request, Response } from 'express';
import SessionUserService from '../services/SessionUserService';

export default class SessionController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSession = new SessionUserService();

    const userToken = await createSession.execute({ email, password });
    return response.json(userToken);
  }
}
