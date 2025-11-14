import AppError from '@shared/errors/AppError';
import { productRepository } from '../database/repository/product.repository';
import RedisCache from '../../../shared/cache/RedisCache';

interface IDeleteProduct {
  id: string;
}

export default class DeleteProductService {
  async execute({ id }: IDeleteProduct): Promise<void> {
    const redisCache = new RedisCache();
    const product = await productRepository.findById(Number(id));

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productRepository.remove(product);
  }
}
