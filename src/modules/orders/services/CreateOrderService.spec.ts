import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import { customerMock } from '../../customers/domain/factories/customerFactory';
import FakeCustomerRepositories from '../../customers/domain/repositories/fakes/FakeCustomerRepositories';
import {
  productMock,
  productMock2,
} from '../../products/domain/factories/productFactory';
import FakeProductsRepository from '../../products/domain/repositories/fakes/FakeProductsRepository';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';

let fakeCustomerRepositories: FakeCustomerRepositories;
let fakeProductsRepository: FakeProductsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let createOrderService: CreateOrderService;

describe('CreateOrderService', () => {
  beforeEach(() => {
    fakeCustomerRepositories = new FakeCustomerRepositories();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    createOrderService = new CreateOrderService(
      fakeCustomerRepositories,
      fakeProductsRepository,
      fakeOrdersRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);
    const product1 = await fakeProductsRepository.create(productMock);
    const product2 = await fakeProductsRepository.create(productMock2);

    const order = await createOrderService.execute({
      customer_id: customer.id,
      products: [
        { id: product1.id, quantity: 2 },
        { id: product2.id, quantity: 1 },
      ],
    });

    expect(order).toHaveProperty('id');
    expect(order.customer.id).toBe(customer.id);
    expect(order.order_products).toHaveLength(2);
    expect(order.order_products[0].price).toBe(10.99);
    expect(order.order_products[1].price).toBe(20.99);
  });

  it('should not be able to create order with non-existing customer', async () => {
    await expect(
      createOrderService.execute({
        customer_id: 999,
        products: [{ id: 1, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create order with non-existing product', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);

    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        products: [{ id: 999, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create order with product with insufficient quantity', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);
    const product = await fakeProductsRepository.create({
      name: 'Product 1',
      price: 10.99,
      quantity: 5,
    });

    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        products: [{ id: product.id, quantity: 10 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update product quantity after creating order', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);
    const product = await fakeProductsRepository.create(productMock);

    await createOrderService.execute({
      customer_id: customer.id,
      products: [{ id: product.id, quantity: 10 }],
    });

    const updatedProduct = await fakeProductsRepository.findById(product.id);

    expect(updatedProduct?.quantity).toBe(90);
  });

  it('should not be able to create order with some non-existing products', async () => {
    const customer = await fakeCustomerRepositories.create(customerMock);
    const product1 = await fakeProductsRepository.create(productMock);

    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        products: [
          { id: product1.id, quantity: 1 },
          { id: 999, quantity: 1 },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
