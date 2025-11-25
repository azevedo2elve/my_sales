import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { User } from '../database/entities/User';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import type { ISessionUser } from '../domain/models/ISessionUser';
import type { ISessionResponse } from '../domain/models/ISessionResponse';
import jwt, { type Secret } from 'jsonwebtoken';

@injectable()
export default class SessionUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: ISessionUser): Promise<ISessionResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({}, process.env.APP_SECRET as Secret, {
      subject: String(user.id),
      expiresIn: '1d',
    });

    return {
      user: user as User,
      token,
    };
  }
}
