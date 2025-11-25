import 'reflect-metadata';
import { addHours } from 'date-fns';
import AppError from '../../../shared/errors/AppError';
import { userMock } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';
import CreateUserService from './CreateUserService';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let createUserService: CreateUserService;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset password', async () => {
    const user = await createUserService.execute(userMock);
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
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const userToken = await fakeUserTokensRepository.generate(999);

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with expired token', async () => {
    const user = await createUserService.execute(userMock);
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
