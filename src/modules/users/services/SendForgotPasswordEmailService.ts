import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { sendEmail } from '@config/email';

interface IForgotPassword {
  email: string;
}

interface IUserTokensRepository {
  generate(user_id: number): Promise<{ token: string } | undefined>;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  async execute({ email }: IForgotPassword): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const token = await this.userTokensRepository.generate(user.id);

    sendEmail({
      to: email,
      subject: 'Password Recovery',
      body: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 2px solid #041d40; border-radius: 10px; margin: auto; width: 60%; color: #333;">
        <h1 style="color: #041d40;">Password Reset Verification Code</h1>
        <h3 style="color: #041d40;">Dear, ${user.name}!</h3>
        <p style="font-size: 16px; color: #333;">Recover your password with this token:</p>
        <p>
          <strong style="border: 2px dashed #041d40; padding: 10px; border-radius: 5px; font-size: 16px; color: #041d40;">${token?.token}</strong>
        </p>
        <p style="margin-top: 20px;">Best regards,<br><span style="font-weight: bold; color: #041d40;">My Sales Staff</span></p>
      </div>
    `,
    });
  }
}
