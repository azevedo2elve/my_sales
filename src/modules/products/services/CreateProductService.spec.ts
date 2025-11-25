import AppError from '../../../shared/errors/AppError';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }));
});

describe('CreateProductService', () => {
  it('should be able to create a new product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );

    const product = await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Product 1');
    expect(product.price).toBe(10.99);
    expect(product.quantity).toBe(100);
  });

  it('should not be able to create a product with existing name', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );

    await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    await expect(
      createProductService.execute({
        name: 'Product 1',
        price: 15.99,
        quantity: 50,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
