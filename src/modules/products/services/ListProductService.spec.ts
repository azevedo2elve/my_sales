import { productMock, productMock2 } from '../domain/factories/productFactory';
import FakeProductsRepository from '../domain/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import ListProductService from './ListProductService';

// Mock RedisCache
jest.mock('../../../shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    recover: jest.fn().mockResolvedValue(null),
    invalidate: jest.fn(),
  }));
});

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;
let listProductService: ListProductService;

describe('ListProductService', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
    listProductService = new ListProductService(fakeProductsRepository);
  });

  it('should be able to list products', async () => {
    await createProductService.execute(productMock);
    await createProductService.execute(productMock2);

    const products = await listProductService.execute();

    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Product 1');
    expect(products[1].name).toBe('Product 2');
  });

  it('should return empty list when no products exist', async () => {
    const products = await listProductService.execute();

    expect(products).toHaveLength(0);
  });
});
