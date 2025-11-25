import AppError from '../../../shared/errors/AppError';
import { productMock, productMock2 } from '../domain/factories/productFactory';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import UpdateProductService from './UpdateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }));
});

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let updateProductService: UpdateProductService;

describe('UpdateProductService', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
    updateProductService = new UpdateProductService(fakeProductsRepository);
  });

  it('should be able to update a product', async () => {
    const product = await createProductService.execute(productMock);

    const updatedProduct = await updateProductService.execute({
      id: String(product.id),
      name: 'Product 1 Updated',
      price: 15.99,
      quantity: 150,
    });

    expect(updatedProduct.name).toBe('Product 1 Updated');
    expect(updatedProduct.price).toBe(15.99);
    expect(updatedProduct.quantity).toBe(150);
  });

  it('should not be able to update a non-existing product', async () => {
    await expect(
      updateProductService.execute({
        id: '999',
        name: 'Product Updated',
        price: 15.99,
        quantity: 150,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update product with name already in use', async () => {
    await createProductService.execute(productMock);
    const product2 = await createProductService.execute(productMock2);

    await expect(
      updateProductService.execute({
        id: String(product2.id),
        name: 'Product 1',
        price: 25.99,
        quantity: 60,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update product keeping same name', async () => {
    const product = await createProductService.execute(productMock);

    const updatedProduct = await updateProductService.execute({
      id: String(product.id),
      name: 'Product 1',
      price: 15.99,
      quantity: 150,
    });

    expect(updatedProduct.name).toBe('Product 1');
    expect(updatedProduct.price).toBe(15.99);
    expect(updatedProduct.quantity).toBe(150);
  });
});
