import AppDataSource from '@shared/infra/typeorm/data-source';
import { User } from '@modules/users/database/entities/User';
import type { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import type { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import type { IUser } from '@modules/users/domain/models/IUser';
import type { Repository } from 'typeorm';

export default class UserRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  async findByName(name: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ name });
    return user;
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ email });
    return user;
  }

  async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user;
  }

  async save(user: IUser): Promise<IUser> {
    return await this.ormRepository.save(user as User);
  }

  async find(): Promise<IUser[]> {
    return await this.ormRepository.find();
  }
}
