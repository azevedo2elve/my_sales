import { Product } from '../database/entities/Product';
import { productRepository } from '../database/repository/product.repository';

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const products = await productRepository.find();
    return products;
  }
}
