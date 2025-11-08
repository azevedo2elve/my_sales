import type { Customer } from '../database/entities/Customer';
import { customerRepository } from '../database/repositories/customer.repository';

export default class ListCustomerService {
  async execute(): Promise<Customer[]> {
    const customers = await customerRepository.find();
    return customers;
  }
}
