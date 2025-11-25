import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';

describe('ShowProfileService', () => {
  it('should be able to show user profile', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const showProfileService = new ShowProfileService(fakeUsersRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({ user_id: user.id });

    expect(profile).toHaveProperty('id');
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show profile of non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const showProfileService = new ShowProfileService(fakeUsersRepository);

    await expect(
      showProfileService.execute({ user_id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
