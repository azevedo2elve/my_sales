import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { sessionMock, userMock } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import SessionUserService from './SessionUserService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let sessionUserService: SessionUserService;

describe('SessionUserService', () => {
  beforeEach(() => {
    process.env.APP_SECRET = 'test-secret';
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    sessionUserService = new SessionUserService(fakeUsersRepository);
  });

  it('should be able to authenticate user', async () => {
    await createUserService.execute(userMock);

    const response = await sessionUserService.execute(sessionMock);

    expect(response).toHaveProperty('token');
    expect(response.user).toHaveProperty('id');
    expect(response.user.email).toBe('johndoe@example.com');
  });

  it('should not be able to authenticate with non-existing user', async () => {
    await expect(
      sessionUserService.execute(sessionMock),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute(userMock);

    await expect(
      sessionUserService.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
