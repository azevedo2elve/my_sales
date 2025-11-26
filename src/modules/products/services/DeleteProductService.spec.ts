import AppError from '../../../shared/errors/AppError';
import { productMock } from '../domain/factories/productFactory';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import DeleteProductService from './DeleteProductService';

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let deleteProductService: DeleteProductService;

describe('DeleteProductService', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
    deleteProductService = new DeleteProductService(fakeProductsRepository);
  });

  it('should be able to delete a product', async () => {
    const product = await createProductService.execute(productMock);

    await deleteProductService.execute({ id: String(product.id) });

    const deletedProduct = await fakeProductsRepository.findById(product.id);

    expect(deletedProduct).toBeNull();
  });

  it('should not be able to delete a non-existing product', async () => {
    await expect(
      deleteProductService.execute({ id: '999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
