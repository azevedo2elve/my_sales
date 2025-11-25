import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import type { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import type { IOrder } from '../domain/models/IOrder';

@injectable()
export class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  async execute(id: string): Promise<IOrder> {
    const order = await this.ordersRepository.findById(Number(id));

    if (!order) {
      throw new AppError('Order not found');
    }

    return order;
  }
}
