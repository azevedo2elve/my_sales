import { hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import type { User } from '../database/entities/User';
import { userRepository } from '../database/repositories/user.repository';

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExist = await userRepository.findByEmail(email);

    if (emailExist) {
      throw new AppError('Email address already used.', 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}
