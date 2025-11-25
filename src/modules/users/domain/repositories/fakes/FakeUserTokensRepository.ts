import UserToken from '../../../database/entities/UserToken';
import { v4 as uuidv4 } from 'uuid';

export default class FakeUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );
    return userToken || null;
  }

  public async generate(user_id: number): Promise<UserToken> {
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
