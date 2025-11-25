import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfileService', () => {
  it('should be able to update user profile', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('janedoe@example.com');
  });

  it('should not be able to update profile of non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    await expect(
      updateProfileService.execute({
        user_id: 999,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email to one already in use', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    await createUserService.execute({
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    });

    const user2 = await createUserService.execute({
      name: 'User 2',
      email: 'user2@example.com',
      password: '123456',
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
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

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
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

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
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

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
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const updateProfileService = new UpdateProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe Updated',
      email: 'johndoe@example.com',
    });

    expect(updatedUser.name).toBe('John Doe Updated');
    expect(updatedUser.email).toBe('johndoe@example.com');
  });
});
