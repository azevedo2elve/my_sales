import { Order } from '../../../database/entities/Order';
import { OrdersProducts } from '../../../database/entities/OrdersProducts';
import type { IOrder } from '../../models/IOrder';
import type { IOrdersRepository } from '../IOrdersRepository';
import type { Customer } from '../../../../customers/infra/database/entities/Customer';

interface IOrderProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface ICreateOrderData {
  customer: Customer;
  products: IOrderProduct[];
}

export default class FakeOrdersRepository implements IOrdersRepository {
  private orders: IOrder[] = [];
  private orderProductsIdCounter = 1;

  public async findById(id: number): Promise<IOrder | null> {
    const order = this.orders.find(o => o.id === id);
    return order || null;
  }

  public async createOrder(data: ICreateOrderData): Promise<IOrder> {
    const order = new Order();

    order.id = this.orders.length + 1;
    order.customer = data.customer;
    order.created_at = new Date();
    order.updated_at = new Date();

    order.order_products = data.products.map(product => {
      const orderProduct = new OrdersProducts();
      orderProduct.id = this.orderProductsIdCounter++;
      orderProduct.order_id = order.id;
      orderProduct.product_id = product.product_id;
      orderProduct.quantity = product.quantity;
      orderProduct.price = product.price;
      orderProduct.created_at = new Date();
      orderProduct.updated_at = new Date();
      return orderProduct;
    });

    this.orders.push(order);

    return order;
  }
}
