import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '../../../shared/cache/RedisCache';
import type { IProductsRepository } from '../domain/repositories/IProductsRepository';
import type { IDeleteProduct } from '../domain/models/IDeleteProduct';

@injectable()
export default class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({ id }: IDeleteProduct): Promise<void> {
    const redisCache = new RedisCache();
    const product = await this.productsRepository.findById(Number(id));

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await this.productsRepository.remove(product);
  }
}
