import RedisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import type { Product } from '../database/entities/Product';
import { productRepository } from '../database/repository/product.repository';

interface IUpdateProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const product = await productRepository.findById(Number(id));

    if (!product) {
      throw new AppError('Product not found!', 404);
    }

    const productExist = await productRepository.findByName(name);

    if (productExist) {
      throw new AppError('There is already one product with this name', 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productRepository.save(product);

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    return product;
  }
}
