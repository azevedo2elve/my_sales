import AppError from '../../../shared/errors/AppError';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import ShowProductService from './ShowProductService';
import CreateProductService from './CreateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }));
});

describe('ShowProductService', () => {
  it('should be able to show a product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const showProductService = new ShowProductService(fakeProductsRepository);

    const createdProduct = await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    const product = await showProductService.execute({
      id: String(createdProduct.id),
    });

    expect(product).toHaveProperty('id');
    expect(product.id).toBe(createdProduct.id);
    expect(product.name).toBe('Product 1');
  });

  it('should not be able to show a non-existing product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const showProductService = new ShowProductService(fakeProductsRepository);

    await expect(
      showProductService.execute({ id: '999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
