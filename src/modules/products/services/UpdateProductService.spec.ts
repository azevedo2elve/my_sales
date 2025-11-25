import AppError from '../../../shared/errors/AppError';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import UpdateProductService from './UpdateProductService';
import CreateProductService from './CreateProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }));
});

describe('UpdateProductService', () => {
  it('should be able to update a product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const updateProductService = new UpdateProductService(
      fakeProductsRepository,
    );

    const product = await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

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
    const fakeProductsRepository = new FakeProductsRepository();
    const updateProductService = new UpdateProductService(
      fakeProductsRepository,
    );

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
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const updateProductService = new UpdateProductService(
      fakeProductsRepository,
    );

    await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

    const product2 = await createProductService.execute({
      name: 'Product 2',
      price: 20.99,
      quantity: 50,
    });

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
    const fakeProductsRepository = new FakeProductsRepository();
    const createProductService = new CreateProductService(
      fakeProductsRepository,
    );
    const updateProductService = new UpdateProductService(
      fakeProductsRepository,
    );

    const product = await createProductService.execute({
      name: 'Product 1',
      price: 10.99,
      quantity: 100,
    });

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
