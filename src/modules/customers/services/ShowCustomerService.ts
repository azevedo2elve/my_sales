import AppError from '../../../shared/errors/AppError';
import type { Customer } from '../infra/database/entities/Customer';
import { customerRepository } from '../infra/database/repositories/customer.repository';

interface IShowCustomer {
  id: number;
}

export default class ShowCustomerService {
  async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer;
  }
}
