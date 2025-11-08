import AppError from '@shared/errors/AppError';
import type { Customer } from '../database/entities/Customer';
import { customerRepository } from '../database/repositories/customer.repository';

interface IUpdateCustomer {
  id: number;
  name: string;
  email: string;
}

export default class UpdateCustomerService {
  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const customerExist = await customerRepository.findByEmail(email);

    if (customerExist && email !== customer.email) {
      throw new AppError('There is already one customer with this email', 409);
    }

    customer.name = name;
    customer.email = email;

    await customerRepository.save(customer);

    return customer;
  }
}
