import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import type { User } from '../database/entities/User';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import type { IShowProfile } from '../domain/models/IShowProfile';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id }: IShowProfile): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user as User;
  }
}
