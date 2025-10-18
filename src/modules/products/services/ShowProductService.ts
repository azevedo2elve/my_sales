import AppError from '../../../shared/errors/AppError';
import type { Product } from '../database/entities/Product';
import { productsRepositories } from '../database/repositories/ProductRepositories';

interface IShowProduct {
  id: string;
}

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepositories.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product;
  }
}
