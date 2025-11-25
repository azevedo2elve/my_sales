export interface IUserToken {
  token: string;
  user_id: number;
  created_at: Date;
}

export interface IUserTokensRepository {
  generate(user_id: number): Promise<IUserToken | undefined>;
  findByToken(token: string): Promise<IUserToken | null>;
}
