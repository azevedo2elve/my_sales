import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import type { IShowCustomer } from '../domain/models/IShowCustomer';
import type { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';
import type { Customer } from '../infra/database/entities/Customer';

@injectable()
export default class ShowCustomerService {
  constructor(
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomersRepositories,
  ) {}

  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer;
  }
}
