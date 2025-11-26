import AppError from '../../../shared/errors/AppError';
import { productMock } from '../domain/factories/productFactory';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;

describe('CreateProductService', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
  });

  it('should be able to create a new product', async () => {
    const product = await createProductService.execute(productMock);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Product 1');
    expect(product.price).toBe(10.99);
    expect(product.quantity).toBe(100);
  });

  it('should not be able to create a product with existing name', async () => {
    await createProductService.execute(productMock);

    await expect(
      createProductService.execute(productMock),
    ).rejects.toBeInstanceOf(AppError);
  });
});
