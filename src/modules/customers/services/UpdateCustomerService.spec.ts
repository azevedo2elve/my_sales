import AppError from '../../../shared/errors/AppError';
import { customerMock } from '../domain/factories/customerFactory';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomerService';
import UpdateCustomerService from './UpdateCustomerService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let createCustomerService: CreateCustomerService;
let updateCustomerService: UpdateCustomerService;

describe('UpdateCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepositories);
    updateCustomerService = new UpdateCustomerService(fakeCustomerRepositories);
  });

  it('should be able to update a customer', async () => {
    const customer = await createCustomerService.execute(customerMock);

    const updatedCustomer = await updateCustomerService.execute({
      id: customer.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    });

    expect(updatedCustomer.name).toBe('Jane Doe');
    expect(updatedCustomer.email).toBe('janedoe@example.com');
  });

  it('should not be able to update a non-existing customer', async () => {
    await expect(
      updateCustomerService.execute({
        id: 999,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update customer with email already in use', async () => {
    await createCustomerService.execute(customerMock);

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
    const customer = await createCustomerService.execute(customerMock);

    const updatedCustomer = await updateCustomerService.execute({
      id: customer.id,
      name: 'John Doe Updated',
      email: 'johndoe@example.com',
    });

    expect(updatedCustomer.name).toBe('John Doe Updated');
    expect(updatedCustomer.email).toBe('johndoe@example.com');
  });
});
