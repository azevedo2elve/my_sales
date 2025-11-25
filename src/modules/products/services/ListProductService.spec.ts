import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import ListProductService from './ListProductService';
import CreateProductService from './CreateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn().mockResolvedValue(null),
    invalidate: jest.fn(),
  }));
});

describe('ListProductService', () => {
  it('should be able to list products', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const listProductService = new ListProductService(fakeProductsRepository);

    await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    await createProductService.execute({
      name: 'Product 2',
      price: 20.99,
      quantity: 50,
    });

    const products = await listProductService.execute();

    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Product 1');
    expect(products[1].name).toBe('Product 2');
  });

  it('should return empty list when no products exist', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const listProductService = new ListProductService(fakeProductsRepository);

    const products = await listProductService.execute();

    expect(products).toHaveLength(0);
  });
});
