import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { userMock } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';
import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let createUserService: CreateUserService;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to send password recovery email', async () => {
    await createUserService.execute(userMock);

    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@example.com',
      }),
    ).resolves.not.toThrow();
  });

  it('should not be able to send recovery email to non-existing user', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'nonexisting@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
