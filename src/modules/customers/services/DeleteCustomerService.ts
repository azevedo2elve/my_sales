import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import type { IDeleteCustomer } from '../domain/models/IDeleteCustomer';
import type { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';

@injectable()
export default class DeleteCustomerService {
  constructor(
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomersRepositories,
  ) {}

  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    await this.customerRepository.remove(customer);
  }
}
