import AppDataSource from '@shared/infra/typeorm/data-source';
import { Product } from '../entities/Products';

export const productsRepositories = AppDataSource.getRepository(Product).extend(
  {
    async findByName(name: string): Promise<Product | null> {
      return this.findOneBy({ name });
    },

    async findById(id: string): Promise<Product | null> {
      return this.findOneBy({ id });
    },
  },
);
