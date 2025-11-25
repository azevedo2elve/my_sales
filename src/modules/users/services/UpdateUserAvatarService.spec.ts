import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import type { IUser } from '../domain/models/IUser';

jest.mock('fs', () => ({
  promises: {
    stat: jest.fn().mockResolvedValue(true),
    unlink: jest.fn().mockResolvedValue(undefined),
  },
  default: {
    promises: {
      stat: jest.fn().mockResolvedValue(true),
      unlink: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

jest.mock('@config/upload', () => ({
  __esModule: true,
  default: {
    directory: '/tmp/uploads',
  },
}));

describe('UpdateUserAvatarService', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
    );

    await expect(
      updateUserAvatarService.execute({
        userId: 999,
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating to new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'old-avatar.jpg',
    });

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'new-avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });
});
