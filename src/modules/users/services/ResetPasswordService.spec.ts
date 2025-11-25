import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';
import CreateUserService from './CreateUserService';
import ResetPasswordService from './ResetPasswordService';
import { addHours } from 'date-fns';

describe('ResetPasswordService', () => {
  it('should be able to reset password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);
    const oldPassword = user.password;

    await resetPasswordService.execute({
      token: userToken.token,
      password: 'newpassword',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).not.toBe(oldPassword);
  });

  it('should not be able to reset password with non-existing token', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    const userToken = await fakeUserTokensRepository.generate(999);

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with expired token', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    // Simulate token creation 3 hours ago
    userToken.created_at = addHours(new Date(), -3);

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
