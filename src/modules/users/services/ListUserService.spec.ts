import 'reflect-metadata';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import ListUserService from './ListUserService';
import CreateUserService from './CreateUserService';

describe('ListUserService', () => {
  it('should be able to list users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const listUserService = new ListUserService(fakeUsersRepository);

    await createUserService.execute({
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    });

    await createUserService.execute({
      name: 'User 2',
      email: 'user2@example.com',
      password: '654321',
    });

    const users = await listUserService.execute();

    expect(users).toHaveLength(2);
    expect(users[0].name).toBe('User 1');
    expect(users[1].name).toBe('User 2');
  });

  it('should return empty list when no users exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const listUserService = new ListUserService(fakeUsersRepository);

    const users = await listUserService.execute();

    expect(users).toHaveLength(0);
  });
});
