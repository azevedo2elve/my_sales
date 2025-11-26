import AppError from '../../../shared/errors/AppError';
import { productMock } from '../domain/factories/productFactory';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import ShowProductService from './ShowProductService';

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let showProductService: ShowProductService;

describe('ShowProductService', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
    showProductService = new ShowProductService(fakeProductsRepository);
  });

  it('should be able to show a product', async () => {
    const createdProduct = await createProductService.execute(productMock);

    const product = await showProductService.execute({
      id: String(createdProduct.id),
    });

    expect(product).toHaveProperty('id');
    expect(product.id).toBe(createdProduct.id);
    expect(product.name).toBe('Product 1');
  });

  it('should not be able to show a non-existing product', async () => {
    await expect(
      showProductService.execute({ id: '999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
