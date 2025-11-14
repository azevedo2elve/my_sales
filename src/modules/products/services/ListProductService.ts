import RedisCache from '../../../shared/cache/RedisCache';
import { Product } from '../database/entities/Product';
import { productRepository } from '../database/repository/product.repository';

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[]>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await productRepository.find();

      await redisCache.save(
        'api-vendas-PRODUCT_LIST',
        JSON.stringify(products),
      );
    }

    return products;
  }
}
