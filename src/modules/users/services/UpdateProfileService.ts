import { compare, hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { User } from '../database/entities/User';
import { userRepository } from '../database/repositories/user.repository';

interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

export default class UpdateProfileService {
  async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<User> {
    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email) {
      const userUpdateEmail = await userRepository.findByEmail(email);

      if (userUpdateEmail) {
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

    await userRepository.save(user);

    return user;
  }
}
