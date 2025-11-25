import { inject, injectable } from 'tsyringe';
import RedisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import type { IProduct } from '../domain/models/IProduct';
import type { IUpdateProduct } from '../domain/models/IUpdateProduct';
import type { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<IProduct> {
    const redisCache = new RedisCache();
    const product = await this.productsRepository.findById(Number(id));

    if (!product) {
      throw new AppError('Product not found!', 404);
    }

    const productExist = await this.productsRepository.findByName(name);

    if (productExist && productExist.id !== product.id) {
      throw new AppError('There is already one product with this name', 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    return product;
  }
}
