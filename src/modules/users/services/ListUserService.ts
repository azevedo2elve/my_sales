import type { User } from '../database/entities/User';
import { userRepository } from '../database/repositories/user.repository';

export default class ListUserService {
  async execute(): Promise<User[]> {
    const users = await userRepository.find();
    return users;
  }
}
