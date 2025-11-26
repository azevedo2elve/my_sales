import AppDataSource from '@shared/infra/typeorm/data-source';
import { Repository } from 'typeorm';
import {
  IUserToken,
  IUserTokensRepository,
} from '../../../domain/repositories/IUserTokensRepository';
import { UserToken } from '../../../database/entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserToken);
  }

  async generate(user_id: number): Promise<IUserToken | undefined> {
    const userToken = this.ormRepository.create({ user_id });
    await this.ormRepository.save(userToken);
    return userToken;
  }

  async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOne({ where: { token } });
    return userToken;
  }
}
