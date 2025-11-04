import { hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import { userRepository } from '../database/repositories/user.repository';
import { userTokenRepository } from '../database/repositories/usertoken.repository';
import { isAfter, addHours } from 'date-fns';

interface IResetPassword {
  token: string;
  password: string;
}

export default class ResetPasswordService {
  async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token not exist', 404);
    }

    const user = await userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(new Date(), compareDate)) {
      throw new AppError('Token expired', 401);
    }

    user.password = await hash(password, 8);

    await userRepository.save(user);
  }
}
