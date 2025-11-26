import type { Request, Response } from 'express';
import ListCustomerService from '../../../services/ListCustomerService';
import ShowCustomerService from '../../../services/ShowCustomerService';
import CreateCustomerService from '../../../services/CreateCustomerService';
import UpdateCustomerService from '../../../services/UpdateCustomerService';
import DeleteCustomerService from '../../../services/DeleteCustomerService';
import { container } from 'tsyringe';

export default class CustomerController {
  async index(request: Request, response: Response): Promise<Response> {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const listCustomerService = container.resolve(ListCustomerService);
    const customers = await listCustomerService.execute(page, limit);
    return response.json(customers);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const showCustomerService = container.resolve(ShowCustomerService);
    const customer = await showCustomerService.execute({ id });
    return response.json(customer);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomerService = container.resolve(CreateCustomerService);
    const customer = await createCustomerService.execute({
      name,
      email,
    });
    return response.json(customer);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const { name, email } = request.body;
    const updateCustomerService = container.resolve(UpdateCustomerService);
    const customer = await updateCustomerService.execute({
      id,
      name,
      email,
    });
    return response.json(customer);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const deleteCustomerService = container.resolve(DeleteCustomerService);
    await deleteCustomerService.execute({ id });
    return response.status(204).send([]);
  }
}
