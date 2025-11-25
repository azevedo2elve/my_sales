import AppError from '../../../shared/errors/AppError';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomerService';

describe('CreateCustomerService', () => {
  it('should be able to create a new customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );

    const customer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('johndoe@example.com');
  });

  it('should not be able to create a new customer with email that is already in use', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );

    await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await expect(
      createCustomerService.execute({
        name: 'Jane Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
