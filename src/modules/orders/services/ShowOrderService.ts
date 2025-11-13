import AppError from '../../../shared/errors/AppError';
import type { Order } from '../database/entities/Order';
import { orderRepository } from '../database/repositories/order.repository';

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const order = await orderRepository.findById(Number(id));

    if (!order) {
      throw new AppError('Order not found');
    }

    return order;
  }
}
