import { inject, injectable } from 'tsyringe';
import { compare, hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { User } from '../database/entities/User';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';
import type { IUpdateProfile } from '../domain/models/IUpdateProfile';

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email) {
      const userUpdateEmail = await this.usersRepository.findByEmail(email);

      if (userUpdateEmail && userUpdateEmail.id !== user.id) {
        throw new AppError('There is already one user with this email.', 409);
      }

      user.email = email;
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.', 400);
    }

    if (password && old_password) {
      const passwordConfirmed = await compare(old_password, user.password);

      if (!passwordConfirmed) {
        throw new AppError('Old password does not match.', 400);
      }

      user.password = await hash(password, 10);
    }

    if (name) {
      user.name = name;
    }

    await this.usersRepository.save(user);

    return user as User;
  }
}
