import {Product, ProductOrder} from '@gw-models';

export class ProductOrderDetail {
  id?: number;
  quantity?: number;
  product: Product;
  productOrder: ProductOrder;
}
