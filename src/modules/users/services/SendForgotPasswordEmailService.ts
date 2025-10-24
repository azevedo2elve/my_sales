import AppError from '../../../shared/errors/AppError';
import { userRepository } from '../database/repositories/user.repository';
import { userTokenRepository } from '../database/repositories/usertoken.repository';

interface IForgotPassword {
  email: string;
}

export default class SendForgotPasswordEmailService {
  async execute({ email }: IForgotPassword): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const token = await userTokenRepository.generate(user.id);

    console.log(token);
  }
}
