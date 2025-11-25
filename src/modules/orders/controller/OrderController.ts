import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShowOrderService } from '../services/ShowOrderService';
import CreateOrderService from '../services/CreateOrderService';

export default class OrderController {
  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute(id);

    return response.json(order);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;
    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    return response.json(order);
  }
}
