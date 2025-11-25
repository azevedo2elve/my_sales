import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';
import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

// Mock sendEmail
jest.mock('@config/email', () => ({
  sendEmail: jest.fn(),
}));

describe('SendForgotPasswordEmailService', () => {
  it('should be able to send password recovery email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@example.com',
      }),
    ).resolves.not.toThrow();
  });

  it('should not be able to send recovery email to non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'nonexisting@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
