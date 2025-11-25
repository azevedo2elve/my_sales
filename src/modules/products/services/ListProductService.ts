import { inject, injectable } from 'tsyringe';
import RedisCache from '../../../shared/cache/RedisCache';
import type { IProduct } from '../domain/models/IProduct';
import type { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute(): Promise<IProduct[]> {
    const redisCache = new RedisCache();

    let products = await redisCache.recover<IProduct[]>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await this.productsRepository.find();

      await redisCache.save(
        'api-vendas-PRODUCT_LIST',
        JSON.stringify(products),
      );
    }

    return products;
  }
}
