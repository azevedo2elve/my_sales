import AppError from '../../../shared/errors/AppError';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import UpdateCustomerService from './UpdateCustomerService';
import CreateCustomerService from './CreateCustomerService';

describe('UpdateCustomerService', () => {
  it('should be able to update a customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );
    const updateCustomerService = new UpdateCustomerService(
      fakeCustomerRepositories,
    );

    const customer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const updatedCustomer = await updateCustomerService.execute({
      id: customer.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    });

    expect(updatedCustomer.name).toBe('Jane Doe');
    expect(updatedCustomer.email).toBe('janedoe@example.com');
  });

  it('should not be able to update a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const updateCustomerService = new UpdateCustomerService(
      fakeCustomerRepositories,
    );

    await expect(
      updateCustomerService.execute({
        id: 999,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update customer with email already in use', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );
    const updateCustomerService = new UpdateCustomerService(
      fakeCustomerRepositories,
    );

    await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const customer2 = await createCustomerService.execute({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    });

    await expect(
      updateCustomerService.execute({
        id: customer2.id,
        name: 'Jane Doe Updated',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update customer keeping same email', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );
    const updateCustomerService = new UpdateCustomerService(
      fakeCustomerRepositories,
    );

    const customer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const updatedCustomer = await updateCustomerService.execute({
      id: customer.id,
      name: 'John Doe Updated',
      email: 'johndoe@example.com',
    });

    expect(updatedCustomer.name).toBe('John Doe Updated');
    expect(updatedCustomer.email).toBe('johndoe@example.com');
  });
});
