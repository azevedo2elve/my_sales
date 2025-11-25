import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { IUser } from '../domain/models/IUser';
import type { ICreateUser } from '../domain/models/ICreateUser';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const emailExist = await this.usersRepository.findByEmail(email);

    if (emailExist) {
      throw new AppError('Email address already used.', 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
