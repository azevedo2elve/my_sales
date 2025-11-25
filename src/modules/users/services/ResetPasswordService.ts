import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import type { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import type { IResetPassword } from '../domain/models/IResetPassword';
import { isAfter, addHours } from 'date-fns';

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token not exist', 404);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(new Date(), compareDate)) {
      throw new AppError('Token expired', 401);
    }

    user.password = await hash(password, 8);

    await this.usersRepository.save(user);
  }
}
