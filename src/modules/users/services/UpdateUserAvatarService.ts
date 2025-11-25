import { inject, injectable } from 'tsyringe';
import path from 'path';
import AppError from '../../../shared/errors/AppError';
import type { User } from '../database/entities/User';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import uploadConfig from '@config/upload';
import fs from 'fs';

interface IUpdateUserAvatar {
  userId: number;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, avatarFilename }: IUpdateUserAvatar): Promise<User> {
    const user = await this.usersRepository.findById(Number(userId));

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises
        .stat(userAvatarFilePath)
        .catch(() => null);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await this.usersRepository.save(user);
    return user as User;
  }
}
