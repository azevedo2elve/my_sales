import AppError from '../../../shared/errors/AppError';
import { customerMock } from '../domain/factories/customerFactory';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomerService';
import DeleteCustomerService from './DeleteCustomerService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let createCustomerService: CreateCustomerService;
let deleteCustomerService: DeleteCustomerService;

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepositories);
    deleteCustomerService = new DeleteCustomerService(fakeCustomerRepositories);
  });

  it('should be able to delete a customer', async () => {
    const customer = await createCustomerService.execute(customerMock);

    await deleteCustomerService.execute({ id: customer.id });

    const deletedCustomer = await fakeCustomerRepositories.findById(
      customer.id,
    );

    expect(deletedCustomer).toBeNull();
  });

  it('should not be able to delete a non-existing customer', async () => {
    await expect(
      deleteCustomerService.execute({ id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
