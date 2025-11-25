import AppDataSource from '@shared/infra/typeorm/data-source';
import { Customer } from '../entities/Customer';
import type {
  ICustomersRepositories,
  Pagination,
} from '../../../domain/repositories/ICustomersRepositories';
import type { ICreateCustomer } from '../../../domain/models/ICreateCustomer';
import type { ICustomer } from '../../../domain/models/ICustomer';
import { Repository } from 'typeorm';

export default class CustomerRepository implements ICustomersRepositories {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Customer);
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ email });

    return customer;
  }

  async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = this.ormRepository.create({ name, email });

    await this.ormRepository.save(customer);

    return customer;
  }

  async save(customer: ICustomer): Promise<ICustomer> {
    await this.ormRepository.save(customer);

    return customer;
  }

  async remove(customer: ICustomer): Promise<void> {
    await this.ormRepository.remove(customer);

    return;
  }

  async findById(id: number): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ id });

    return customer;
  }

  async findAndCount({
    take,
    skip,
  }: Pagination): Promise<[ICustomer[], number]> {
    const [customers, count] = await this.ormRepository.findAndCount({
      take: take,
      skip: skip,
    });

    return [customers, count];
  }

  async findByName(name: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ name });

    return customer;
  }
}
