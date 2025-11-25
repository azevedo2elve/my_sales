interface IOrderProduct {
  id: number;
  quantity: number;
}

interface ICreateOrder {
  customer_id: number;
  products: IOrderProduct[];
}

export type { ICreateOrder };
