import type { IProduct } from '../models/IProduct';
import type { ICreateProduct } from '../models/ICreateProduct';

export interface IFindProducts {
  id: number;
}

export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | null>;
  findById(id: number): Promise<IProduct | null>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(product: IProduct | IProduct[]): Promise<IProduct | IProduct[]>;
  remove(product: IProduct): Promise<void>;
  find(): Promise<IProduct[]>;
}
