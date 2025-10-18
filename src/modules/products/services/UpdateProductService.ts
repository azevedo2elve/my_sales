import AppError from '../../../shared/errors/AppError';
import type { Product } from '../database/entities/Product';
import { productsRepositories } from '../database/repositories/ProductRepositories';

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
    const product = await productsRepositories.findById(id);

    if (!product) {
      throw new AppError('Product not found!', 404);
    }

    const productExist = await productsRepositories.findByName(name);

    if (productExist) {
      throw new AppError('There is already one product with this name', 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepositories.save(product);

    return product;
  }
}
