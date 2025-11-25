import 'reflect-metadata';
import { userMock, userMock2 } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ListUserService from './ListUserService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let listUserService: ListUserService;

describe('ListUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    listUserService = new ListUserService(fakeUsersRepository);
  });

  it('should be able to list users', async () => {
    await createUserService.execute({
      ...userMock,
      email: 'user1@example.com',
    });
    await createUserService.execute({
      ...userMock2,
      email: 'user2@example.com',
    });

    const users = await listUserService.execute();

    expect(users).toHaveLength(2);
    expect(users[0].email).toBe('user1@example.com');
    expect(users[1].email).toBe('user2@example.com');
  });

  it('should return empty list when no users exist', async () => {
    const users = await listUserService.execute();

    expect(users).toHaveLength(0);
  });
});
