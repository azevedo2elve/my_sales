import type { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = new ResetPasswordService();

    await resetPassword.execute({
      password,
      token,
    });

    return response.status(204).json();
  }
}
