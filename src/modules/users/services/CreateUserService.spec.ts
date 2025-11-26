import 'reflect-metadata';
import { hash } from 'bcrypt';
import AppError from '../../../shared/errors/AppError';
import { userMock, userMock2 } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute(userMock);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should not be able to create a user with existing email', async () => {
    await createUserService.execute(userMock);

    await expect(
      createUserService.execute({ ...userMock2, email: userMock.email }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should hash user password', async () => {
    const user = await createUserService.execute(userMock);

    expect(user.password).not.toBe('123456');
    expect(user.password).toBe('hashed-123456');
  });
});
