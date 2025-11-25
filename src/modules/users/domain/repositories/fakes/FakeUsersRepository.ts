import type { ICreateUser } from '../../models/ICreateUser';
import type { IUser } from '../../models/IUser';
import type { IUsersRepository } from '../IUsersRepository';

class FakeUser implements IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.name = '';
    this.email = '';
    this.password = '';
    this.avatar = null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

export default class FakeUsersRepository implements IUsersRepository {
  private users: IUser[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = new FakeUser();

    user.id = this.users.length + 1;
    user.name = name;
    user.email = email;
    user.password = password;
    user.avatar = null;
    user.created_at = new Date();
    user.updated_at = new Date();

    this.users.push(user);

    return user;
  }

  public async save(user: IUser): Promise<IUser> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    if (findIndex >= 0) {
      this.users[findIndex] = user;
    }

    return user;
  }

  public async find(): Promise<IUser[]> {
    return this.users;
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = this.users.find(findUser => findUser.name === name);
    return user || null;
  }

  public async findById(id: number): Promise<IUser | null> {
    const user = this.users.find(findUser => findUser.id === id);
    return user || null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find(findUser => findUser.email === email);
    return user || null;
  }
}
