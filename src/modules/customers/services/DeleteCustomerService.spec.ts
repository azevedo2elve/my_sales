import AppError from '../../../shared/errors/AppError';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import DeleteCustomerService from './DeleteCustomerService';
import CreateCustomerService from './CreateCustomerService';

describe('DeleteCustomerService', () => {
  it('should be able to delete a customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const createCustomerService = new CreateCustomerService(
      fakeCustomerRepositories,
    );
    const deleteCustomerService = new DeleteCustomerService(
      fakeCustomerRepositories,
    );

    const customer = await createCustomerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    await deleteCustomerService.execute({ id: customer.id });

    const deletedCustomer = await fakeCustomerRepositories.findById(
      customer.id,
    );

    expect(deletedCustomer).toBeNull();
  });

  it('should not be able to delete a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const deleteCustomerService = new DeleteCustomerService(
      fakeCustomerRepositories,
    );

    await expect(
      deleteCustomerService.execute({ id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
