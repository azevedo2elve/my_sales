import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { userMock } from '../domain/factories/userFactory';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await createUserService.execute(userMock);

    const profile = await showProfileService.execute({ user_id: user.id });

    expect(profile).toHaveProperty('id');
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show profile of non-existing user', async () => {
    await expect(
      showProfileService.execute({ user_id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
