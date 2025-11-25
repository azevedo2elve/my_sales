import { inject, injectable } from 'tsyringe';
import RedisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import type { IProduct } from '../domain/models/IProduct';
import type { ICreateProduct } from '../domain/models/ICreateProduct';
import type { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({ name, price, quantity }: ICreateProduct): Promise<IProduct> {
    const redisCache = new RedisCache();
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name', 409);
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    return product;
  }
}
