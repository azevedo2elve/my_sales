import type { ICreateUser } from '../models/ICreateUser';
import type { IUser } from '../models/IUser';

export interface IUsersRepository {
  findByName(name: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  find(): Promise<IUser[]>;
}
