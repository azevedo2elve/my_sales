import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomerService';
import ListCustomerService from './ListCustomerService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let createCustomerService: CreateCustomerService;
let listCustomerService: ListCustomerService;

describe('ListCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepositories);
    listCustomerService = new ListCustomerService(fakeCustomerRepositories);
  });

  it('should be able to list customers with pagination', async () => {
    await createCustomerService.execute({
      name: 'Customer 1',
      email: 'customer1@example.com',
    });

    await createCustomerService.execute({
      name: 'Customer 2',
      email: 'customer2@example.com',
    });

    await createCustomerService.execute({
      name: 'Customer 3',
      email: 'customer3@example.com',
    });

    const result = await listCustomerService.execute(1, 2);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(3);
    expect(result.current_page).toBe(1);
    expect(result.per_page).toBe(2);
    expect(result.total_pages).toBe(2);
    expect(result.next_page).toBe(2);
    expect(result.prev_page).toBeNull();
  });

  it('should return empty list when no customers exist', async () => {
    const result = await listCustomerService.execute();

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
