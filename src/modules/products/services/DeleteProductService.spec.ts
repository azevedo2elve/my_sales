import AppError from '../../../shared/errors/AppError';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import DeleteProductService from './DeleteProductService';
import CreateProductService from './CreateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }));
});

describe('DeleteProductService', () => {
  it('should be able to delete a product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const deleteProductService = new DeleteProductService(
      fakeProductsRepository,
    );

    const product = await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    await deleteProductService.execute({ id: String(product.id) });

    const deletedProduct = await fakeProductsRepository.findById(product.id);

    expect(deletedProduct).toBeNull();
  });

  it('should not be able to delete a non-existing product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const deleteProductService = new DeleteProductService(
      fakeProductsRepository,
    );

    await expect(
      deleteProductService.execute({ id: '999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
