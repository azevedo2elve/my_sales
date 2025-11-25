import { inject, injectable } from 'tsyringe';
import type { IUser } from '../domain/models/IUser';
import type { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
export default class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<IUser[]> {
    const users = await this.usersRepository.find();
    return users;
  }
}
