import AppError from '../../../shared/errors/AppError';
import { customerMock } from '../domain/factories/customerFactory';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomerService';
import ShowCustomerService from './ShowCustomerService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let createCustomerService: CreateCustomerService;
let showCustomerService: ShowCustomerService;

describe('ShowCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepositories);
    showCustomerService = new ShowCustomerService(fakeCustomerRepositories);
  });

  it('should be able to show a customer', async () => {
    const createdCustomer = await createCustomerService.execute(customerMock);

    const customer = await showCustomerService.execute({
      id: createdCustomer.id,
    });

    expect(customer).toHaveProperty('id');
    expect(customer.id).toBe(createdCustomer.id);
    expect(customer.name).toBe('John Doe');
  });

  it('should not be able to show a non-existing customer', async () => {
    await expect(
      showCustomerService.execute({ id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
