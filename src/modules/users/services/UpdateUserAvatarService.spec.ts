import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { userMock } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

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

let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository);
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create(userMock);

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of non-existing user', async () => {
    await expect(
      updateUserAvatarService.execute({
        userId: 999,
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating to new one', async () => {
    const user = await fakeUsersRepository.create(userMock);

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
