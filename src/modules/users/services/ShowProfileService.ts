import AppError from '@shared/errors/AppError';
import type { User } from '../database/entities/User';
import { userRepository } from '../database/repositories/user.repository';

interface IShowProfile {
  user_id: number;
}

export default class ShowProfileService {
  async execute({ user_id }: IShowProfile): Promise<User> {
    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
