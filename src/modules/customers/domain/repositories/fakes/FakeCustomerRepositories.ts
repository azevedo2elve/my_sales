import { Customer } from '../../../infra/database/entities/Customer';
import type { ICreateCustomer } from '../../models/ICreateCustomer';
import type { ICustomer } from '../../models/ICustomer';
import type {
  ICustomersRepositories,
  Pagination,
} from '../ICustomersRepositories';
import { v4 as uuidv4 } from 'uuid';

export default class FakeCustomerRepositories
  implements ICustomersRepositories
{
  private customers: ICustomer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = new Customer();

    customer.id = this.customers.length + 1;
    customer.name = name;
    customer.email = email;
    customer.created_at = new Date();
    customer.updated_at = new Date();

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: ICustomer): Promise<ICustomer | null> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: ICustomer): Promise<void> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers.splice(findIndex, 1);
  }

  public async findAll(): Promise<ICustomer[] | undefined> {
    return undefined;
  }

  public async findByName(name: string): Promise<ICustomer | null> {
    const customer = this.customers.find(
      findCustomer => findCustomer.name === name,
    );

    return (customer as Customer) || null;
  }

  public async findById(id: number): Promise<ICustomer | null> {
    const customer = this.customers.find(
      findCustomer => findCustomer.id === id,
    );

    return (customer as Customer) || null;
  }

  public async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = this.customers.find(
      findCustomer => findCustomer.email === email,
    );
    return (customer as Customer) || null;
  }

  findAndCount(pagination: Pagination): Promise<[ICustomer[], number]> {
    const { skip = 0, take = 10 } = pagination;
    const data = this.customers.slice(skip, skip + take);
    return Promise.resolve([data, this.customers.length]);
  }
}
