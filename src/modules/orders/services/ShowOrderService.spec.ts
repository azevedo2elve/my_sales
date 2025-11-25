import AppError from '../../../shared/errors/AppError';
import { customerMock } from '../../customers/domain/factories/customerFactory';
import FakeCustomerRepositories from '../../customers/domain/repositories/fakes/FakeCustomerRepositories';
import { productMock } from '../../products/domain/factories/productFactory';
import FakeProductsRepository from '../../products/domain/repositories/fakes/FakeProductsRepository';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';
import { ShowOrderService } from './ShowOrderService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let fakeProductsRepository: FakeProductsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let createOrderService: CreateOrderService;
let showOrderService: ShowOrderService;

describe('ShowOrderService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    createOrderService = new CreateOrderService(
      fakeCustomerRepositories,
      fakeProductsRepository,
      fakeOrdersRepository,
    );
    showOrderService = new ShowOrderService(fakeOrdersRepository);
  });

  it('should be able to show an order', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);
    const product = await fakeProductsRepository.create(productMock);

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
    await expect(showOrderService.execute('999')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
