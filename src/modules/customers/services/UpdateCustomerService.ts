import AppError from '@shared/errors/AppError';
import type { Customer } from '../infra/database/entities/Customer';
import type { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import type { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class UpdateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomersRepositories,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const customerExist = await this.customerRepository.findByEmail(email);

    if (customerExist && email !== customer.email) {
      throw new AppError('There is already one customer with this email', 409);
    }

    customer.name = name;
    customer.email = email;

    await this.customerRepository.save(customer);

    return customer;
  }
}
