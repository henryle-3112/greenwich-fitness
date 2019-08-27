import { Product, ProductOrder } from '@gw-models/core';

export class ProductOrderDetail {
  id?: number;
  quantity?: number;
  product: Product;
  productOrder: ProductOrder;
}
