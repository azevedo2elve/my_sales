import AppError from '../../../shared/errors/AppError';
import FakeCustomerRepositories from '../../customers/domain/repositories/fakes/FakeCustomerRepositories';
import FakeProductsRepository from '../../products/domain/repositories/fakes/FakeProductsRepository';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';
import { ShowOrderService } from './ShowOrderService';

describe('ShowOrderService', () => {
  it('should be able to show an order', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories();
    const fakeProductsRepository = new FakeProductsRepository();
    const fakeOrdersRepository = new FakeOrdersRepository();

    const createOrderService = new CreateOrderService(
      fakeCustomerRepositories,
      fakeProductsRepository,
      fakeOrdersRepository,
    );

    const showOrderService = new ShowOrderService(fakeOrdersRepository);

    const customer = await fakeCustomerRepositories.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const product = await fakeProductsRepository.create({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    const createdOrder = await createOrderService.execute({
      customer_id: customer.id,
      products: [{ id: product.id, quantity: 2 }],
    });

    const order = await showOrderService.execute(String(createdOrder.id));

    expect(order).toHaveProperty('id');
    expect(order.id).toBe(createdOrder.id);
    expect(order.customer.id).toBe(customer.id);
  });

  it('should not be able to show a non-existing order', async () => {
    const fakeOrdersRepository = new FakeOrdersRepository();
    const showOrderService = new ShowOrderService(fakeOrdersRepository);

    await expect(showOrderService.execute('999')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
