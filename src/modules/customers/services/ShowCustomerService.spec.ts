import AppError from '../../../shared/errors/AppError';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import ShowCustomerService from './ShowCustomerService';
import CreateCustomerService from './CreateCustomerService';

describe('ShowCustomerService', () => {
  it('should be able to show a customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );
    const showCustomerService = new ShowCustomerService(
      fakeCustomerRepositories,
    );

    const createdCustomer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const customer = await showCustomerService.execute({
      id: createdCustomer.id,
    });

    expect(customer).toHaveProperty('id');
    expect(customer.id).toBe(createdCustomer.id);
    expect(customer.name).toBe('John Doe');
  });

  it('should not be able to show a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const showCustomerService = new ShowCustomerService(
      fakeCustomerRepositories,
    );

    await expect(
      showCustomerService.execute({ id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
