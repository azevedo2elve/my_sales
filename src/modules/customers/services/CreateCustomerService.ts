import AppError from '@shared/errors/AppError';
import type { Customer } from '../infra/database/entities/Customer';
import type { ICreateCustomer } from '../domain/models/ICreateCustomer';
import type { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomersRepositories,
  ) {}

  public async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const emailExists = await this.customerRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.', 409);
    }

    const customer = await this.customerRepository.create({
      name,
      email,
    });

    return customer;
  }
}
