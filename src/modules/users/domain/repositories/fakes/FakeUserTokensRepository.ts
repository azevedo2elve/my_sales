import UserToken from '../../../database/entities/UserToken';
import type {
  IUserTokensRepository,
  IUserToken,
} from '../IUserTokensRepository';
import { v4 as uuidv4 } from 'uuid';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );
    return userToken || null;
  }

  public async generate(user_id: number): Promise<IUserToken> {
    const userToken = new UserToken();

    userToken.id = this.userTokens.length + 1;
    userToken.token = uuidv4();
    userToken.user_id = user_id;
    userToken.created_at = new Date();
    userToken.updated_at = new Date();

    this.userTokens.push(userToken);

    return userToken;
  }
}
