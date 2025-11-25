import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { userMock, userMock2 } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    updateProfileService = new UpdateProfileService(fakeUsersRepository);
  });

  it('should be able to update user profile', async () => {
    const user = await createUserService.execute(userMock);

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('janedoe@example.com');
  });

  it('should not be able to update profile of non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 999,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email to one already in use', async () => {
    const user1 = await createUserService.execute({
      ...userMock,
      email: 'user1@example.com',
    });
    const user2 = await createUserService.execute({
      ...userMock2,
      email: 'user2@example.com',
    });

    await expect(
      updateProfileService.execute({
        user_id: user2.id,
        name: 'User 2',
        email: 'user1@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await createUserService.execute(userMock);
    const oldPassword = user.password;

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'newpassword',
      old_password: '123456',
    });

    expect(updatedUser.password).not.toBe(oldPassword);
  });

  it('should not be able to update password without old password', async () => {
    const user = await createUserService.execute(userMock);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await createUserService.execute(userMock);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'newpassword',
        old_password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user keeping same email', async () => {
    const user = await createUserService.execute(userMock);

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe Updated',
      email: 'johndoe@example.com',
    });

    expect(updatedUser.name).toBe('John Doe Updated');
    expect(updatedUser.email).toBe('johndoe@example.com');
  });
});
