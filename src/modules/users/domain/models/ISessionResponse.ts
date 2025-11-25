import type { IUser } from './IUser';

export interface ISessionResponse {
  user: IUser;
  token: string;
}
